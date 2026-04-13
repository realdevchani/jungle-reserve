import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

S.BackButton = styled.button`
  background: none;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
  margin-bottom: 24px;
  padding: 0;
`;

S.Title = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
  margin-bottom: 8px;
`;

S.Desc = styled.p`
  font-family: ${({ theme }) => theme.FONT.explain.family};
  font-size: ${({ theme }) => theme.FONT.explain.size};
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
  margin-bottom: 24px;
  line-height: 20px;
`;

S.FileArea = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

S.FileInput = styled.input`
  display: none;
`;

S.FileLabel = styled.label`
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 1px dashed #e0e0e0;
  border-radius: 5px;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.PALETTE.text.placeholder};
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.PALETTE.purple};
  }
`;

S.PreviewButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.PALETTE.beige};
  color: ${({ theme }) => theme.PALETTE.text.black};
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

S.PreviewTitle = styled.h2`
  font-family: ${({ theme }) => theme.FONT.modalTitle.family};
  font-size: ${({ theme }) => theme.FONT.modalTitle.size};
  margin-bottom: 12px;
`;

S.Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
`;

S.Thead = styled.thead`
  background-color: ${({ theme }) => theme.PALETTE.beige};
`;

S.Th = styled.th`
  font-family: 'pretendard', sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

S.Td = styled.td`
  font-family: 'pretendard', sans-serif;
  font-size: 13px;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
`;

S.StatusTag = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${({ $isNew, theme }) =>
    $isNew ? theme.PALETTE.purple : "#f0f0f0"};
`;

S.SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${({ theme }) => theme.PALETTE.pink};
  color: #fff;
  font-family: 'pretendard', sans-serif;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

export default S;
