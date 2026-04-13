package com.app.jungle.service;

import com.app.jungle.domain.dto.response.UserResponseDTO;

import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, String> login(String loginId, String password);
    List<UserResponseDTO> getUsers();
    void resetUserPin(Long userId);
    void adminCheckIn(Long roomId, String userPhone, int durationHours);
    void adminCheckOut(Long roomId);
}
