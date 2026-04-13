import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 100%;
  flex: 1;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 32px 20px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
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
  margin-bottom: 32px;
`;

S.Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

S.InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

S.Label = styled.p`
  font-family: 'pretendard', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.PALETTE.text.inputTitle};
`;

S.Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  letter-spacing: -0.025em;
  color: #121212;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.PALETTE.text.placeholder};
  }

  &:focus {
    border-color: ${({ theme }) => theme.PALETTE.purple};
  }

  @media (max-width: 480px) {
    height: 48px;
    padding: 0 12px;
  }
`;

S.Button = styled.button`
  width: 100%;
  height: 36px;
  background-color: ${({ theme }) => theme.PALETTE.purple};
  color: ${({ theme }) => theme.PALETTE.text.black};
  font-family: 'pretendard', sans-serif;
  font-size: 16px;
  font-weight: 400;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 12px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    height: 36px;
  }
`;

export default S;
