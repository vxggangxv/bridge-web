import { all, takeLatest } from 'redux-saga/effects';
import { createAction, createSlice, createSelector } from '@reduxjs/toolkit';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';
import storage, { deleteCookie, getCookie, keys, setCookie, setSessionCookie } from 'lib/storage';
import * as authApi from 'api/auth';
import { AuthActions, UserActions } from 'store/actionCreators';
import store from 'store';

// actions
export const set_access_token = createAction('set_access_token');
export const set_is_authenticated = createAction('set_is_authenticated');
export const set_resent_login = createAction('set_resent_login');
// TODO: api연결 후 수정
export const sign_up = createFetchAction('sign_up');
export const sign_in = createFetchAction('sign_in');
export const sign_out = createFetchAction('sign_out');
export const auto_login = createFetchAction('auto_login');
export const check_email = createFetchAction('check_email');
export const check_code = createFetchAction('check_code');
export const check_reset_email = createFetchAction('check_reset_email');
export const check_reset_code = createFetchAction('check_reset_code');
export const reset_password = createFetchAction('reset_password');
export const change_password = createFetchAction('change_password');
// dof login
export const dof_oauth2_signin = createFetchAction('dof_oauth2_signin');
export const dof_oauth2_signup = createFetchAction('dof_oauth2_signup');
export const dof_oauth2_legal = createFetchAction('dof_oauth2_legal');
export const dof_oauth2_profile = createFetchAction('dof_oauth2_profile');
export const dof_oauth2_password = createFetchAction('dof_oauth2_password');

export const accessToken = storage.get(keys.user)?.autoLogin
  ? getCookie(keys.remember_user_token)
  : getCookie(keys.sign_in_token) || null;

const initialState = {
  // NOTE: 최초 랜딩시 storage값 유무 확인
  accessToken,
  // isAuthenticated: storage.get(keys.user)?.autoLogin
  //   ? !!getCookie(keys.remember_user_token)
  //   : !!getCookie(keys.sign_in_token) || null,
  // autoLogin: null,
  resentLogin: getCookie(keys.resent_login)?.split(',') || [],
  privateSocket: null,
  signUp: {
    ...fetchInitialState,
    data: null,
  },
  signIn: {
    ...fetchInitialState,
    data: null,
  },
  signOut: {
    ...fetchInitialState,
    data: null,
  },
  autoLogin: {
    ...fetchInitialState,
    data: null,
  },
  checkEmail: {
    ...fetchInitialState,
    data: null,
  },
  checkCode: {
    ...fetchInitialState,
    data: null,
  },
  checkResetEmail: {
    ...fetchInitialState,
    data: null,
  },
  checkResetCode: {
    ...fetchInitialState,
    data: null,
  },
  resetPassword: {
    ...fetchInitialState,
    data: null,
  },
  changePassword: {
    ...fetchInitialState,
    data: null,
  },
  dofOauth2SignIn: {
    ...fetchInitialState,
    data: null,
  },
  dofOauth2SignUp: {
    ...fetchInitialState,
    data: null,
  },
  dofOauth2LegalUpdate: {
    ...fetchInitialState,
    data: null,
  },
  dofOauth2Profile: {
    ...fetchInitialState,
    data: null,
  },
  dofOauth2Password: {
    ...fetchInitialState,
    data: null,
  },
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    set_access_token: (state, { payload }) => {
      // console.log(payload, 'payload set_access_token');
      state.accessToken = payload;
    },
    set_resent_login: (state, { payload }) => {
      state.resentLogin = payload;
    },
    set_private_socket: (state, { payload }) => {
      state.privateSockect = payload;
    },
    // TEST: signOut api연동 전 테스트용
    // set_is_authenticated: (state, { payload }) => {
    //   state.isAuthenticated = payload;
    // },
    ...fetchReducerActions(sign_up, 'signUp', {
      // common(state, { payload }) {
      //   state.signUp.result = payload?.result;
      //   state.signUp.result = payload?.emailResult;
      // },
      success() {},
    }),
    ...fetchReducerActions(sign_in, 'signIn', {
      // common(state, { payload }) {
      //   state.signIn.result = payload?.result;
      //   state.signIn.result = payload?.emailResult;
      // },
      success(state, { payload }) {
        // console.log(payload, 'payload signIn');
        // const { accessToken, info } = payload;
        // const autoLogin = payload.payload?.autoLogin;
        // const { email, profile } = info.email;
        // if (!accessToken) return;
        // const userInfo = {
        //   email,
        //   profile,
        //   autoLogin,
        // };
        // // storage.set(keys.user, userInfo);
        // setSessionCookie(keys.sign_in_token, accessToken);
        // if (autoLogin) setCookie(keys.remember_user_token, accessToken, { 'max-age': 3600 * 6 });
      },
    }),
    ...fetchReducerActions(sign_out, 'signOut', {
      success(state, { payload }) {
        // storage.remove(keys.user);
        // deleteCookie(keys.sign_in_token);
        // deleteCookie(keys.remember_user_token);
        // // persist 삭제
        // storage.remove(`persist:${keys.persist}`);
        // sessionStorage.removeItem(`persist:${keys.persist}`);
      },
    }),
    // auto_login: state => {
    //   // DEBUG: 백엔드 연결 후 테스트 필요
    // },
    ...fetchReducerActions(check_email, 'checkEmail'),
    ...fetchReducerActions(check_code, 'checkCode'),
    ...fetchReducerActions(check_reset_email, 'checkResetEmail'),
    ...fetchReducerActions(check_reset_code, 'checkResetCode'),
    ...fetchReducerActions(reset_password, 'resetPassword'),
    ...fetchReducerActions(change_password, 'changePassword'),

    ...fetchReducerActions(dof_oauth2_signin, 'dofOauth2SignIn'),
    ...fetchReducerActions(dof_oauth2_legal, 'dofOauth2LegalUpdate'),
    ...fetchReducerActions(dof_oauth2_signup, 'dofOauth2SignUp'),
    ...fetchReducerActions(dof_oauth2_profile, 'dofOauth2Profile'),
    ...fetchReducerActions(dof_oauth2_password, 'dofOauth2Password'),
  },
});

