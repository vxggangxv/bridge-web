import { keys } from './storage';

// ms * 초 * 분 * 시간 * 날짜
const maxAge = 1000 * 60 * 60 * 24 * 7;
// function saveAuthToCookie(value) {
//   document.cookie = `_dof_brdge_auth=${value}; max-age=${maxAge}`;
// }

// function saveUserToCookie(value) {
//   document.cookie = `_dof_brdge_user=${value}`;
// }

// function getAuthFromCookie() {
//   return document.cookie.replace(/(?:(?:^|.*;\s*)_dof_brdge_auth\s*=\s*([^;]*).*$)|^.*$/, '$1');
// }

// function getUserFromCookie() {
//   return document.cookie.replace(/(?:(?:^|.*;\s*)_dof_brdge_user\s*=\s*([^;]*).*$)|^.*$/, '$1');
// }

// var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
// return value? value[2] : null;

export function saveRememberUserTokenToCookie(value) {
  document.cookie = `${keys.remember_user_token}=${value}; max-age=${maxAge}`;
}

export function saveSignInTokenToCookie(value) {
  document.cookie = `${keys.sign_in_token}=${value}; max-age=${maxAge}`;
}

export function getRememberUserTokenFromCookie(key) {
  return document.cookie.replace(/(?:(?:^|.*;\s*)`${key}`\s*=\s*([^;]*).*$)|^.*$/, '$1');
}

export function getSignInTokenFromCookie() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)_dof_brdge_auth\s*=\s*([^;]*).*$)|^.*$/, '$1');
}

export function deleteCookie(value) {
  document.cookie = `${value}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
