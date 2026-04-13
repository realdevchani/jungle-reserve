package com.app.jungle.repository;

import com.app.jungle.domain.entity.Admin;
import com.app.jungle.domain.entity.User;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootTest
@Slf4j
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EntityManager em;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AdminRepository adminRepository;

    @Test
    void insertTest() {
        User user1 = new User();
        user1.setUserName("테스트");
        user1.setUserPhone("010-1111-1111");

        userRepository.save(user1);

        List<User> foundUsers = userRepository.findAll();
        log.info("foundUsers = {}", foundUsers);
    }

    @Test
    void insertAdminTest(){
        Admin admin = new Admin();
        admin.setAdminId("jungle");
        String password = "jungle";
        password = passwordEncoder.encode(password);
        admin.setAdminPassword(password);
        adminRepository.save(admin);
    }
}
