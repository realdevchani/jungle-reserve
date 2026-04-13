package com.app.jungle.service;

import static org.junit.jupiter.api.Assertions.*;

import com.app.jungle.domain.entity.Room;
import com.app.jungle.domain.entity.User;
import com.app.jungle.domain.enums.room.RoomStatus;
import com.app.jungle.exception.RoomReserveException;
import com.app.jungle.repository.RoomRepository;
import com.app.jungle.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class RoomServiceImplTest {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void reserveTest() throws InterruptedException {
        // given: 방 1개 (AVAILABLE 상태), 유저 2명
        Long roomId = 1L;  // 테스트 DB에 AVAILABLE 상태 방이 있어야 함
        Room room = roomRepository.findById(roomId).orElseThrow();
        room.clearRoom();  // AVAILABLE로 초기화
        roomRepository.save(room);

        User user1 = userRepository.findById(3L).orElseThrow();
        User user2 = userRepository.findById(4L).orElseThrow();

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        // when: 2개 스레드가 동시에 예약 시도
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch latch = new CountDownLatch(2);

        executor.submit(() -> {
            try {
                roomService.reserveRoom(user1, roomId, 1);
                successCount.incrementAndGet();
            } catch (Exception e) {
                failCount.incrementAndGet();
            } finally {
                latch.countDown();
            }
        });

        executor.submit(() -> {
            try {
                roomService.reserveRoom(user2, roomId, 1);
                successCount.incrementAndGet();
            } catch (Exception e) {
                failCount.incrementAndGet();
            } finally {
                latch.countDown();
            }
        });

        latch.await();  // 두 스레드 모두 끝날 때까지 대기
        executor.shutdown();

        // then: 1명 성공, 1명 실패
        assertThat(successCount.get()).isEqualTo(1);
        assertThat(failCount.get()).isEqualTo(1);

        // 방 상태 확인: RESERVED
        Room result = roomRepository.findById(roomId).orElseThrow();
        assertThat(result.getRoomStatus()).isEqualTo(RoomStatus.RESERVED);
    }
}