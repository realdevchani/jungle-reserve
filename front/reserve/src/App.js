import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoginStatus, setAuthReady, setActiveRoom } from 'modules/user';
import { getActiveRoomPath } from 'utils/roomRoute';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/global';
import theme from './styles/theme';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import authFetch from 'utils/authFetch';

function App() {
  const dispatch = useDispatch();
  const { activeRoom, authReady } = useSelector((state) => state.user);
  const prevActiveRoom = useRef(undefined);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      dispatch(setAuthReady(true));
      return;
    }

    authFetch('/private/users/me')
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem('accessToken');
          return null;
        }
        return res.json();
      })
      .then(async (data) => {
        if (data) {
          dispatch(setUser(data.data));
          dispatch(setLoginStatus(true));
          try {
            const roomRes = await authFetch('/api/rooms/my');
            if (roomRes.ok) {
              const roomData = await roomRes.json();
              dispatch(setActiveRoom(roomData.data));
            }
          } catch (_) {}
        }
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
      })
      .finally(() => {
        dispatch(setAuthReady(true));
      });
  }, [dispatch]);

  useEffect(() => {
    if (!authReady) return;

    const path = getActiveRoomPath(activeRoom);

    if (path) {
      router.navigate(path, { replace: true });
    } else if (prevActiveRoom.current && !activeRoom) {
      router.navigate('/', { replace: true });
    }

    prevActiveRoom.current = activeRoom;
  }, [activeRoom, authReady]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
