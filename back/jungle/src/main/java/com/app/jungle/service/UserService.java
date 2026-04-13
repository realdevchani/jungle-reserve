package com.app.jungle.service;

import com.app.jungle.domain.entity.User;

import java.util.List;

public interface UserService {

//    회원 아이디 조회
    public Long findUserIdByUserPhone(String userPhone);
//    아이디로 정보 조회
    public User findUserById(Long id);
//    회원 리스트 조회(관리자 용)
    public List<User> findUsers();
//    회원 정보 수정
    public void modifyUser(User user);
//    회원 정보 전부 등록
    public void registerUsers(List<User> users);
//    회원 정보 단 건 등록
    public void registerUser(User user);
//    전화번호로 회원 조회
    public User findUserByUserPhone(String userPhone);
}
