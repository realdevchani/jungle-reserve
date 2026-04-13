package com.app.jungle.domain.dto;

import lombok.Data;

@Data
public class TokenDTO {
    private Long userId;
    private String accessToken;
    private String refreshToken;
}
