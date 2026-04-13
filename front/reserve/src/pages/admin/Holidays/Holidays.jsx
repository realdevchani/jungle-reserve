import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import S from "./style";

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

const Holidays = () => {
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const fetchHolidays = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/holidays");
      if (res.ok) {
        const data = await res.json();
        setHolidays(data.data);
      } else if (res.status === 401) {
        navigate("/admin/login");
      }
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
      return;
    }
    fetchHolidays();
  }, [navigate, fetchHolidays]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;

    try {
      const res = await adminFetch("/api/admin/holidays", {
        method: "POST",
        body: JSON.stringify({ holidayDate: date, reason }),
      });
      if (res.ok) {
        setDate("");
        setReason("");
        fetchHolidays();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, dateStr) => {
    if (!window.confirm(`${dateStr} 휴무일을 삭제하시겠습니까?`)) return;
    try {
      const res = await adminFetch(`/api/admin/holidays/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchHolidays();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <S.Wrap>
      <S.Title>휴무일 관리</S.Title>

      <S.Form onSubmit={handleSubmit}>
        <S.InputGroup>
          <S.Label>날짜</S.Label>
          <S.Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>사유 (선택)</S.Label>
          <S.Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="예: 정기 점검일"
          />
        </S.InputGroup>
        <S.AddButton type="submit">등록</S.AddButton>
      </S.Form>

      {holidays.length === 0 ? (
        <S.Empty>등록된 휴무일이 없습니다.</S.Empty>
      ) : (
        <S.List>
          {holidays.map((h) => (
            <S.Item key={h.id}>
              <S.ItemInfo>
                <S.Date>{h.holidayDate}</S.Date>
                {h.reason && <S.Reason>{h.reason}</S.Reason>}
              </S.ItemInfo>
              <S.DeleteButton onClick={() => handleDelete(h.id, h.holidayDate)}>
                삭제
              </S.DeleteButton>
            </S.Item>
          ))}
        </S.List>
      )}
    </S.Wrap>
  );
};

export default Holidays;
