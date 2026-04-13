package com.app.jungle.util;

import com.app.jungle.exception.JwtTokenException;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

@Component
@Slf4j
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    // Access Token 생성 (user: userPhone, admin: adminId + role)
    public String generateAccessToken(Map<String, String> claims) {
        Long expirationTimeInMillis = 1000 * 60L * 60L * 24 * 60L;
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTimeInMillis);

        var builder = Jwts.builder()
                .setExpiration(expirationDate)
                .setIssuer("jungle")
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .setHeaderParam("type", "JWT");
        for (Map.Entry<String, String> e : claims.entrySet()) {
            if (e.getValue() != null) {
                builder.claim(e.getKey(), e.getValue());
            }
        }
        return builder.compact();
    }

    // Refresh Token 생성
    public String generateRefreshToken(Map<String, String> claims) {
        String userPhone = claims.get("userPhone");

        Long expirationTimeInMillis =   1000 * 60L * 60L * 24 * 60L;
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTimeInMillis);

        return Jwts.builder()
                .claim("userPhone", userPhone) // 클레임 추가(전화번호)
                .setExpiration(expirationDate) // 만료시간
                .setIssuer("jungle")
                .signWith(SignatureAlgorithm.HS256, secretKey) // SHA-256 알고리즘
                .setHeaderParam("type", "JWT") // JWT 타입
                .compact(); // 생성
    }

    // 토큰이 유효한지 검사
    public boolean verifyJwtToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) { // 파싱이 안될 때
            return false;
        } catch (JwtException | IllegalArgumentException e) { // 변조된 토큰, 잘못된 토큰
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // 토큰으로 전화번호 정보를 추출
    public Claims getUserPhoneFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            return null;
        }
    }

    // 토큰의 남은 시간을 확인
    public Long getTokenExpiry(String token){
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date expiration = claims.getExpiration();
            Date now = new Date();

            Long remainingTime = expiration.getTime() - now.getTime(); // ms
            return remainingTime > 0 ? remainingTime : 0L;
        } catch (ExpiredJwtException e) { // 파싱이 안될 때
            return 0L;
        } catch (JwtException | IllegalArgumentException e) { // 변조된 토큰, 잘못된 토큰
            throw new JwtTokenException("유효하지 않은 토큰");
        }
    }

}
