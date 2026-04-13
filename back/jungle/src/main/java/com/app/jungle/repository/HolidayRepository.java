package com.app.jungle.repository;

import com.app.jungle.domain.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    boolean existsByHolidayDate(LocalDate date);
    List<Holiday> findAllByOrderByHolidayDateAsc();
    Holiday findByHolidayDate(LocalDate date);
}
