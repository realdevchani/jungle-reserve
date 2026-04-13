package com.app.jungle.api;

import com.app.jungle.domain.dto.response.ApiResponseDTO;
import com.app.jungle.domain.entity.User;
import com.app.jungle.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/users/*")
public class UserApi {

    private final UserService userService;

    // 회원 단 건 등록
    @PostMapping("register")
    public ResponseEntity<ApiResponseDTO> register(@RequestBody User user){
        userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseDTO.of("회원 등록이 완료되었습니다"));
    }

    // 회원 전체 등록 (관리자 용)
    @PostMapping("register-all")
    public ResponseEntity<ApiResponseDTO> registerAll(@RequestBody List<User> users){
        userService.registerUsers(users);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseDTO.of("회원 전체 등록이 완료되었습니다"));
    }

    // 회원 정보 수정
    @PutMapping("modify")
    public ResponseEntity<ApiResponseDTO> modify(@RequestBody User user){
        userService.modifyUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponseDTO.of("정보 수정이 완료되었습니다"));
    }

}
