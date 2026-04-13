package com.app.jungle.domain.dto.request;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String userName;
    private String userPinNumber;
    private String userPhone;
}
