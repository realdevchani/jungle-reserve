import { useState } from "react";
import { useNavigate } from "react-router-dom";
import S from "./style";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ adminId: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.data.accessToken);
        navigate("/admin");
      } else {
        alert(data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  return (
    <S.Wrap>
      <S.Form onSubmit={handleSubmit}>
        <S.InputGroup>
          <S.Label>아이디</S.Label>
          <S.Input name="adminId" value={form.adminId} onChange={handleChange} placeholder="admin" />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••" />
        </S.InputGroup>
        <S.Button type="submit">로그인</S.Button>
      </S.Form>
    </S.Wrap>
  );
};

export default AdminLogin;
