package com.app.jungle.service;

import com.app.jungle.domain.dto.response.RoomResponseDTO;
import com.app.jungle.domain.entity.Room;
import com.app.jungle.domain.entity.User;

import java.util.List;

public interface RoomService {
    List<RoomResponseDTO> getRoomList();
    Room getRoomById(Long roomId);
    RoomResponseDTO getMyActiveRoom(User user);
    void reserveRoom(User user, Long roomId, int useTime);
    void checkInRoom(User user, Long roomId, int useTime);
    void awayRoom(User user, Long roomId);
    void returnRoom(User user, Long roomId);
    void extendRoom(User user, Long roomId, int addHours);
    void cancelReservation(User user, Long roomId);
    void checkOutRoom(User user, Long roomId);
    Long getReserveTtl(Long roomId);
    Long getAwayTtl(Long roomId);
    void handleExpiredKey(String expiredKey);
}
