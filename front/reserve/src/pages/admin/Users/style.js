import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (max-width: 480px) {
    padding: 20px 12px;
  }
`;

S.Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

S.Title = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
`;

S.UploadLink = styled.button`
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.PALETTE.purple};
  border-radius: 5px;
  color: ${({ theme }) => theme.PALETTE.text.black};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

S.SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  outline: none;
  margin-bottom: 20px;

  &:focus {
    border-color: ${({ theme }) => theme.PALETTE.purple};
  }

  &::placeholder {
    color: ${({ theme }) => theme.PALETTE.text.placeholder};
  }
`;

S.Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

S.Thead = styled.thead`
  background-color: ${({ theme }) => theme.PALETTE.beige};
`;

S.Th = styled.th`
  font-family: 'pretendard', sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  padding: 12px 10px;
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
`;

S.Td = styled.td`
  font-family: 'pretendard', sans-serif;
  font-size: 13px;
  padding: 12px 10px;
  border-bottom: 1px solid #f0f0f0;
  color: ${({ theme }) => theme.PALETTE.text.black};
`;

S.PinResetButton = styled.button`
  font-family: 'pretendard', sans-serif;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.PALETTE.pinkLight};
  color: ${({ theme }) => theme.PALETTE.pink};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

S.Empty = styled.p`
  text-align: center;
  padding: 40px 0;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.PALETTE.text.placeholder};
`;

export default S;
