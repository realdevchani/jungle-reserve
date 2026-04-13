import { createAction, handleActions } from "redux-actions";

const SET_USER = "user/SET_USER";
const SET_LOGIN_STATUS = "user/SET_LOGIN_STATUS";
const SET_AUTH_READY = "user/SET_AUTH_READY";
const SET_ACTIVE_ROOM = "user/SET_ACTIVE_ROOM";

export const setUser = createAction(SET_USER);
export const setLoginStatus = createAction(SET_LOGIN_STATUS);
export const setAuthReady = createAction(SET_AUTH_READY);
export const setActiveRoom = createAction(SET_ACTIVE_ROOM);

const userInitialState = {
  currentUser: {
    id: 0,
    userName: "",
    userPhone: "",
  },
  isLogin: false,
  authReady: false,
  activeRoom: null,
};

const user = handleActions(
  {
    [SET_USER]: (state, action) => ({ ...state, currentUser: action.payload }),
    [SET_LOGIN_STATUS]: (state, action) => ({ ...state, isLogin: action.payload }),
    [SET_AUTH_READY]: (state, action) => ({ ...state, authReady: action.payload }),
    [SET_ACTIVE_ROOM]: (state, action) => ({ ...state, activeRoom: action.payload }),
  },
  userInitialState
);

export default user;
