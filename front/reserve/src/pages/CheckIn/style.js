import styled, { keyframes } from "styled-components";

const S = {};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

S.Wrap = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (max-width: 480px) {
    padding: 20px 16px;
  }
  flex: 1;
  gap: 48px;
`;

S.LoadingWrap = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  gap: 0;
`;

S.LoadingTitle = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
  color: ${({ theme }) => theme.PALETTE.text.black};
  text-align: center;
`;

S.LoadingImageWrap = styled.div`
  margin-top: 64px;
  margin-bottom: 64px;
`;

S.LoadingImage = styled.img`
  width: 64px;
  height: 64px;
  animation: ${spin} 1s linear infinite;
`;

S.LoadingTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

S.LoadingMain = styled.p`
  font-family: 'Cafe24Oneprettynight', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.PALETTE.text.black};
  text-align: center;
`;

S.LoadingSub = styled.p`
  font-family: 'Cafe24Oneprettynight', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.PALETTE.text.placeholder};
  text-align: center;
`;

S.RoomHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
`;
S.TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  align-items: center;
`


S.RoomTitle = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
`;

S.TextArea = styled.div`
  margin: 0 auto;
  gap: 64px;
  width: 100%;
  display: flex;
`
S.TimerWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`
S.ButtonArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`
S.ButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  
`
S.Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
`
S.SubButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: ${({ $isActive }) => $isActive ? "#E8EBFF" : "#F8FAFD"};
  gap: 8px;
`
S.ExtendButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 8px;
  border-radius: 5px;
  background-color: ${({ $isActive }) => $isActive ? "#E8EBFF" : "#F8FAFD"};
`

export default S;
