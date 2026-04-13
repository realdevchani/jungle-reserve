package com.app.jungle.service;

import com.app.jungle.domain.dto.TokenDTO;
import com.app.jungle.domain.dto.request.UserLoginRequest;

import java.util.Map;

public interface AuthService {

    // 로그인 -> 성공 시 토큰(AccessToken, RefreshToken)
    public Map<String, String> login(UserLoginRequest userLoginRequest);

    // Redis에 RefreshToken을 저장
    public boolean saveRefreshToken(TokenDTO tokenDTO);

    // Redis에 저장된 RefreshToken이 유효한지 확인
    public boolean validateRefreshToken(TokenDTO tokenDTO);

    // RefreshToken으로 AccessToken을 재발급
    public String reissueAccessToken(TokenDTO tokenDTO);

    // Redis에 등록된 RefreshToken을 무효화
    public boolean revokeRefreshToken(TokenDTO tokenDTO);

    // RefreshToken을 블랙리스트에 추가
    public boolean saveBlacklistedToken(TokenDTO tokenDTO);

    // RefreshToken이 블랙리스트인지 확인
    public boolean isBlackedRefreshToken(TokenDTO tokenDTO);

}
