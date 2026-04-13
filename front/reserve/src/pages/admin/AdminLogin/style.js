import styled from "styled-components";

const S = {};

S.Wrap = styled.div`
  width: 440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

S.Title = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
  margin-bottom: 32px;
`;

S.Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
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
  height: 48px;
  background-color: #70C60C;
  color: #fff;
  font-family: 'pretendard', sans-serif;
  font-size: 16px;
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
