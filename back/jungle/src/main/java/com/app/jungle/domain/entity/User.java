package com.app.jungle.domain.entity;

import com.app.jungle.exception.UserException;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TBL_USER")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL 기준
    private Long id;

    @Column(nullable = false, name = "USER_NAME")
    private String userName;

    // BCrypt 해시값은 60자이므로 length 충분히 설정
    @Column(nullable = true, name = "USER_PIN_NUMBER")
    private String userPinNumber;

    @Column(name = "USER_PIN_INITIALIZED")
    private Boolean userPinInitialized = Boolean.FALSE;

    @Column(name = "USER_TOTAL_PRACTICE_MINUTES")
    private Integer userTotalPracticeMinutes = 0;

    @Column(nullable = false, name = "USER_PHONE")
    private String userPhone;


    public void changePinNumber(String encodedPinNumber) {
        if (encodedPinNumber == null) {
            throw new UserException("핀번호가 잘못 입력되었습니다.");
        }
        this.userPinNumber = encodedPinNumber;
        this.userPinInitialized = Boolean.TRUE;
    }

    public void resetPinNumber(String encodedDefaultPin) {
        this.userPinInitialized = Boolean.FALSE;
        this.userPinNumber = encodedDefaultPin;
    }

    public void addUserPracticeMinutes(Integer userPracticeMinutes) {
        if (userPracticeMinutes == null) { throw new UserException("연습시간 추가 중 에러 발생");}
        this.userTotalPracticeMinutes += userPracticeMinutes;
    }



}
