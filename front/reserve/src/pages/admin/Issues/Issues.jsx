import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`
  padding: 32px 24px;
  text-align: center;
  font-family: "pretendard", sans-serif;
  font-size: 16px;
  color: #666;
`;

const Issues = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return <Wrap>신고/이슈 — 준비 중입니다.</Wrap>;
};

export default Issues;
