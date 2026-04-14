package com.app.jungle.config;

import com.app.jungle.domain.entity.Admin;
import com.app.jungle.domain.entity.User;
import com.app.jungle.repository.AdminRepository;
import com.app.jungle.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("user")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("유저 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        log.info("유저 초기 데이터 삽입을 시작합니다.");

        String defaultPin = passwordEncoder.encode("0000");

        // 중복 전화번호 제거를 위한 Set
        Set<String> seen = new LinkedHashSet<>();
        List<User> users = new ArrayList<>();

        String[][] rawUsers = {
                {"황보도윤", "010-9449-0217"},
                {"이석준", "010-5059-2249"},
                {"고은우", "010-8211-6173"},
                {"한정연", "010-5815-1649"},
                {"박중하", "010-6387-7290"},
                {"임성규", "010-5825-5576"},
                {"최웅찬", "010-8470-0232"},
                {"신승진", "010-4619-9699"},
                {"정진우", "010-9198-7022"},
                {"임성묵", "010-7115-8834"},
                {"이석중", "010-7769-8243"},
                {"천지우", "010-8513-2505"},
                {"이하은", "010-5409-5027"},
                {"정진원", "010-2112-7708"},
                {"박서윤", "010-3906-6446"},
                {"김혜리", "010-4799-3878"},
                {"김은율", "010-3787-2205"},
                {"백지훈", "010-8819-9386"},
                {"한수정", "010-5177-2724"},
                {"송수연", "010-5081-3645"},
                {"최지우", "010-3702-4068"},
                {"최윤식", "010-9765-8101"},
                {"김준희", "010-4662-5307"},
                {"김찬식", "010-8376-7705"},
                {"류성환", "010-6305-8756"},
                {"공태현", "010-9139-0023"},
                {"이아영", "010-2278-5308"},
                {"박준혁", "010-4891-8595"},
                {"지수인", "010-3996-8423"},
                {"한서희", "010-9945-1902"},
                {"문제호", "010-9935-1249"},
        };

        for (String[] raw : rawUsers) {
            if (seen.add(raw[1])) {
                User user = User.builder()
                        .userName(raw[0])
                        .userPhone(raw[1])
                        .userPinNumber(defaultPin)
                        .userPinInitialized(false)
                        .userTotalPracticeMinutes(0)
                        .build();
                users.add(user);
            }
        }

        userRepository.saveAll(users);
        log.info("유저 {} 명 초기 데이터 삽입 완료.", users.size());

        // Admin 초기 계정
        if (adminRepository.count() == 0) {
            Admin admin = Admin.builder()
                    .adminId("admin")
                    .adminPassword(passwordEncoder.encode("Jungle1234!"))
                    .build();
            adminRepository.save(admin);
            log.info("관리자 초기 계정 생성 완료. (ID: admin)");
        }
    }
}
