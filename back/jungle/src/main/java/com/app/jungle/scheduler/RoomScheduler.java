package com.app.jungle.scheduler;

import com.app.jungle.domain.entity.Room;
import com.app.jungle.domain.entity.User;
import com.app.jungle.domain.enums.room.RoomStatus;
import com.app.jungle.repository.PracticeRepository;
import com.app.jungle.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.app.jungle.domain.dto.response.RoomResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RoomScheduler {

    private final RoomRepository roomRepository;
    private final PracticeRepository practiceRepository;
    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String RESERVE_KEY = "reserve:room:";
    private static final String AWAY_KEY = "away:room:";

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void compensateExpiredRooms() {
        boolean changed = false;
        LocalDateTime now = LocalDateTime.now();

        List<Room> reservedRooms = roomRepository.findByRoomStatus(RoomStatus.RESERVED);
        for (Room room : reservedRooms) {
            if (redisTemplate.opsForValue().get(RESERVE_KEY + room.getId()) == null) {
                log.info("[보정] 예약 자동취소 - Room {}", room.getId());
                room.clearRoom();
                roomRepository.save(room);
                changed = true;
            }
        }

        List<Room> awayRooms = roomRepository.findByRoomStatus(RoomStatus.AWAY);
        for (Room room : awayRooms) {
            if (redisTemplate.opsForValue().get(AWAY_KEY + room.getId()) == null) {
                log.info("[보정] 외출 자동퇴실 - Room {}", room.getId());
                User user = room.getCurrentUser();
                if (user != null) {
                    practiceRepository.findFirstByUserAndEndAtIsNullOrderByStartAtDesc(user)
                            .ifPresent(practiceLog -> {
                                practiceLog.checkOut();
                                practiceRepository.save(practiceLog);
                            });
                }
                room.clearRoom();
                roomRepository.save(room);
                changed = true;
            }
        }

        List<Room> inUseRooms = roomRepository.findByRoomStatus(RoomStatus.IN_USE);
        for (Room room : inUseRooms) {
            if (room.getRoomTimer() != null && now.isAfter(room.getRoomTimer().getExpireAt())) {
                log.info("[보정] 사용시간 만료 - Room {}", room.getId());
                User user = room.getCurrentUser();
                if (user != null) {
                    practiceRepository.findFirstByUserAndEndAtIsNullOrderByStartAtDesc(user)
                            .ifPresent(practiceLog -> {
                                practiceLog.checkOut();
                                practiceRepository.save(practiceLog);
                            });
                }
                room.clearRoom();
                roomRepository.save(room);
                changed = true;
            }
        }

        if (changed) {
            List<RoomResponseDTO> rooms = roomRepository.findAllByOrderByIdAsc()
                    .stream().map(RoomResponseDTO::new).toList();
            messagingTemplate.convertAndSend("/topic/rooms", rooms);
        }
    }
}
