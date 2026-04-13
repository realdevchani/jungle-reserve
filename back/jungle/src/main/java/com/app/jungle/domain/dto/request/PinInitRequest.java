package com.app.jungle.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PinInitRequest {
    private String userName;
    private String userPhone;
    private String userPinNumber;
}
