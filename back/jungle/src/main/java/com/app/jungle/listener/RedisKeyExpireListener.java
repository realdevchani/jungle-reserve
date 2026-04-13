package com.app.jungle.listener;

import com.app.jungle.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisKeyExpireListener implements MessageListener {

    private final RoomService roomService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = message.toString();
        log.info("Redis 키 만료: {}", expiredKey);
        roomService.handleExpiredKey(expiredKey);
    }
}
