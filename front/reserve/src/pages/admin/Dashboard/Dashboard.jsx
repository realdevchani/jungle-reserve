import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWebSocket, disconnectWebSocket } from "utils/websocket";
import S from "pages/Home/style";
import PanelStyle from "./style";

const adminFetch = async (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  return fetch(`${process.env.REACT_APP_BACKEND_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

const STATUS_CONFIG = {
  AVAILABLE: { label: "사용 가능", color: "white" },
  RESERVED: { label: "예약 중", color: "yellow" },
  IN_USE: { label: "사용 중", color: "pink" },
  AWAY: { label: "외출 중", color: "blue" },
};

const ROOM_ORDER = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12];

const ROOM_RADIUS = {
  6: "5px 0 0 0",
  7: "0 5px 0 0",
  12: "0 0 5px 0",
  1: "0 0 0 5px",
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

const formatDateTime = (isoStr) => {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      status: "AVAILABLE",
      currentUserName: null,
    }))
  );
  const [holiday, setHoliday] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
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

    return () => disconnectWebSocket();
  }, [navigate]);

  const fetchRooms = async () => {
    try {
      const res = await adminFetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.data);
      } else if (res.status === 401) {
        navigate("/admin/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkHoliday = async () => {
    try {
      const res = await adminFetch("/api/rooms/holiday-today");
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
    if (room.status !== "AVAILABLE" && room.status !== "IN_USE") return;
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null);
      setName("");
      setUserPhone("");
    } else {
      setSelectedRoom(room);
      setName("");
      setUserPhone("");
    }
  };

  const handleCancelPanel = () => {
    setSelectedRoom(null);
    setName("");
    setUserPhone("");
  };

  const handleCheckIn = async () => {
    if (!selectedRoom || !userPhone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/rooms/${selectedRoom.id}/checkIn`, {
        method: "POST",
        body: JSON.stringify({ userPhone: userPhone.trim(), durationHours: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "입실 처리되었습니다.");
        setSelectedRoom(null);
        setName("");
        setUserPhone("");
        fetchRooms();
      } else {
        alert(data.message || "입실 처리에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedRoom) return;
    if (!window.confirm(`${600 + selectedRoom.id}호 퇴실 처리하시겠습니까?`)) return;
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/rooms/${selectedRoom.id}/checkOut`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "퇴실 처리되었습니다.");
        setSelectedRoom(null);
        fetchRooms();
      } else {
        alert(data.message || "퇴실 처리에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const roomDisplay = selectedRoom ? `${600 + selectedRoom.id}호` : "";

  return (
    <S.Wrap>
      <S.Title>연습실 예약 현황</S.Title>
      {holiday && <S.HolidayBanner>오늘은 휴무일입니다 — {holiday}</S.HolidayBanner>}
      <S.ExplainWrap>
        <S.Explain>
          <S.BlueBadge />
          <span>사용 가능</span>
        </S.Explain>
        <S.Explain>
          <S.RedBadge />
          <span>사용 중(남은 시간)</span>
        </S.Explain>
        <S.Explain>
          <S.YellowBadge />
          <span>입실 대기</span>
        </S.Explain>
      </S.ExplainWrap>
      <S.RoomGrid>
        {ROOM_ORDER.map((roomId) => {
          const room = rooms.find((r) => r.id === roomId) ?? { id: roomId, status: "AVAILABLE" };
          const config = STATUS_CONFIG[room.status] || STATUS_CONFIG.AVAILABLE;
          const remaining = formatRemaining(room.expireAt);
          const isSelected = selectedRoom?.id === room.id;
          const isClickable = room.status === "AVAILABLE" || room.status === "IN_USE";
          return (
            <S.RoomCard
              key={room.id}
              $status={config.color}
              $selected={isSelected}
              $radius={ROOM_RADIUS[room.id] ?? "0"}
              style={{ cursor: isClickable ? "pointer" : "default" }}
              onClick={() => isClickable && handleRoomClick(room)}
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

      {selectedRoom && selectedRoom.status === "AVAILABLE" && (
        <PanelStyle.Panel>
          <PanelStyle.PanelTitle>{roomDisplay}, 대기 중</PanelStyle.PanelTitle>
          <PanelStyle.PanelRow $bottom={24}>
            <PanelStyle.InputTitle $gap={12}>이름</PanelStyle.InputTitle>
            <PanelStyle.Input
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </PanelStyle.PanelRow>
          <PanelStyle.PanelRow $bottom={36}>
            <PanelStyle.InputTitle $gap={12}>전화번호</PanelStyle.InputTitle>
            <PanelStyle.Input
              placeholder="010-1234-5678"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
          </PanelStyle.PanelRow>
          <PanelStyle.ButtonRow>
            <PanelStyle.PrimaryButton onClick={handleCheckIn} disabled={loading}>
              바로 입실
            </PanelStyle.PrimaryButton>
            <PanelStyle.CancelButton $inUse={false} onClick={handleCancelPanel}>
              취소
            </PanelStyle.CancelButton>
          </PanelStyle.ButtonRow>
        </PanelStyle.Panel>
      )}

      {selectedRoom && selectedRoom.status === "IN_USE" && (
        <PanelStyle.Panel>
          <PanelStyle.PanelTitle>{roomDisplay} 사용 중</PanelStyle.PanelTitle>
          <PanelStyle.InUseInfo>
            {selectedRoom.currentUserName ?? "—"}
          </PanelStyle.InUseInfo>
          <PanelStyle.InUseInfo>
            입실: {formatDateTime(selectedRoom.startAt)}
          </PanelStyle.InUseInfo>
          <PanelStyle.InUseInfo>
            퇴실: {formatDateTime(selectedRoom.expireAt)}
          </PanelStyle.InUseInfo>
          <PanelStyle.ButtonRow>
            <PanelStyle.CheckOutButton onClick={handleCheckOut} disabled={loading}>
              퇴실
            </PanelStyle.CheckOutButton>
            <PanelStyle.CancelButton $inUse onClick={handleCancelPanel}>
              취소
            </PanelStyle.CancelButton>
          </PanelStyle.ButtonRow>
        </PanelStyle.Panel>
      )}

      {!selectedRoom && <S.ReserveButton $state="idle">연습실 현황</S.ReserveButton>}
    </S.Wrap>
  );
};

export default Dashboard;
