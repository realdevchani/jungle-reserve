import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import authFetch from "utils/authFetch";
import { getActiveRoomPath } from "utils/roomRoute";
import { connectWebSocket, disconnectWebSocket, requestNotificationPermission } from "utils/websocket";
import S from "./style";

const STATUS_CONFIG = {
  AVAILABLE: { label: "사용 가능", color: "white" },
  RESERVED: { label: "예약 중", color: "yellow" },
  IN_USE: { label: "사용 중", color: "pink" },
  AWAY: { label: "외출 중", color: "blue" },
};

// 6,7 / 5,8 / 4,9 / 3,10 / 2,11 / 1,12 순서로 정렬
const ROOM_ORDER = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12];

// 각 방의 border-radius (좌상단, 우상단, 우하단, 좌하단)
const ROOM_RADIUS = {
  6:  "5px 0 0 0",
  7:  "0 5px 0 0",
  12: "0 0 5px 0",
  1:  "0 0 0 5px",
};

const formatRemaining = (expireAt) => {
  if (!expireAt) return null;
  const diff = new Date(expireAt) - new Date();
  if (diff <= 0) return "만료";
  const totalMin = Math.floor(diff / 60000);
  if (totalMin >= 60) return `${Math.floor(totalMin / 60)}시간`;
  if (totalMin >= 10) return `${Math.floor(totalMin / 10) * 10}분`;
  return `${totalMin}분`;
};

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDirect = searchParams.get("mode") === "direct";
  const { isLogin, authReady, activeRoom } = useSelector((state) => state.user);
  const [rooms, setRooms] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      status: "AVAILABLE",
      currentUserName: null,
    }))
  );
  const [, setTick] = useState(0);
  const [holiday, setHoliday] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (!authReady) return;
    if (!isLogin) {
      navigate("/login");
      return;
    }
    requestNotificationPermission();
    const activePath = getActiveRoomPath(activeRoom);
    if (activePath) {
      navigate(activePath, { replace: true });
      return;
    }
    fetchRooms();
    checkHoliday();

    connectWebSocket((updatedRooms) => {
      setRooms(updatedRooms);
      setSelectedRoom((prev) =>
        prev ? updatedRooms.find((r) => r.id === prev.id) ?? null : null
      );
    });

    const timer = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      disconnectWebSocket();
      clearInterval(timer);
    };
  }, [isLogin, authReady, activeRoom, navigate]);

  const fetchRooms = async () => {
    try {
      const res = await authFetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkHoliday = async () => {
    try {
      const res = await authFetch("/api/rooms/holiday-today");
      if (res.ok) {
        const data = await res.json();
        if (data.data.isHoliday) {
          setHoliday(data.data.reason || "휴무일");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoomClick = (room) => {
    if (holiday) return;
    if (room.status !== "AVAILABLE") return;
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
    } else {
      setSelectedRoom(room);
    }
  };

  const allFull = rooms.every((r) => r.status !== "AVAILABLE");
  const buttonState = selectedRoom ? "selected" : allFull ? "allFull" : "idle";
  const buttonLabel =
    buttonState === "selected"
      ? (isDirect ? "바로 입실" : "예약하기")
      : buttonState === "allFull"
        ? "모든 방이 사용 중입니다."
        : "사용하실 방을 선택해주세요.";

  const handleReserve = () => {
    if (buttonState !== "selected") return;
    const modeParam = isDirect ? "?mode=direct" : "";
    navigate(`/room/${selectedRoom.id}${modeParam}`);
  };

  return (
    <S.Wrap>
      <S.Title>{isDirect ? "연습실 입실" : "연습실 예약 현황"}</S.Title>
      {holiday && <S.HolidayBanner>오늘은 휴무일입니다 — {holiday}</S.HolidayBanner>}
      <S.ExplainWrap>
        <S.Explain>
          <S.BlueBadge></S.BlueBadge>
          <span>사용 가능</span>
        </S.Explain>
        <S.Explain>
          <S.RedBadge></S.RedBadge>
          <span>사용 중(남은 시간)</span>
        </S.Explain>
        <S.Explain>
          <S.YellowBadge></S.YellowBadge>
          <span>입실 대기</span>
        </S.Explain>
      </S.ExplainWrap>
      <S.RoomGrid>
        {ROOM_ORDER.map((roomId) => {
          const room = rooms.find((r) => r.id === roomId) ?? { id: roomId, status: "AVAILABLE" };
          const config = STATUS_CONFIG[room.status] || STATUS_CONFIG.AVAILABLE;
          const remaining = formatRemaining(room.expireAt);
          const isSelected = selectedRoom?.id === room.id;
          return (
            <S.RoomCard
              key={room.id}
              $status={config.color}
              $selected={isSelected}
              $radius={ROOM_RADIUS[room.id] ?? "0"}
              onClick={() => handleRoomClick(room)}
            >
              <S.StatusBadge>
                <S.StatusDot $statusKey={room.status} />
                {room.status === "IN_USE" && remaining && (
                  <S.StatusText $statusKey={room.status}>{remaining}</S.StatusText>
                )}
              </S.StatusBadge>
              <S.RoomNumber>{600 + room.id}</S.RoomNumber>
            </S.RoomCard>
          );
        })}
      </S.RoomGrid>
      <S.ReserveButton $state={buttonState} onClick={handleReserve}>
        {buttonLabel}
      </S.ReserveButton>
    </S.Wrap>
  );
};

export default Home;
