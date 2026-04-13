package com.app.jungle.service;

import com.app.jungle.domain.dto.TokenDTO;
import com.app.jungle.domain.dto.request.UserLoginRequest;
import com.app.jungle.domain.entity.User;
import com.app.jungle.exception.AuthException;
import com.app.jungle.exception.JwtTokenException;
import com.app.jungle.exception.UserException;
import com.app.jungle.repository.UserRepository;
import com.app.jungle.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service @Slf4j
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AuthServiceImpl implements AuthService {

    @Value("${jwt.token-blacklist-prefix}")
    private String BLACKLIST_TOKEN_PREFIX;

    @Value("${jwt.refresh-blacklist-prefix}")
    private String REFRESH_TOKEN_PREFIX;

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate redisTemplate;

    @Override
    public Map<String, String> login(UserLoginRequest userLoginRequest) {

        Map<String, String> claim = new HashMap<>();
        Map<String, String> tokens = new HashMap<>();

        // 1. 이름 + 전화번호로 회원 조회
        User foundUser = userRepository.findUserByUserNameAndUserPhone(
                userLoginRequest.getUserName(),
                userLoginRequest.getUserPhone()
        ).orElseThrow(() -> new UserException("이름 또는 전화번호를 확인해주세요"));

        // 2. PIN 초기화 여부 먼저 확인 (PIN이 null인 신규 유저 처리)
        if(!foundUser.getUserPinInitialized()){
            Map<String, String> pinRequired = new HashMap<>();
            pinRequired.put("pinRequired", "true");
            pinRequired.put("userName", foundUser.getUserName());
            pinRequired.put("userPhone", foundUser.getUserPhone());
            return pinRequired;
        }

        // 3. PIN 번호 BCrypt 비교
        if(!passwordEncoder.matches(userLoginRequest.getUserPinNumber(), foundUser.getUserPinNumber())) {
            throw new UserException("PIN 번호를 확인해주세요");
        }

        // 3. 토큰 생성
        claim.put("userPhone", foundUser.getUserPhone());
        String accessToken = jwtTokenUtil.generateAccessToken(claim);
        String refreshToken = jwtTokenUtil.generateRefreshToken(claim);

        // 3. 토큰을 Redis에 저장
        TokenDTO tokenDTO = new TokenDTO();
        tokenDTO.setUserId(foundUser.getId());
        tokenDTO.setRefreshToken(refreshToken);
        tokenDTO.setAccessToken(accessToken);
        saveRefreshToken(tokenDTO);

        // 4. 클라이언트에 토큰 반환
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }

    @Override
    public boolean saveRefreshToken(TokenDTO tokenDTO) {
        Long id = tokenDTO.getUserId();
        String refreshToken = tokenDTO.getRefreshToken();
        try {
            String key = REFRESH_TOKEN_PREFIX + id;
            redisTemplate.opsForValue().set(key, refreshToken, 7, TimeUnit.DAYS);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean validateRefreshToken(TokenDTO tokenDTO) {
        Long id = tokenDTO.getUserId();
        String refreshToken = tokenDTO.getRefreshToken();

        String key = REFRESH_TOKEN_PREFIX + id;
        try {
            String storedToken = redisTemplate.opsForValue().get(key).toString();
            if(!refreshToken.equals(storedToken)) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String reissueAccessToken(TokenDTO tokenDTO) {
        Map<String, String> claim = new HashMap<>();

        // 토큰에서 userPhone을 가져온다.
        String userPhone = (String) jwtTokenUtil.getUserPhoneFromToken(tokenDTO.getRefreshToken()).get("userPhone");
        User foundUser = userRepository.findUserByUserPhone(userPhone)
                .orElseThrow(() -> new UserException("회원 정보를 찾을 수 없습니다"));
        tokenDTO.setUserId(foundUser.getId());

        // 1. 기존 RefreshToken 블랙리스트인지 확인
        if(isBlackedRefreshToken(tokenDTO)) {
            throw new JwtTokenException("이미 로그아웃된 토큰입니다. 다시 로그인하세요");
        }

        // 2. 리프레쉬 토큰 검증
        if(!validateRefreshToken(tokenDTO)) {
            throw new JwtTokenException("Refresh Token이 유효하지 않습니다. 다시 로그인하세요");
        }

        // 3. 새로운 AccessToken 발급
        claim.put("userPhone", foundUser.getUserPhone());
        String newAccessToken = jwtTokenUtil.generateAccessToken(claim);
        return newAccessToken;
    }

    @Override
    public boolean revokeRefreshToken(TokenDTO tokenDTO) {
        Long id = tokenDTO.getUserId();
        String refreshToken = tokenDTO.getRefreshToken();
        String key = REFRESH_TOKEN_PREFIX + id;

        try {
            String storedToken = redisTemplate.opsForValue().get(key).toString();
            if(storedToken != null && !storedToken.equals(refreshToken)) {
                redisTemplate.delete(key);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    // 탈취 방어
    @Override
    public boolean saveBlacklistedToken(TokenDTO tokenDTO) {

        // 토큰에서 userPhone을 가져온다.
        String userPhone = (String) jwtTokenUtil.getUserPhoneFromToken(tokenDTO.getRefreshToken()).get("userPhone");
        User foundUser = userRepository.findUserByUserPhone(userPhone)
                .orElseThrow(() -> new UserException("회원 정보를 찾을 수 없습니다"));
        Long id = foundUser.getId();
        String refreshToken = tokenDTO.getRefreshToken();
        String key = BLACKLIST_TOKEN_PREFIX + id;

        try {
            redisTemplate.opsForSet().add(key, refreshToken);
            // TTL 설정
            redisTemplate.expire(key, 7, TimeUnit.DAYS);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean isBlackedRefreshToken(TokenDTO tokenDTO) {
        Long id = tokenDTO.getUserId();
        String refreshToken = tokenDTO.getRefreshToken();
        String key = BLACKLIST_TOKEN_PREFIX + id;

        try {
            Boolean isMember = redisTemplate.opsForSet().isMember(key, refreshToken);
            return isMember != null && isMember;
        } catch (Exception e) {
            return false;
        }
    }
}
