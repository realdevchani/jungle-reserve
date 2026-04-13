import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 100%;
  height: calc(100vh - 57px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
`;

S.Form = styled.form`
  width: 440px;
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
  font-weight: 400;
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
`;

export default S;
