import styled, { keyframes } from "styled-components";

const S = {};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

S.LayOut = styled.div`
  width: 100%;
  gap: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  flex: 1;
`

S.Title = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
`
S.TitleArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`



S.LoadingWrap = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  gap: 0;
`

S.LoadingTitle = styled.h1`
  font-family: ${({ theme }) => theme.FONT.title.family};
  font-size: ${({ theme }) => theme.FONT.title.size};
  color: ${({ theme }) => theme.PALETTE.text.black};
  text-align: center;
`

S.LoadingImageWrap = styled.div`
  margin-top: 64px;
  margin-bottom: 64px;
`

S.LoadingImage = styled.img`
  width: 64px;
  height: 64px;
  animation: ${spin} 1s linear infinite;
`

S.LoadingTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

S.LoadingMain = styled.p`
  font-family: 'Cafe24Oneprettynight', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.PALETTE.text.black};
  text-align: center;
`

S.LoadingSub = styled.p`
  font-family: 'Cafe24Oneprettynight', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.PALETTE.text.placeholder};
  text-align: center;
`
S.CancelButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFEFFA;
  max-width: 335px;
  border-radius: 5px;
`
S.CheckInButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #E8EBFF;
  max-width: 335px;
  border-radius: 5px;
`
S.ButtonWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
`

S.CameraWrap = styled.div`
  width: 100%;
  max-width: 335px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

S.QrReader = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`

S.ScanMsg = styled.p`
  font-family: 'pretendard', sans-serif;
  font-size: 13px;
  color: #e53935;
  text-align: center;
`

S.CameraCloseButton = styled.button`
  padding: 8px 24px;
  border-radius: 5px;
  background-color: #e0e0e0;
  font-family: 'pretendard', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.PALETTE.text.black};
  cursor: pointer;
`

S.DurationSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  div {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: ${({ theme }) => theme.PALETTE.purple};
      cursor: pointer;
      flex-shrink: 0;
    }

    span {
      font-family: 'pretendard', sans-serif;
      font-size: 15px;
      color: ${({ theme }) => theme.PALETTE.text.black};
    }
  }
`

export default S;
