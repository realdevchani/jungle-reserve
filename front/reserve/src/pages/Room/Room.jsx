import { useState, useEffect, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveRoom } from "modules/user";
import authFetch from "utils/authFetch";
import S from "./style";

const Room = () => {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDirect = searchParams.get("mode") === "direct";
  const dispatch = useDispatch();
  const [room, setRoom] = useState(null);
  const [duration, setDuration] = useState(1);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await authFetch(`/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json();
        const r = data.data;
        if (r.status !== "AVAILABLE") {
          dispatch(setActiveRoom(r));
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
        body: JSON.stringify({ durationHours: duration }),
      });

      if (res.ok) {
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
  }, [id, duration, dispatch]);

  useEffect(() => { fetchRoom(); }, [fetchRoom]);

  if (!room) return (
    <S.LoadingWrap>
      <S.LoadingTitle>{600 + Number(id)}호 확인 중...</S.LoadingTitle>
      <S.LoadingImageWrap>
        <S.LoadingImage src="/assets/images/uiw_loading.svg" alt="로딩 중" />
      </S.LoadingImageWrap>
      <S.LoadingTextGroup>
        <S.LoadingMain>잠시만 기다려주세요.</S.LoadingMain>
        <S.LoadingSub>네트워크 상태에 따라 몇 초 걸릴 수 있어요.</S.LoadingSub>
      </S.LoadingTextGroup>
    </S.LoadingWrap>
  );

  return (
    <S.LayOut>
      <S.Wrap>
        {/* <div>
          <S.BackButton onClick={() => navigate(isDirect ? "/?mode=direct" : "/")}>방 다시 선택</S.BackButton>
        </div> */}
        <S.TopWrap >
          <S.RoomHeader>
            <S.RoomTitle>{600 + room.id}호 예약</S.RoomTitle>
          </S.RoomHeader>
          <S.SelectWrap>
            <div onClick={() => setDuration(1)}>
              <input type="checkbox" readOnly checked={duration === 1} />
              <span>1시간만 연습할래요.</span>
            </div>
            <div onClick={() => setDuration(2)}>
              <input type="checkbox" readOnly checked={duration === 2} />
              <span>2시간만 연습할래요.</span>
            </div>
          </S.SelectWrap>
        </S.TopWrap>
        <S.ExplainWrap>
          <S.RoomTitle>
            확인 후 10분 안에 입실을 완료해주세요.
          </S.RoomTitle>
          <S.Explain>
            <p>10분 안에 입실을 하지 않으면</p>
            <p>자동으로 예약이 취소돼요.</p>
            <p>예약 취소가 많을 경우 이용제한이 될 수 있어요.</p>
          </S.Explain>
        </S.ExplainWrap>
      <S.Button onClick={() => handleAction(isDirect ? "check-in" : "reserve")}>
        {isDirect ? "입실확인" : "예약확인"}
      </S.Button>
      </S.Wrap>
    </S.LayOut>
  );
};

export default Room;
