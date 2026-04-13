import { useNavigate } from "react-router-dom";
import * as S from "./style";

const Header = () => {
  const navigate = useNavigate();
  const handleOnClickToMoveMain = ((e) => {
    navigate('/')
  })
  return (
    <S.HeaderContainer>
      <S.Logo onClick={handleOnClickToMoveMain}>정글뮤직아카데미 연습실 예약</S.Logo>
    </S.HeaderContainer>
  );
};

export default Header;
