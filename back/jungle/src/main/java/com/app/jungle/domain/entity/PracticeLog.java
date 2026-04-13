package com.app.jungle.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "JUNGLE_PRACTICE_LOG")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@ToString
@Builder

public class PracticeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "ROOMID")
    private Room room;

    @Builder.Default
    @Column(nullable = false, name = "PRACTICE_LOG_START_AT")
    private LocalDateTime startAt = LocalDateTime.now();

    @Column(name = "PRACTICE_LOG_END_AT", nullable = true)
    private LocalDateTime endAt;

    public void checkOut(){
        this.endAt = LocalDateTime.now();
        Duration duration = Duration.between(startAt, endAt);
        this.user.addUserPracticeMinutes((int) duration.toMinutes());
    }
}
