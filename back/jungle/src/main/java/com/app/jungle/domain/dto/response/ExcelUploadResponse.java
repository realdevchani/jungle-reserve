package com.app.jungle.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExcelUploadResponse {
    private String userName;
    private String userPhone;
    private String userParentsPhone;
    private Boolean isMajor;
    private Boolean isNew;
}
