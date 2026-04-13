import styled, { keyframes } from "styled-components";

const S = {};

const actionColors = {
  purple: ({ theme }) => theme.PALETTE.purple,
  pink: ({ theme }) => theme.PALETTE.pink,
  blue: ({ theme }) => theme.PALETTE.blue,
  yellow: ({ theme }) => theme.PALETTE.yellow,
  gray: () => "#e0e0e0",
};

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

S.RoomTitle = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
`;

S.StatusBadge = styled.span`
  font-family: 'pretendard', sans-serif;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: ${({ $status, theme }) => {
    const map = {
      AVAILABLE: theme.PALETTE.purple,
      RESERVED: theme.PALETTE.yellow,
      IN_USE: theme.PALETTE.pink,
      AWAY: theme.PALETTE.blue,
    };
    return map[$status] || theme.PALETTE.purple;
  }};
  color: ${({ theme }) => theme.PALETTE.text.black};
`;

S.InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
`;

S.InfoLabel = styled.span`
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
`;

S.InfoValue = styled.span`
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.PALETTE.text.black};
`;

S.ActionArea = styled.div`
  width: 100%;
  margin-top: 32px;
`;

S.ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

S.ActionButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 5px;
  font-family: 'pretendard', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.PALETTE.text.black};
  background-color: ${({ $color, theme }) => {
    const fn = actionColors[$color];
    return fn ? fn({ theme }) : theme.PALETTE.purple;
  }};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export default S;
