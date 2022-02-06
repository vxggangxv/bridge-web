import { axs } from './config/axiosConfig';
import { SYNC_API_URL, BASE_API_URL } from 'lib/setting';

const syncPath = `${SYNC_API_URL}/user`;
const basePath = `${BASE_API_URL}/user`;
const authPath = `${BASE_API_URL}/auth`;

/** /auth/ */
export function dofOauth2SignIn(payload) {
  return axs({ url: `${authPath}/connect`, method: 'post', data: payload });
}
export function dofOauth2LegalUpdate(payload) {
  return axs({ url: `${authPath}/agreement/update`, method: 'post', data: payload });
}
export function dofOauth2SignUp(payload) {
  return axs({ url: `${authPath}/signup`, method: 'post', data: payload });
}
export function dofOauth2ProfileModify(payload) {
  return axs({ url: `${authPath}/modify`, method: 'post', data: payload });
}
export function dofOauth2PasswordChange(payload) {
  return axs({ url: `${authPath}/password/change`, method: 'post', data: payload });
}

/** /user/ */
export function signUp(payload) {
  return axs({ url: `${basePath}/signup`, method: 'post', data: payload });
}

export function signIn(payload) {
  return axs({ url: `${basePath}/login`, method: 'post', data: payload });
}

export function signOut(payload) {
  return axs({ url: `${basePath}/logout`, method: 'post', data: payload });
}

// export function autoLogin(payload) {
//   return axs({ url: `${basePath}/autologin`, method: 'post', data: payload });
// }

export function checkEmail(payload) {
  return axs({ url: `${basePath}/email/check`, method: 'post', data: payload });
}

export function checkCode(payload) {
  return axs({ url: `${basePath}/email/check`, method: 'put', data: payload });
}

export function checkResetEmail(payload) {
  return axs({ url: `${basePath}/email/password`, method: 'post', data: payload });
}

export function checkResetCode(payload) {
  return axs({ url: `${basePath}/email/password`, method: 'put', data: payload });
}

export function resetPassword(payload) {
  return axs({ url: `${basePath}/password/reset`, method: 'put', data: payload });
}

export function changePassword(payload) {
  return axs({ url: `${basePath}/password/change`, method: 'put', data: payload });
}
