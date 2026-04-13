package com.app.jungle.domain.entity;

import com.app.jungle.domain.embed.RoomTimer;
import com.app.jungle.domain.enums.room.RoomStatus;
import com.app.jungle.exception.RoomReserveException;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Entity
@Table(name = "JUNGLE_ROOM")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Room {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROOM_STATUS")
    private RoomStatus roomStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CURRENT_USER_ID", nullable = true)
    private User currentUser;

    @Embedded
    private RoomTimer roomTimer;

//    모바일 예약 시 10분 내에 만료되어야 함
    public void reserve(User user, int useTime){
        if(this.roomStatus != RoomStatus.AVAILABLE || user == null){
            throw new RoomReserveException("사용중인 연습실입니다.");
        }
        LocalDateTime currentTime = LocalDateTime.now();
        filledColumns(user, useTime, RoomStatus.RESERVED);
    }

//    입실로 상태 변경 처리
    public void checkIn(User user, int useTime){
//        현재 방 상태를 가져와서 사용 가능일 경우 바로 입실
//        아닐 경우(reserve 일 경우 현재 유저와 동일한 지 비교 후 입실 처리)

        if(this.roomStatus == RoomStatus.AVAILABLE){
            filledColumns(user, useTime, RoomStatus.IN_USE);
        }else if(this.roomStatus == RoomStatus.RESERVED){
//            예약자와 입실자와 동일할 경우 입실 처리
            if(isMatchedUser(user.getId())){
                filledColumns(user, useTime, RoomStatus.IN_USE);
            } else {
                throw new RoomReserveException("다른 사용자가 예약한 연습실입니다.");
            }
        }else{
            throw new RoomReserveException("이미 사용 중인 방입니다.");
        }
    }
//    외출
    public void awayRoom(){
        this.roomStatus = RoomStatus.AWAY;
    }
//    외출 복귀
    public void returnRoom(){
        this.roomStatus = RoomStatus.IN_USE;
    }
//    연장 처리
    public void addExpiredTime(int addedTime){
        this.roomTimer.extend(addedTime);
    }
//    방 초기화
    public void clearRoom(){
        this.currentUser = null;
        this.roomTimer = null;
        this.roomStatus = RoomStatus.AVAILABLE;
    }


//    재사용 메서드
    private void filledColumns(User user, int useTime, RoomStatus roomStatus){
        this.currentUser = user;
        this.roomStatus = roomStatus;
        this.roomTimer = new RoomTimer(LocalDateTime.now(), useTime);

//        방초기화 위한 용도
    }

//        현재 유저 서버에 등록된 유저 비교
    public boolean isMatchedUser(Long id){
        return this.currentUser != null && Objects.equals(this.currentUser.getId(), id);
    }

}
