import styled from "styled-components";

const S = {};

S.HeaderWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid #000000;
  gap: 80px;
  height: 74px;
`;

S.NavItem = styled.span`
  cursor: pointer;
  font-family: "pretendard", sans-serif;
  font-size: 14px;
  color: ${({ $active, theme }) => ($active ? theme?.PALETTE?.purple ?? "#6b4fbb" : "#333")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export default S;