export const name = slice.name;
export const actions = slice.actions;

// createSelector
export const accessTokenSelector = state => state.auth.accessToken;
export const isAuthenticatedSelector = createSelector(accessTokenSelector, item => !!item);
export const logInSelector = state => ({
  accessToken: state.auth.accessToken,
  user: state.user.user,
});
export const isLogInSelector = createSelector(
  logInSelector,
  item => !!item.accessToken && !!item.user,
);

// createSaga
const handleSignIn = createSaga(actions, 'sign_in', authApi.signIn, {
  success(data) {
    // console.log(data, 'saga data');
    const { accessToken, info } = data;
    const autoLogin = data.payload?.autoLogin;
    const { userCode, email, profileImg, company } = info;
    if (!accessToken) return;
    const userInfo = {
      userCode,
      // email,
      company,
      profileImg,
      autoLogin,
    };
    storage.set(keys.user, userInfo);
    setSessionCookie(keys.sign_in_token, accessToken);
    if (autoLogin) setCookie(keys.remember_user_token, accessToken, { 'max-age': 3600 * 6 });
    UserActions.set_user(userInfo);
    AuthActions.set_access_token(accessToken);

    // set resent login
    let resentLogin = getCookie(keys.resent_login)?.split(',') || [];
    // 증복 제거
    resentLogin = new Set([...resentLogin, email]);
    setCookie(keys.resent_login, Array.from(resentLogin));
    AuthActions.set_resent_login(Array.from(resentLogin));
  },
});

// TODO: 예정
const handleSignOut = createSaga(actions, 'sign_out', authApi.signOut, {
  success(data) {},
});

// signOut api 와 동시 진행을 위해, 별도 분리
export function signOut() {
  deleteCookie(keys.sign_in_token);
  deleteCookie(keys.remember_user_token);
  storage.remove(keys.user);
  UserActions.set_user(null);
  AuthActions.set_access_token(null);
  // persist 삭제
  storage.remove(`persist:${keys.persist}`);
  sessionStorage.removeItem(`persist:${keys.persist}`);
}

export function* authSaga() {
  yield all([
    takeLatest(actions.sign_up_request, createSaga(actions, 'sign_up', authApi.signUp)),
    takeLatest(actions.sign_in_request, handleSignIn),
    // TODO: 예정
    takeLatest(actions.sign_out_request, handleSignOut),
    takeLatest(
      actions.check_email_request,
      createSaga(actions, 'check_email', authApi.checkEmail, { isAlertSuccess: true }),
    ),
    takeLatest(
      actions.check_code_request,
      createSaga(actions, 'check_code', authApi.checkCode, { isAlertSuccess: true }),
    ),
    takeLatest(
      actions.check_reset_email_request,
      createSaga(actions, 'check_reset_email', authApi.checkResetEmail, { isAlertSuccess: true }),
    ),
    takeLatest(
      actions.check_reset_code_request,
      createSaga(actions, 'check_reset_code', authApi.checkResetCode, { isAlertSuccess: true }),
    ),
    takeLatest(
      actions.reset_password_request,
      createSaga(actions, 'reset_password', authApi.resetPassword),
    ),
    takeLatest(
      actions.change_password_request,
      createSaga(actions, 'change_password', authApi.changePassword),
    ),
    // dof login
    takeLatest(
      actions.dof_oauth2_legal_request,
      createSaga(actions, 'dof_oauth2_legal', authApi.dofOauth2LegalUpdate),
    ),
    takeLatest(
      actions.dof_oauth2_signin_request,
      createSaga(actions, 'dof_oauth2_signin', authApi.dofOauth2SignIn),
    ),
    takeLatest(
      actions.dof_oauth2_signup_request,
      createSaga(actions, 'dof_oauth2_signup', authApi.dofOauth2SignUp),
    ),
    takeLatest(
      actions.dof_oauth2_profile_request,
      createSaga(actions, 'dof_oauth2_profile', authApi.dofOauth2ProfileModify),
    ),
    takeLatest(
      actions.dof_oauth2_password_request,
      createSaga(actions, 'dof_oauth2_password', authApi.dofOauth2PasswordChange),
    ),
  ]);
}

export default slice.reducer;
