package com.app.jungle.domain.dto.response;

import com.app.jungle.domain.entity.Room;
import com.app.jungle.domain.enums.room.RoomStatus;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@Setter
@ToString
public class RoomResponseDTO {

    private Long id;
    private RoomStatus status;
    private String currentUserName;
    private LocalDateTime startAt;
    private LocalDateTime expireAt;

    public RoomResponseDTO(Room room) {
        this.id = room.getId();
        this.status = room.getRoomStatus();
        this.currentUserName = room.getCurrentUser() != null ? room.getCurrentUser().getUserName() : null;
        if (room.getRoomTimer() != null) {
            this.startAt = room.getRoomTimer().getStartAt();
            this.expireAt = room.getRoomTimer().getExpireAt();
        }
    }
}
