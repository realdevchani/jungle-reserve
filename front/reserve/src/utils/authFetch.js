import store from 'store';
import { setLoginStatus, setAuthReady } from 'modules/user';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// 진행 중인 refresh 요청을 공유 (중복 방지)
let refreshPromise = null;

// 토큰 자동 갱신 fetch wrapper
// 요청 → 401 → refresh → 새 토큰으로 재요청
const authFetch = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');

  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // 1차 요청
  let res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // 401이면 토큰 갱신 시도 (동시 요청 중복 방지)
  if (res.status === 401) {
    if (!refreshPromise) {
      // 백엔드 TokenDTO: { accessToken } 필요
      const currentToken = localStorage.getItem('accessToken');
      refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accessToken: currentToken }),
      }).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshRes = await refreshPromise;

    if (refreshRes.ok) {
      const refreshData = await refreshRes.clone().json();
      const newAccessToken = refreshData.data?.accessToken ?? refreshData.accessToken;

      if (!newAccessToken) {
        // 새 토큰을 파싱 못하면 로그아웃
        localStorage.removeItem('accessToken');
        store.dispatch(setLoginStatus(false));
        store.dispatch(setAuthReady(true));
        return res;
      }

      localStorage.setItem('accessToken', newAccessToken);
      // 새 토큰으로 원래 요청 재시도
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      // refresh도 실패하면 로그아웃 처리 (Redux 상태도 초기화)
      localStorage.removeItem('accessToken');
      store.dispatch(setLoginStatus(false));
      store.dispatch(setAuthReady(true));
    }
  }

  return res;
};

export default authFetch;
