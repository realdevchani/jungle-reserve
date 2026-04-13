package com.app.jungle.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "JUNGLE_HOLIDAY")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Holiday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, name = "HOLIDAY_DATE")
    private LocalDate holidayDate;

    @Column(name = "HOLIDAY_REASON")
    private String reason;
}
