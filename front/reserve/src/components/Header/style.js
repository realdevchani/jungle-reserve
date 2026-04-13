import styled from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
  /* box-sizing: border-box; */
  border-bottom: solid 1px #000;
  margin: 0 auto;
`;

export const Logo = styled.div`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
`;
