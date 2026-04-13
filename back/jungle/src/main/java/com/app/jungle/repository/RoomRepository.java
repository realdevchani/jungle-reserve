package com.app.jungle.repository;

import com.app.jungle.domain.entity.Room;
import com.app.jungle.domain.entity.User;
import com.app.jungle.domain.enums.room.RoomStatus;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findAllByOrderByIdAsc();
    List<Room> findByRoomStatus(RoomStatus status);
    Optional<Room> findByCurrentUser(User user);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.id = :id")
    Optional<Room> findByIdForUpdate(@Param("id") Long id);
}
