package com.app.jungle.domain.embed;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Embeddable
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class RoomTimer {

    private LocalDateTime startAt;
    private LocalDateTime expireAt;

    public RoomTimer(LocalDateTime startAt, int useTime){
        this.startAt = startAt;
        this.expireAt = LocalDateTime.now().plusHours(useTime);
    }
    public void extend(int hours) {
        this.expireAt = this.expireAt.plusHours(hours);
    }
}
