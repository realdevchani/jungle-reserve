package com.app.jungle.domain.dto.request;

import com.app.jungle.domain.entity.Admin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminLoginRequest {
    private String adminId;
    private String password;

//    public  AdminLoginRequest(Admin admin) {
//        this.adminId = admin.getAdminId();
//        this.password = admin.getAdminPassword();
//    }
}
