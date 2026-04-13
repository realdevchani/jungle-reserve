import React from "react";
import S from "./style";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const navItems = [
    { label: "홈", path: "/admin" },
    { label: "휴무 등록", path: "/admin/holidays" },
    { label: "원생 관리", path: "/admin/users" },
    { label: "신고/이슈", path: "/admin/issues" },
    { label: "QR 코드", path: "/admin/qrcodes" },
  ];

  return (
    <S.HeaderWrap>
      {navItems.map(({ label, path }) => (
        <S.NavItem
          key={path}
          $active={path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path)}
          onClick={() => navigate(path)}
        >
          {label}
        </S.NavItem>
      ))}
      <S.NavItem onClick={handleLogout}>로그아웃</S.NavItem>
    </S.HeaderWrap>
  );
};

export default Header;