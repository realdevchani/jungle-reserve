import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveRoom } from "modules/user";
import authFetch from "utils/authFetch";
import S from "./style";

const formatTime = (expireAt) => {
  if (!expireAt) return null;
  const diff = new Date(expireAt) - new Date();
  if (diff <= 0) return "만료";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}시간 ${m}분 ${s}초`;
  if (m > 0) return `${m}분 ${s}초`;
  return `${s}초`;
};

const CheckIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAway = searchParams.get("isAway") === "true";
  const dispatch = useDispatch();
  useSelector((state) => state.user);
  const [room, setRoom] = useState(null);
  const [awayTtl, setAwayTtl] = useState(null);
  const [, setTick] = useState(0);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await authFetch(`/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json();
        const r = data.data;
        if (isAway) {
          if (r.status !== "AWAY") {
            navigate(`/checkin/${id}`, { replace: true });
            return;
          }
        } else {
          if (r.status !== "IN_USE") {
            dispatch(setActiveRoom(r.status === "AVAILABLE" ? null : r));
            return;
          }
        }
        setRoom(r);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id, dispatch, isAway, navigate]);

  const handleAction = useCallback(async (action) => {
    try {
      const body = action === "extend" ? { addHours: 1 } : {};
      const res = await authFetch(`/api/rooms/${id}/${action}`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (action === "check-out") {
          dispatch(setActiveRoom(null));
          return;
        }
        if (action === "away") {
          navigate(`/checkin/${id}?isAway=true`, { replace: true });
          return;
        }
        if (action === "return") {
          navigate(`/checkin/${id}`, { replace: true });
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
  }, [id, dispatch, navigate]);

  useEffect(() => { fetchRoom(); }, [fetchRoom]);

  // 사용 중 만료 감지
  useEffect(() => {
    if (isAway) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      if (!room?.expireAt) return;
      const diff = new Date(room.expireAt) - new Date();
      if (diff <= 0) {
        clearInterval(interval);
        handleAction("check-out");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [room, handleAction, isAway]);

  // 외출 TTL 카운트다운
  useEffect(() => {
    if (!isAway || !room) return;
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
  }, [isAway, room, id, dispatch]);

  if (!room) return (
    <S.LoadingWrap>
      <S.LoadingTitle>{600 + Number(id)}호 {isAway ? "외출" : "이용"} 확인 중...</S.LoadingTitle>
      <S.LoadingImageWrap>
        <S.LoadingImage src="/assets/images/uiw_loading.svg" alt="로딩 중" />
      </S.LoadingImageWrap>
      <S.LoadingTextGroup>
        <S.LoadingMain>잠시만 기다려주세요.</S.LoadingMain>
        <S.LoadingSub>네트워크 상태에 따라 몇 초 걸릴 수 있어요.</S.LoadingSub>
      </S.LoadingTextGroup>
    </S.LoadingWrap>
  );

  const remaining = formatTime(room.expireAt);
  const expireAt = new Date(room.expireAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const isUrgent = !isAway && room.expireAt && new Date(room.expireAt) - new Date() <= 300000;
  const awayUrgent = isAway && awayTtl !== null && awayTtl <= 300;

  const formatCountdown = (sec) => {
    if (sec <= 0) return "만료";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
  };

  return (
    <S.Wrap>
      <S.TextWrap>
        <S.RoomTitle>{600 + room.id}호 연습실 {isAway ? "외출 중" : "사용 중"}</S.RoomTitle>
        <S.TimerWrap>
          <S.TextArea>
            <span>{isAway ? "복귀 시간" : "남은 시간"}</span>
            {isAway
              ? <span style={{ color: awayUrgent ? "#e53935" : "inherit" }}>{awayTtl !== null ? formatCountdown(awayTtl) : "확인 중..."}</span>
              : <span style={{ color: isUrgent ? "#e53935" : "inherit" }}>{remaining}</span>
            }
          </S.TextArea>
          <S.TextArea>
            <span>종료 시간</span>
            <span>{expireAt}</span>
          </S.TextArea>
        </S.TimerWrap>
      </S.TextWrap>
      <S.ButtonArea>
        <S.ExtendButton $isActive={!isAway} onClick={() => navigate(`/reserve/${id}?isExtends=true`)}>
          <img src="/assets/images/extends.svg" alt="extends" />
          <S.Button>연장하기</S.Button>
        </S.ExtendButton>
        <S.SubButton $isActive={isAway} onClick={() => isAway ? handleAction("return") : handleAction("away")}>
          <img src={isAway ? "/assets/images/return.svg" : "/assets/images/away.svg"} alt={isAway ? "return" : "away"} />
          <span>{isAway ? "복귀하기" : "외출하기"}</span>
        </S.SubButton>
        <S.SubButton $isActive={false} onClick={() => handleAction("check-out")}>
          <img src="/assets/images/checkout.svg" alt="checkout" />
          <span>퇴실하기</span>
        </S.SubButton>
      </S.ButtonArea>
    </S.Wrap>
  );
};

export default CheckIn;
