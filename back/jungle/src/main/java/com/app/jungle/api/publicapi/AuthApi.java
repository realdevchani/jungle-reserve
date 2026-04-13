package com.app.jungle.api.publicapi;

import com.app.jungle.domain.dto.TokenDTO;
import com.app.jungle.domain.dto.request.UserLoginRequest;
import com.app.jungle.domain.dto.response.ApiResponseDTO;
import com.app.jungle.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/auth/*")

public class AuthApi {

    private final AuthService authService;

    // 로그인
    @PostMapping("login")
    public ResponseEntity<ApiResponseDTO> login(@RequestBody UserLoginRequest userLoginRequest){
        Map<String, String> tokens = authService.login(userLoginRequest);

        // refreshToken은 cookie로 전달
        // XSS 탈취 위험을 방지하기 위해서 httpOnly로 안전하게 처리한다.
        String refreshToken = tokens.get("refreshToken");
        ResponseCookie cookie = ResponseCookie.from("refreshToken",  refreshToken)
                .httpOnly(true) // *필수
//                .secure(true) // https에서 사용
                .path("/") // 모든 경로에 쿠키 전송 사용
                .maxAge(60 * 60 * 24 * 7)
                .build();

        tokens.remove("refreshToken");
        // accessToken은 그대로 발급
        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString()) // 브라우저에 쿠키를 심는다.
                .body(ApiResponseDTO.of("로그인이 성공했습니다", tokens));
    }

    // 토큰 재발급
    @PostMapping("refresh")
    public ResponseEntity<ApiResponseDTO> refresh(@CookieValue("refreshToken") String refreshToken, @RequestBody TokenDTO tokenDTO){
        Map<String, String> response = new HashMap<>();
        tokenDTO.setRefreshToken(refreshToken);
        String newAccessToken = authService.reissueAccessToken(tokenDTO);
        response.put("accessToken", newAccessToken);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseDTO.of("토큰이 재발급 되었습니다", response));
    }

}
