package com.app.jungle.domain.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "JUNGLE_ADMIN")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@ToString
@Builder
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, name = "ADMIN_LOGIN_ID")
    private String adminId;

    @Column(nullable = false, name = "ADMIN_PASSWORD")
    private String adminPassword;

}
