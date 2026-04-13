package com.app.jungle.service;

import com.app.jungle.domain.dto.response.RoomResponseDTO;
import com.app.jungle.domain.entity.PracticeLog;
import com.app.jungle.domain.entity.Room;
import com.app.jungle.domain.entity.User;
import com.app.jungle.domain.enums.room.RoomStatus;
import com.app.jungle.exception.RoomException;
import lombok.extern.slf4j.Slf4j;
import com.app.jungle.repository.HolidayRepository;
import com.app.jungle.repository.PracticeRepository;
import com.app.jungle.repository.RoomRepository;
import com.app.jungle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final StringRedisTemplate redisTemplate;
    private final PracticeRepository practiceRepository;
    private final HolidayRepository holidayRepository;

    private static final String RESERVE_KEY = "reserve:room:";
    private static final String AWAY_KEY = "away:room:";
    private static final long TTL_MINUTES = 10;


    @Override
    public List<RoomResponseDTO> getRoomList() {
        List<RoomResponseDTO> foundRooms = roomRepository.findAllByOrderByIdAsc().stream().map(RoomResponseDTO::new).toList();
        return foundRooms;
    }

    @Override
    public Room getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RoomException("연습실 불러오기에 실패했습니다."));
        return room;
    }

    @Override
    public RoomResponseDTO getMyActiveRoom(User user) {
        return roomRepository.findByCurrentUser(user)
                .map(RoomResponseDTO::new)
                .orElse(null);
    }

    @Override
    public void reserveRoom(User user, Long roomId, int useTime) {
        validateNotHoliday();
        validateNoActiveRoom(user);
        Room room = getRoomForUpdate(roomId);
        room.reserve(user, useTime);
        setReserveTtl(roomId, user.getId());
        broadcastRooms();
    }


    @Override
    public void checkInRoom(User user, Long roomId, int useTime) {
        validateNotHoliday();

        // 다른 방에 예약(RESERVED) 상태가 있으면 자동 취소
        roomRepository.findByCurrentUser(user).ifPresent(existingRoom -> {
            if (!existingRoom.getId().equals(roomId) && existingRoom.getRoomStatus() == RoomStatus.RESERVED) {
                log.info("다른 방 입실로 인한 자동 예약취소 - Room {} → Room {}", existingRoom.getId(), roomId);
                existingRoom.clearRoom();
                roomRepository.save(existingRoom);
                redisTemplate.delete(RESERVE_KEY + existingRoom.getId());
            }
        });

        Room foundRoom = roomRepository.findByIdForUpdate(roomId).orElseThrow(() -> new RoomException("조회 중 에러. reserveService checkInRoom"));
        foundRoom.checkIn(user, useTime);

        redisTemplate.delete(RESERVE_KEY + roomId);
        broadcastRooms();

//        연습 테이블 생성 -> 생성 시 연습 시간 checkIn 시간과 동일
        PracticeLog practiceLog = PracticeLog.builder()
                .room(foundRoom)
                .user(user)
                .build();
        practiceRepository.save(practiceLog);
    }

    @Override
    public void awayRoom(User user, Long roomId) {
        Room foundRoom = roomRepository.findByIdForUpdate(roomId).orElseThrow(() -> new RoomException("조회 중 에러. roomService awayRoom"));
        if (!foundRoom.isMatchedUser(user.getId())) {
            throw new RoomException("본인이 사용 중인 연습실만 외출 처리할 수 있습니다.");
        }
        foundRoom.awayRoom();
        redisTemplate.opsForValue().set(AWAY_KEY + roomId, String.valueOf(user.getId()), TTL_MINUTES, TimeUnit.MINUTES);
        broadcastRooms();
    }

    @Override
    public void returnRoom(User user, Long roomId) {
        String value = redisTemplate.opsForValue().get(AWAY_KEY + roomId);
        if(value == null){
            throw new RoomException("외출 복귀 시간을 초과하였습니다. roomService returnRoom");
        }else {
            Room foundRoom = roomRepository.findByIdForUpdate(roomId).orElseThrow(() -> new RoomException("조회 중 에러. roomService returnRoom"));
            foundRoom.returnRoom();
            redisTemplate.delete(AWAY_KEY + roomId);
            broadcastRooms();
        }
    }

    @Override
    public void extendRoom(User user, Long roomId, int addHours) {
        Room foundRoom = roomRepository.findByIdForUpdate(roomId).orElseThrow(() -> new RoomException("조회 중 에러. roomService extendRoom"));

        foundRoom.addExpiredTime(addHours);

        broadcastRooms();
    }

    @Override
    public void cancelReservation(User user, Long roomId) {
        Room foundRoom = roomRepository.findByIdForUpdate(roomId).orElseThrow(() -> new RoomException("조회 중 에러. roomService cancelReservation"));
        if (foundRoom.getRoomStatus() != RoomStatus.RESERVED) {
            throw new RoomException("예약 상태가 아닙니다.");
        }
        if (!foundRoom.isMatchedUser(user.getId())) {
            throw new RoomException("본인의 예약만 취소할 수 있습니다.");
        }
        foundRoom.clearRoom();
        redisTemplate.delete(RESERVE_KEY + roomId);
        broadcastRooms();
    }

    @Override
    public void checkOutRoom(User user, Long roomId) {
        Room foundRoom = roomRepository.findByIdForUpdate(roomId).orElseThrow(() -> new RoomException("조회 중 에러. roomService checkOutRoom"));
        if (foundRoom.getCurrentUser() == null || !foundRoom.isMatchedUser(user.getId())) {
            throw new RoomException("본인이 사용 중인 연습실만 퇴실할 수 있습니다.");
        }

        practiceRepository.findFirstByUserAndEndAtIsNullOrderByStartAtDesc(user).ifPresent(practiceLog -> {
            practiceLog.checkOut();
            practiceRepository.save(practiceLog);
        });

        foundRoom.clearRoom();

        redisTemplate.delete(AWAY_KEY + roomId);

        broadcastRooms();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getReserveTtl(Long roomId) {
        return redisTemplate.getExpire(RESERVE_KEY + roomId, TimeUnit.SECONDS);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getAwayTtl(Long roomId) {
        return redisTemplate.getExpire(AWAY_KEY + roomId, TimeUnit.SECONDS);
    }

    @Override
    public void handleExpiredKey(String expiredKey) {
        if (expiredKey.startsWith(RESERVE_KEY)) {
            Long roomId = extractRoomId(expiredKey, RESERVE_KEY);
            Room room = roomRepository.findById(roomId).orElse(null);
            if (room != null && room.getRoomStatus() == RoomStatus.RESERVED) {
                log.info("예약 자동취소 - Room {}", roomId);
                room.clearRoom();
                roomRepository.save(room);
                broadcastRooms();
            }
        } else if (expiredKey.startsWith(AWAY_KEY)) {
            Long roomId = extractRoomId(expiredKey, AWAY_KEY);
            Room room = roomRepository.findById(roomId).orElse(null);
            if (room != null && room.getRoomStatus() == RoomStatus.AWAY) {
                log.info("외출 자동퇴실 - Room {}", roomId);
                User user = room.getCurrentUser();
                if (user != null) {
                    practiceRepository.findFirstByUserAndEndAtIsNullOrderByStartAtDesc(user).ifPresent(practiceLog -> {
                        practiceLog.checkOut();
                        practiceRepository.save(practiceLog);
                    });
                }
                room.clearRoom();
                roomRepository.save(room);
                broadcastRooms();
            }
        }
    }

    private Long extractRoomId(String key, String prefix) {
        return Long.parseLong(key.substring(prefix.length()));
    }

    private void validateNotHoliday() {
        if (holidayRepository.existsByHolidayDate(LocalDate.now())) {
            throw new RoomException("오늘은 휴무일입니다.");
        }
    }
    // 상태 변경 후 호출하는 브로드캐스트 메서드
    private void broadcastRooms() {
        List<RoomResponseDTO> rooms = roomRepository.findAllByOrderByIdAsc()
                .stream()
                .map(RoomResponseDTO::new)
                .toList();
        messagingTemplate.convertAndSend("/topic/rooms", rooms);
    }

    // 1. 락 걸고 방 조회
    private Room getRoomForUpdate(Long roomId) {
        return roomRepository.findByIdForUpdate(roomId)
                .orElseThrow(() -> new RoomException("연습실 조회에 실패했습니다."));
    }

    // 2. 중복 예약/사용 검증
    private void validateNoActiveRoom(User user) {
        roomRepository.findByCurrentUser(user).ifPresent(existingRoom -> {
            throw new RoomException("이미 다른 연습실(" + existingRoom.getId() + "번)을 사용 중입니다.");
        });
    }

    // 3. Redis 예약 TTL 세팅
    private void setReserveTtl(Long roomId, Long userId) {
        redisTemplate.opsForValue().set(
                RESERVE_KEY + roomId,
                String.valueOf(userId),
                TTL_MINUTES,
                TimeUnit.MINUTES
        );
    }


}
