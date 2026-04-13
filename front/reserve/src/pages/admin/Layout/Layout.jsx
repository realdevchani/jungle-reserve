import React from 'react';
import Header from './Header/Header';
import { Outlet } from 'react-router-dom';
import S from './style';

const Layout = () => {
  return (
    <S.Layout>
      <Header />
      <S.MainWrap>
      <Outlet />
      </S.MainWrap>
    </S.Layout>
  );
};

export default Layout;