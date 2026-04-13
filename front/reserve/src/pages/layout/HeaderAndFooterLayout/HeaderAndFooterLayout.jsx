import { Outlet } from "react-router-dom";
import Header from "components/Header";
import * as S from "./style";

const HeaderAndFooterLayout = () => {
  return (
    <S.LayoutWrapper>
      <Header />
      <S.Main>
        <Outlet />
      </S.Main>
    </S.LayoutWrapper>
  );
};

export default HeaderAndFooterLayout;
