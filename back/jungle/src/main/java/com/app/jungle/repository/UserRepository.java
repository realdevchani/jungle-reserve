package com.app.jungle.repository;

import com.app.jungle.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(Long id);
    Optional<User> findUserByUserPhone(String userPhoneNumber);
    // PIN은 BCrypt로 인코딩되어 있으므로, 이름+전화번호로 먼저 조회 후 코드에서 PIN 비교
    Optional<User> findUserByUserNameAndUserPhone(String userName, String userPhone);
}
