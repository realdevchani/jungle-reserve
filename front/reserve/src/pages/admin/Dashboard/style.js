import styled from "styled-components";

const S = {};

S.Panel = styled.div`
  width: 100%;
  padding: 24px;
  background: #f8f8f8;
  border-radius: 8px;
  text-align: left;
`;

S.PanelTitle = styled.p`
  font-family: "pretendard", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 36px 0;
`;

S.PanelRow = styled.div`
  margin-bottom: ${({ $bottom }) => $bottom ?? 24}px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

S.InputTitle = styled.label`
  display: block;
  font-family: "pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme?.PALETTE?.text?.inputTitle ?? "#666"};
  margin-bottom: ${({ $gap }) => $gap ?? 12}px;
`;

S.Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-family: "pretendard", sans-serif;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme?.PALETTE?.purple ?? "#6b4fbb"};
  }
  &::placeholder {
    color: ${({ theme }) => theme?.PALETTE?.text?.placeholder ?? "#999"};
  }
`;

S.InUseInfo = styled.p`
  font-family: "pretendard", sans-serif;
  font-size: 14px;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.5;
`;

S.ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 36px;
`;

/* 어드민 로그인 버튼과 동일: #70C60C, #fff */
S.PrimaryButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: #70C60C;
  color: #fff;
  font-family: "pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

S.CheckOutButton = styled(S.PrimaryButton)`
  background-color: #ff6888;
  color: #fff;
`;

S.CancelButton = styled.button`
  width: 100%;
  height: 44px;
  background-color: ${({ $inUse }) => ($inUse ? "#FFEFFA" : "#EFFBEA")};
  color: #666666;
  font-family: "pretendard", sans-serif;
  font-size: 15px;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

export default S;
