package com.app.jungle.repository;

import com.app.jungle.domain.entity.PracticeLog;
import com.app.jungle.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PracticeRepository extends JpaRepository<PracticeLog, Long> {

    List<PracticeLog> findByUser(User user);
    Optional<PracticeLog> findByUserAndStartAt(User user, LocalDateTime startAt);
    Optional<PracticeLog> findFirstByUserAndEndAtIsNullOrderByStartAtDesc(User user);
}
