import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveRoom } from "modules/user";
import { Html5Qrcode } from "html5-qrcode";
import authFetch from "utils/authFetch";
import S from "./style";
import RS from "pages/Room/style";

const formatCountdown = (seconds) => {
  if (seconds <= 0) return "만료";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
};

const extractRoomIdFromQr = (text) => {
  try {
    const url = new URL(text);
    const match = url.pathname.match(/\/room\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

const Reserve = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isExtends = searchParams.get("isExtends") === "true";
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [room, setRoom] = useState(null);
  const [reserveTtl, setReserveTtl] = useState(null);
  const [duration, setDuration] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [scanMsg, setScanMsg] = useState(null);
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await authFetch(`/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json();
        const r = data.data;
        if (isExtends) {
          if (r.status !== "IN_USE") {
            navigate(`/checkin/${id}`, { replace: true });
            return;
          }
        } else {
          if (r.status !== "RESERVED") {
            dispatch(setActiveRoom(r.status === "AVAILABLE" ? null : r));
            return;
          }
        }
        setRoom(r);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id, dispatch, isExtends, navigate]);

  const handleExtend = useCallback(async () => {
    try {
      const res = await authFetch(`/api/rooms/${id}/extend`, {
        method: "POST",
        body: JSON.stringify({ addHours: duration }),
      });
      if (res.ok) {
        navigate(`/checkin/${id}`, { replace: true });
      } else {
        const data = await res.json();
        alert(data.message || "연장에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버에 연결할 수 없습니다.");
    }
  }, [id, duration, navigate]);

  const handleAction = useCallback(async (action) => {
    try {
      const body = action === "check-in" ? { durationHours: 1 } : {};
      const res = await authFetch(`/api/rooms/${id}/${action}`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (action === "cancel") {
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

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (_) {}
      scannerRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const startScanner = useCallback(async () => {
    scannedRef.current = false;
    setScanMsg(null);
    setShowCamera(true);

    await new Promise((r) => setTimeout(r, 100));

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (scannedRef.current) return;
          const scannedRoomId = extractRoomIdFromQr(decodedText.trim());

          if (scannedRoomId === id) {
            scannedRef.current = true;
            stopScanner();
            handleAction("check-in");
          } else {
            setScanMsg(scannedRoomId
              ? `${600 + Number(scannedRoomId)}호 QR입니다. ${600 + Number(id)}호 QR을 스캔해주세요.`
              : "올바른 QR 코드가 아닙니다."
            );
          }
        },
        () => {}
      );
    } catch (err) {
      console.error(err);
      alert("카메라를 열 수 없습니다.");
      setShowCamera(false);
    }
  }, [id, handleAction, stopScanner]);

  useEffect(() => {
    return () => { stopScanner(); };
  }, [stopScanner]);

  useEffect(() => { fetchRoom(); }, [fetchRoom]);

  useEffect(() => {
    if (!room || room.status !== "RESERVED") return;
    const fetchTtl = async () => {
      const res = await authFetch(`/api/rooms/${id}/reserve-ttl`);
      if (res.ok) {
        const data = await res.json();
        setReserveTtl(data.data);
      }
    };
    fetchTtl();
    const interval = setInterval(() => {
      setReserveTtl((prev) => {
        if (prev === null || prev <= 0) return prev;
        if (prev <= 1) {
          handleAction("cancel");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [room, id, dispatch, handleAction]);

  if (!room) return (
    <S.LoadingWrap>
      <S.LoadingTitle>{600 + Number(id)}호 예약 확인 중...</S.LoadingTitle>
      <S.LoadingImageWrap>
        <S.LoadingImage src="/assets/images/uiw_loading.svg" alt="로딩 중" />
      </S.LoadingImageWrap>
      <S.LoadingTextGroup>
        <S.LoadingMain>잠시만 기다려주세요.</S.LoadingMain>
        <S.LoadingSub>네트워크 상태에 따라 몇 초 걸릴 수 있어요.</S.LoadingSub>
      </S.LoadingTextGroup>
    </S.LoadingWrap>
  );

  // eslint-disable-next-line no-unused-vars
  const isMyRoom = room.currentUserName === currentUser?.userName;

  if (isExtends) {
    return (
      <S.LayOut>
        <S.Title>{600 + room.id}호 연습실 연장하기</S.Title>
        <S.TitleArea>
          <span>현재 종료 시각 — {new Date(room.expireAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
          <span>연장 후 종료 시각 — {new Date(new Date(room.expireAt).getTime() + duration * 3600000).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
        </S.TitleArea>
        <RS.SelectWrap>
          <div onClick={() => setDuration(1)}>
            <input type="checkbox" readOnly checked={duration === 1} />
            <span>1시간만 더 사용할래요.</span>
          </div>
          <div onClick={() => setDuration(2)}>
            <input type="checkbox" readOnly checked={duration === 2} />
            <span>2시간만 더 사용할래요.</span>
          </div>
        </RS.SelectWrap>
        <S.ButtonWrap>
          <S.CheckInButton onClick={handleExtend}>
            연장 확인
          </S.CheckInButton>
          <S.CancelButton onClick={() => navigate(`/checkin/${id}`, { replace: true })}>
            돌아가기
          </S.CancelButton>
        </S.ButtonWrap>
      </S.LayOut>
    );
  }

  return (
    <S.LayOut>
      <S.Title>{600+room.id}호 연습실 예약 중</S.Title>
      <S.TitleArea>
        <span>{600+room.id}호 - {new Date(room.startAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })} ~ {new Date(room.expireAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
        <p style={{ color: reserveTtl !== null && reserveTtl <= 300 ? "#e53935" : "inherit" }}>
          입실 만료 까지 - {reserveTtl !== null ? formatCountdown(reserveTtl) : "확인 중..."} 남았어요
        </p>
      </S.TitleArea>
      {showCamera && (
        <S.CameraWrap>
          <S.QrReader id="qr-reader" />
          {scanMsg && <S.ScanMsg>{scanMsg}</S.ScanMsg>}
          <S.CameraCloseButton onClick={stopScanner}>닫기</S.CameraCloseButton>
        </S.CameraWrap>
      )}
      <S.ButtonWrap>
        <S.CheckInButton onClick={startScanner}>
          입실 확인
        </S.CheckInButton>
        <S.CancelButton onClick={() => handleAction("cancel")}>
          예약 취소
        </S.CancelButton>
      </S.ButtonWrap>
    </S.LayOut>
  );
};

export default Reserve;
