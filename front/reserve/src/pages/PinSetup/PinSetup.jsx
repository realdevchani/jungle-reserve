import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import S from "./style";

const PinSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userPhone } = location.state || {};
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");

  if (!userName || !userPhone) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 4) {
      alert("PIN은 4자리를 입력해주세요.");
      return;
    }
    if (pin !== pinConfirm) {
      alert("PIN이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pin/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userPhone, userPinNumber: pin }),
      });

      if (res.ok) {
        alert("PIN이 설정되었습니다. 로그인해주세요.");
        navigate("/login");
      } else {
        const data = await res.json();
        alert(data.message || "PIN 설정에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  return (
    <S.Wrap>
      <S.Title>PIN 설정</S.Title>
      <S.Desc>최초 1회 PIN을 설정해주세요.</S.Desc>
      <S.Form onSubmit={handleSubmit}>
        <S.InputGroup>
          <S.Label>PIN (4자리)</S.Label>
          <S.Input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="0000"
          />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>PIN 확인</S.Label>
          <S.Input
            type="password"
            maxLength={4}
            value={pinConfirm}
            onChange={(e) => setPinConfirm(e.target.value)}
            placeholder="0000"
          />
        </S.InputGroup>
        <S.Button type="submit">PIN 등록</S.Button>
      </S.Form>
    </S.Wrap>
  );
};

export default PinSetup;
