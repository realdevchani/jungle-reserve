import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px;
`;

S.Title = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
  margin-bottom: 24px;
`;

S.Form = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
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

S.AddButton = styled.button`
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

S.List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

S.Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;

  &:first-child {
    border-top: 1px solid #f0f0f0;
  }
`;

S.ItemInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
`;

S.Date = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.PALETTE.text.black};
`;

S.Reason = styled.span`
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
`;

S.DeleteButton = styled.button`
  background: none;
  border: 1px solid #e57373;
  color: #e57373;
  border-radius: 4px;
  padding: 6px 12px;
  font-family: 'pretendard', sans-serif;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #ffeaea;
  }
`;

S.Empty = styled.p`
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
`;

export default S;
