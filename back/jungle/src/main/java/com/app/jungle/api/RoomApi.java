package com.app.jungle.api;

import com.app.jungle.domain.dto.response.ApiResponseDTO;
import com.app.jungle.domain.dto.response.RoomResponseDTO;
import com.app.jungle.domain.dto.response.UserResponseDTO;
import com.app.jungle.domain.entity.Holiday;
import com.app.jungle.domain.entity.User;
import com.app.jungle.repository.HolidayRepository;
import com.app.jungle.service.RoomService;
import com.app.jungle.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomApi {

    private final RoomService roomService;
    private final UserService userService;
    private final HolidayRepository holidayRepository;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<RoomResponseDTO>>> getRooms() {
        return ResponseEntity.ok(ApiResponseDTO.of("연습실 목록 조회", roomService.getRoomList()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponseDTO<RoomResponseDTO>> getMyRoom(Authentication authentication) {
        User user = getUser(authentication);
        RoomResponseDTO myRoom = roomService.getMyActiveRoom(user);
        return ResponseEntity.ok(ApiResponseDTO.of("내 활성 연습실 조회", myRoom));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO> getRoom(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDTO.of("연습실 조회", new RoomResponseDTO(roomService.getRoomById(id))));
    }

    @PostMapping("/{id}/reserve")
    public ResponseEntity<ApiResponseDTO> reserve(@PathVariable Long id,
                                                  @RequestBody Map<String, Integer> body,
                                                  Authentication authentication) {
        User user = getUser(authentication);
        int hours = body.getOrDefault("durationHours", 1);
        roomService.reserveRoom(user, id, hours);
        return ResponseEntity.ok(ApiResponseDTO.of("예약이 완료되었습니다"));
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<ApiResponseDTO> checkIn(@PathVariable Long id,
                                                  @RequestBody Map<String, Integer> body,
                                                  Authentication authentication) {
        User user = getUser(authentication);
        int hours = body.getOrDefault("durationHours", 1);
        roomService.checkInRoom(user, id, hours);
        return ResponseEntity.ok(ApiResponseDTO.of("입실 처리되었습니다"));
    }

    @PostMapping("/{id}/extend")
    public ResponseEntity<ApiResponseDTO> extend(@PathVariable Long id,
                                                 @RequestBody Map<String, Integer> body,
                                                 Authentication authentication) {
        User user = getUser(authentication);
        int hours = body.getOrDefault("addHours", 1);
        roomService.extendRoom(user, id, hours);
        return ResponseEntity.ok(ApiResponseDTO.of("연장 처리되었습니다"));
    }

    @PostMapping("/{id}/away")
    public ResponseEntity<ApiResponseDTO> away(@PathVariable Long id, Authentication authentication) {
        User user = getUser(authentication);
        roomService.awayRoom(user, id);
        return ResponseEntity.ok(ApiResponseDTO.of("외출 처리되었습니다"));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponseDTO> returnRoom(@PathVariable Long id, Authentication authentication) {
        User user = getUser(authentication);
        roomService.returnRoom(user, id);
        return ResponseEntity.ok(ApiResponseDTO.of("복귀 처리되었습니다"));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponseDTO> cancelReservation(@PathVariable Long id, Authentication authentication) {
        User user = getUser(authentication);
        roomService.cancelReservation(user, id);
        return ResponseEntity.ok(ApiResponseDTO.of("예약이 취소되었습니다"));
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<ApiResponseDTO> checkOut(@PathVariable Long id, Authentication authentication) {
        User user = getUser(authentication);
        roomService.checkOutRoom(user, id);
        return ResponseEntity.ok(ApiResponseDTO.of("퇴실 처리되었습니다"));
    }

    @GetMapping("/{id}/reserve-ttl")
    public ResponseEntity<ApiResponseDTO<Long>> getReserveTtl(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDTO.of("예약 TTL", roomService.getReserveTtl(id)));
    }

    @GetMapping("/{id}/away-ttl")
    public ResponseEntity<ApiResponseDTO<Long>> getAwayTtl(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDTO.of("외출 TTL", roomService.getAwayTtl(id)));
    }

    @GetMapping("/holiday-today")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> checkHolidayToday() {
        Map<String, Object> result = new HashMap<>();
        Holiday holiday = holidayRepository.findByHolidayDate(LocalDate.now());
        result.put("isHoliday", holiday != null);
        result.put("reason", holiday != null ? holiday.getReason() : null);
        return ResponseEntity.ok(ApiResponseDTO.of("휴무일 확인", result));
    }

    private User getUser(Authentication authentication) {
        UserResponseDTO userDTO = (UserResponseDTO) authentication.getPrincipal();
        return userService.findUserById(userDTO.getId());
    }
}
