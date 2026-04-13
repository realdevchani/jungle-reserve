package com.app.jungle.exception;

import com.app.jungle.domain.dto.response.ApiResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Member 관련
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleMemberException(UserException e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponseDTO.of(e.getMessage()));
    }

    // Auth 예외
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleAuthException(AuthException e){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponseDTO.of(e.getMessage()));
    }

    // Token 예외
    @ExceptionHandler(JwtTokenException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleTokenException(JwtTokenException e){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponseDTO.of(e.getMessage()));
    }

    // 모든 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleException(Exception e){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponseDTO.of(e.getMessage()));
    }
}
