package com.app.jungle.service;

import com.app.jungle.domain.entity.User;
import com.app.jungle.exception.UserException;
import com.app.jungle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 전화번호로 회원 아이디 조회
    @Override
    public Long findUserIdByUserPhone(String userPhone) {
        User foundUser = userRepository.findUserByUserPhone(userPhone)
                .orElseThrow(() -> new UserException("등록되지 않은 전화번호입니다"));
        return foundUser.getId();
    }

    // 아이디로 회원 조회
    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserException("회원 조회 실패"));
    }

    // 전체 회원 조회 (관리자 용)
    @Override
    public List<User> findUsers() {
        return userRepository.findAll();
    }

    // 회원 정보 수정
    @Override
    public void modifyUser(User user) {
        userRepository.save(user);
    }

    // 회원 정보 전부 등록 (PIN 인코딩 후 저장)
    @Override
    public void registerUsers(List<User> users) {
        String defaultPassword = passwordEncoder.encode("0000");
        users.forEach(user -> {
            user.setUserPinNumber(defaultPassword);
        });
        userRepository.saveAll(users);
    }

    // 회원 정보 단 건 등록 (PIN 인코딩 후 저장)
    @Override
    public void registerUser(User user) {
        String defaultPassword = passwordEncoder.encode("0000");
        user.setUserPinNumber(defaultPassword);
        userRepository.save(user);
    }

    // 전화번호로 회원 조회
    @Override
    public User findUserByUserPhone(String userPhone) {
        return userRepository.findUserByUserPhone(userPhone)
                .orElseThrow(() -> new UserException("등록되지 않은 전화번호입니다"));
    }
}
