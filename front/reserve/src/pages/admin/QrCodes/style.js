import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
`;

S.Title = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
  margin-bottom: 24px;
`;

S.UrlForm = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

S.InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

S.Label = styled.label`
  font-family: 'pretendard', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
`;

S.Input = styled.input`
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.PALETTE.purple};
  }
`;

S.PrintButton = styled.button`
  height: 44px;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.PALETTE.purple};
  color: #fff;
  border: none;
  border-radius: 5px;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
`;

S.Hint = styled.p`
  font-family: 'pretendard', sans-serif;
  font-size: 13px;
  color: #999;
  margin-bottom: 24px;
`;

S.QrGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

S.QrCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
`;

S.RoomLabel = styled.h3`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: 18px;
  color: ${({ theme }) => theme.PALETTE.text.black};
`;

S.QrUrl = styled.p`
  font-family: 'pretendard', sans-serif;
  font-size: 11px;
  color: #999;
  word-break: break-all;
  text-align: center;
`;

export default S;
