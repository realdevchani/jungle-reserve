package com.app.jungle.api.privateapi;

import com.app.jungle.domain.dto.response.ApiResponseDTO;
import com.app.jungle.domain.dto.response.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private/users/*")
@RequiredArgsConstructor
@Slf4j
@Profile("user")
public class UserAuthApi {

    @GetMapping("me")
    public ResponseEntity<ApiResponseDTO> me(Authentication authentication){
        UserResponseDTO currentUser = (UserResponseDTO) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseDTO.of("로그인 성공", currentUser));
    }

}
