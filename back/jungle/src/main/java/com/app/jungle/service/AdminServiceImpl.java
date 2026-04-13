package com.app.jungle.service;

import com.app.jungle.domain.dto.response.UserResponseDTO;
import com.app.jungle.domain.entity.Admin;
import com.app.jungle.domain.entity.Room;
import com.app.jungle.domain.entity.User;
import com.app.jungle.exception.AuthException;
import com.app.jungle.exception.RoomException;
import com.app.jungle.exception.UserException;
import com.app.jungle.repository.AdminRepository;
import com.app.jungle.repository.RoomRepository;
import com.app.jungle.repository.UserRepository;
import com.app.jungle.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomService roomService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public Map<String, String> login(String loginId, String password) {
        Admin admin = adminRepository.findByAdminId(loginId)
                .orElseThrow(() -> new AuthException("관리자 정보를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(password, admin.getAdminPassword())) {
            throw new AuthException("비밀번호가 일치하지 않습니다.");
        }

        Map<String, String> claim = new HashMap<>();
        claim.put("adminId", admin.getAdminId());
        claim.put("role", "ADMIN");

        Map<String, String> result = new HashMap<>();
        result.put("accessToken", jwtTokenUtil.generateAccessToken(claim));
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserResponseDTO.builder()
                        .id(user.getId())
                        .userName(user.getUserName())
                        .userPhone(user.getUserPhone())
                        .totalPracticeMinutes(user.getUserTotalPracticeMinutes())
                        .pinInitialized(user.getUserPinInitialized())
                        .build())
                .toList();
    }

    @Override
    public void resetUserPin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("사용자를 찾을 수 없습니다."));
        String defaultPin = passwordEncoder.encode("0000");
        user.resetPinNumber(defaultPin);
        userRepository.save(user);
    }

    @Override
    public void adminCheckIn(Long roomId, String userPhone, int durationHours) {
        User user = userRepository.findUserByUserPhone(userPhone)
                .orElseThrow(() -> new UserException("해당 전화번호로 등록된 원생을 찾을 수 없습니다."));
        roomService.checkInRoom(user, roomId, durationHours);
    }

    @Override
    public void adminCheckOut(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomException("연습실을 찾을 수 없습니다."));
        User currentUser = room.getCurrentUser();
        if (currentUser == null) {
            throw new RoomException("해당 연습실에 입실 중인 원생이 없습니다.");
        }
        roomService.checkOutRoom(currentUser, roomId);
    }
}
