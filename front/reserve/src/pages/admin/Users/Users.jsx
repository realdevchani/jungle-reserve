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

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data);
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
    fetchUsers();
  }, [navigate, fetchUsers]);

  const handlePinReset = async (userId, userName) => {
    if (!window.confirm(`${userName} 학생의 PIN을 초기화하시겠습니까?`)) return;
    try {
      const res = await adminFetch(`/api/admin/users/${userId}/pin-reset`, {
        method: "PUT",
      });
      if (res.ok) {
        alert("PIN이 초기화되었습니다.");
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatMinutes = (min) => {
    if (!min) return "0시간 0분";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}시간 ${m}분`;
  };

  const filteredUsers = users.filter(
    (u) => u.userName?.includes(search) || u.userPhone?.includes(search)
  );

  return (
    <S.Wrap>
      <S.Header>
        <S.Title>학생 관리</S.Title>
        <div style={{ display: "flex", gap: "12px" }}>
          <S.UploadLink onClick={() => navigate("/admin/users/upload")}>
            엑셀 업로드
          </S.UploadLink>
          <S.UploadLink onClick={() => navigate("/admin/holidays")}>
            휴무일 관리
          </S.UploadLink>
        </div>
      </S.Header>

      <S.SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="이름 또는 전화번호 검색"
      />

      <S.Table>
        <S.Thead>
          <tr>
            <S.Th>이름</S.Th>
            <S.Th>전화번호</S.Th>
            <S.Th>총 연습시간</S.Th>
            <S.Th>PIN</S.Th>
          </tr>
        </S.Thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <S.Td>{user.userName}</S.Td>
              <S.Td>{user.userPhone}</S.Td>
              <S.Td>{formatMinutes(user.totalPracticeMinutes)}</S.Td>
              <S.Td>
                <S.PinResetButton onClick={() => handlePinReset(user.id, user.userName)}>
                  {user.pinInitialized ? "초기화" : "미설정"}
                </S.PinResetButton>
              </S.Td>
            </tr>
          ))}
        </tbody>
      </S.Table>

      {filteredUsers.length === 0 && (
        <S.Empty>등록된 학생이 없습니다.</S.Empty>
      )}
    </S.Wrap>
  );
};

export default Users;
