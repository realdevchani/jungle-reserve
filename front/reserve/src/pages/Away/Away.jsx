import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveRoom } from "modules/user";
import authFetch from "utils/authFetch";
import S from "./style";

const formatCountdown = (seconds) => {
  if (seconds <= 0) return "만료";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
};

const Away = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [room, setRoom] = useState(null);
  const [awayTtl, setAwayTtl] = useState(null);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await authFetch(`/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json();
        const r = data.data;
        if (r.status !== "AWAY") {
          dispatch(setActiveRoom(r.status === "AVAILABLE" ? null : r));
          return;
        }
        setRoom(r);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id, dispatch]);

  const handleAction = useCallback(async (action) => {
    try {
      const res = await authFetch(`/api/rooms/${id}/${action}`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (res.ok) {
        if (action === "check-out") {
          dispatch(setActiveRoom(null));
          return;
        }
        const roomRes = await authFetch(`/api/rooms/${id}`);
        if (roomRes.ok) {
          const roomData = await roomRes.json();
          dispatch(setActiveRoom(roomData.data));
        }
      } else {
        const data = await res.json();
        alert(data.message || "요청에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버에 연결할 수 없습니다.");
    }
  }, [id, dispatch]);

  useEffect(() => { fetchRoom(); }, [fetchRoom]);

  useEffect(() => {
    if (!room || room.status !== "AWAY") return;
    const fetchTtl = async () => {
      const res = await authFetch(`/api/rooms/${id}/away-ttl`);
      if (res.ok) {
        const data = await res.json();
        setAwayTtl(data.data);
      }
    };
    fetchTtl();
    const interval = setInterval(() => {
      setAwayTtl((prev) => {
        if (prev === null || prev <= 0) return prev;
        if (prev <= 1) {
          dispatch(setActiveRoom(null));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [room, id, dispatch]);

  if (!room) return (
    <S.LoadingWrap>
      <S.LoadingTitle>{600 + Number(id)}호 외출 확인 중...</S.LoadingTitle>
      <S.LoadingImageWrap>
        <S.LoadingImage src="/assets/images/uiw_loading.svg" alt="로딩 중" />
      </S.LoadingImageWrap>
      <S.LoadingTextGroup>
        <S.LoadingMain>잠시만 기다려주세요.</S.LoadingMain>
        <S.LoadingSub>네트워크 상태에 따라 몇 초 걸릴 수 있어요.</S.LoadingSub>
      </S.LoadingTextGroup>
    </S.LoadingWrap>
  );

  const isMyRoom = room.currentUserName === currentUser?.userName;

  return (
    <S.Wrap>
      <S.RoomHeader>
        <S.RoomTitle>{600 + room.id}호</S.RoomTitle>
        <S.StatusBadge $status="AWAY">외출 중</S.StatusBadge>
      </S.RoomHeader>

      {room.currentUserName && (
        <S.InfoRow>
          <S.InfoLabel>사용자</S.InfoLabel>
          <S.InfoValue>{room.currentUserName}</S.InfoValue>
        </S.InfoRow>
      )}

      {awayTtl !== null && (
        <S.InfoRow>
          <S.InfoLabel>복귀까지 남은 시간</S.InfoLabel>
          <S.InfoValue style={{ color: awayTtl <= 300 ? "#e53935" : "inherit" }}>
            {formatCountdown(awayTtl)}
          </S.InfoValue>
        </S.InfoRow>
      )}

      {isMyRoom && (
        <S.ActionArea>
          <S.ActionButtons>
            <S.ActionButton $color="pink" onClick={() => handleAction("return")}>
              복귀하기
            </S.ActionButton>
            <S.ActionButton $color="gray" onClick={() => handleAction("check-out")}>
              퇴실하기
            </S.ActionButton>
          </S.ActionButtons>
        </S.ActionArea>
      )}
    </S.Wrap>
  );
};

export default Away;
