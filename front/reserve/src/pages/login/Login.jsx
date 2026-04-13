import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setLoginStatus, setActiveRoom } from 'modules/user';
import authFetch from 'utils/authFetch';
import S from './style';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    userName: '',
    userPhone: '',
    userPinNumber: '',
  });

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userPhone') {
      setForm((prev) => ({ ...prev, userPhone: formatPhone(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. 로그인
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || '로그인에 실패했습니다.');
        return;
      }

      if (data.data.pinRequired) {
        navigate('/pin/setup', {
          state: { userName: data.data.userName, userPhone: data.data.userPhone },
        });
        return;
      }

      const accessToken = data.data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      // 3. /private/users/me 로 유저 정보 조회 (authFetch 사용)
      const meRes = await authFetch('/private/users/me');
      const meData = await meRes.json();

      if (meRes.ok) {
        dispatch(setUser(meData.data));
        dispatch(setLoginStatus(true));

        const roomRes = await authFetch('/api/rooms/my');
        if (roomRes.ok) {
          const roomData = await roomRes.json();
          if (roomData.data) {
            dispatch(setActiveRoom(roomData.data));
            return;
          }
        }
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      alert('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <S.Wrap>
      <S.Form onSubmit={handleSubmit}>
        <S.InputGroup>
          <S.Label>이름</S.Label>
          <S.Input name="userName" value={form.userName} onChange={handleChange} placeholder='홍길동' />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>전화번호</S.Label>
          <S.Input name="userPhone" type="tel" inputMode="numeric" value={form.userPhone} onChange={handleChange} placeholder='010-1234-5678' />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>PIN</S.Label>
          <S.Input name="userPinNumber" type="password" maxLength={4} value={form.userPinNumber} onChange={handleChange} placeholder='0000' />
        </S.InputGroup>
        <S.Button type="submit">로그인</S.Button>
      </S.Form>
    </S.Wrap>
  );
};

export default Login;
