import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 24px 24px;
  justify-content: center;
  text-align: center;
  @media (max-width: 480px) {
    padding: 20px 16px 16px;
  }
  gap: 24px;
  margin-bottom: 24px;
`;

S.Title = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
  margin-bottom: 20px;
`;

S.HolidayBanner = styled.div`
  background-color: #ffeaea;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

S.RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  overflow: hidden;
`;

const badgeDotColors = {
  AVAILABLE: "#2993F7",
  RESERVED:  "#F2A413",
  IN_USE:    "#FF6888",
  AWAY:      "#7B68EE",
};

S.RoomCard = styled.div`
  position: relative;
  height: 60px;
  background-color: ${({ $selected }) => ($selected ? "#E8EBFF" : "#ffffff")};
  border-right: 1px solid rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  box-sizing: border-box;

  &:nth-child(2n) {
    border-right: none;
  }

  &:nth-last-child(-n+2) {
    border-bottom: none;
  }
`;

S.StatusBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

S.StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $statusKey }) => badgeDotColors[$statusKey] ?? "#cccccc"};
  flex-shrink: 0;
`;

S.StatusText = styled.span`
  font-family: 'pretendard', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${({ $statusKey }) => badgeDotColors[$statusKey] ?? "#333"};
  white-space: nowrap;
  line-height: 8px;
`;

S.RoomNumber = styled.p`
  font-family: 'Cafe24Oneprettynight', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.PALETTE.text.black};
  text-align: center;
`;

S.RoomInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

S.RoomStatus = styled.p`
  font-family: 'pretendard', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.PALETTE.text.black};
  text-align: center;
`;

S.RoomUser = styled.p`
  font-family: 'pretendard', sans-serif;
  font-size: 11px;
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
`;

S.RoomTimer = styled.p`
  font-family: 'pretendard', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.PALETTE.text.black};
`;

S.ReserveButton = styled.button`
  width: 100%;
  height: 36px;
  margin-top: 20px;
  background-color: ${({ $state, theme }) =>
    $state === 'selected' ? theme.PALETTE.purple :
    $state === 'allFull'  ? theme.PALETTE.pinkLight :
    theme.PALETTE.beige};
  color: ${({ theme }) => theme.PALETTE.text.black};
  font-family: 'Cafe24Oneprettynight', sans-serif;
  font-size: 16px;
  font-weight: 400;
  border: none;
  border-radius: 5px;
  cursor: ${({ $state }) => ($state === 'selected' ? 'pointer' : 'default')};
  transition: opacity 0.2s;

  &:hover {
    opacity: ${({ $state }) => ($state === 'selected' ? '0.8' : '1')};
  }
`;

S.BlueBadge = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: #2993F7;
`
S.RedBadge = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: #FF6888;
`
S.YellowBadge = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: #F2A413;
`
S.Explain = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
`
S.ExplainWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 12px;
`

export default S;
