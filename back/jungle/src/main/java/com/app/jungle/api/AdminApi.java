package com.app.jungle.api;

import com.app.jungle.domain.dto.request.AdminLoginRequest;
import com.app.jungle.domain.dto.response.ApiResponseDTO;
import com.app.jungle.domain.dto.response.UserResponseDTO;
import com.app.jungle.domain.entity.Holiday;
import com.app.jungle.repository.HolidayRepository;
import com.app.jungle.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Profile("admin")
@RequestMapping("/api/admin")
public class AdminApi {

    private final AdminService adminService;
    private final HolidayRepository holidayRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<Map<String, String>>> login(@RequestBody AdminLoginRequest request) {
        Map<String, String> tokens = adminService.login(request.getAdminId(), request.getPassword());
        return ResponseEntity.ok(ApiResponseDTO.of("관리자 로그인 성공", tokens));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponseDTO<List<UserResponseDTO>>> getUsers() {
        return ResponseEntity.ok(ApiResponseDTO.of("유저 목록 조회", adminService.getUsers()));
    }

    @PutMapping("/users/{id}/pin-reset")
    public ResponseEntity<ApiResponseDTO> resetPin(@PathVariable Long id) {
        adminService.resetUserPin(id);
        return ResponseEntity.ok(ApiResponseDTO.of("PIN이 초기화되었습니다."));
    }

    // TODO: 엑셀 업로드 - 엑셀 파일 구조 확인 후 구현
    @PostMapping("/users/upload")
    public ResponseEntity<ApiResponseDTO> uploadExcel() {
        return ResponseEntity.ok(ApiResponseDTO.of("엑셀 업로드 기능은 준비 중입니다."));
    }

    @GetMapping("/holidays")
    public ResponseEntity<ApiResponseDTO<List<Holiday>>> getHolidays() {
        return ResponseEntity.ok(ApiResponseDTO.of("휴무일 목록", holidayRepository.findAllByOrderByHolidayDateAsc()));
    }

    @PostMapping("/holidays")
    public ResponseEntity<ApiResponseDTO> addHoliday(@RequestBody Holiday holiday) {
        holidayRepository.save(holiday);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponseDTO.of("휴무일이 등록되었습니다."));
    }

    @DeleteMapping("/holidays/{id}")
    public ResponseEntity<ApiResponseDTO> deleteHoliday(@PathVariable Long id) {
        holidayRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponseDTO.of("휴무일이 삭제되었습니다."));
    }

    @PostMapping("/rooms/{id}/checkIn")
    public ResponseEntity<ApiResponseDTO> adminCheckIn(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String userPhone = (String) body.get("userPhone");
        int durationHours = body.get("durationHours") != null ? ((Number) body.get("durationHours")).intValue() : 1;
        adminService.adminCheckIn(id, userPhone, durationHours);
        return ResponseEntity.ok(ApiResponseDTO.of("입실 처리되었습니다."));
    }

    @PostMapping("/rooms/{id}/checkOut")
    public ResponseEntity<ApiResponseDTO> adminCheckOut(@PathVariable Long id) {
        adminService.adminCheckOut(id);
        return ResponseEntity.ok(ApiResponseDTO.of("퇴실 처리되었습니다."));
    }
}
