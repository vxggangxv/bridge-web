const st = typeof localStorage === 'object' ? localStorage : {};

export const keys = {
  persist: '_dof_bridge_persist',
  user: '_dof_bridge_user',
  auto_login: '_dof_bridge_auto_login',
  resent_login: '_dof_bridge_recent_login',
  remember_user_token: '_dof_bridge_remember_user_token',
  sign_in_token: '_dof_bridge_sign_in_token',
};

const storage = {
  set(key, value) {
    st[key] = JSON.stringify(value);
  },
  get(key) {
    if (!st[key]) return null;
    const value = st[key];
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (e) {
      return value;
    }
  },
  remove(key) {
    delete st[key];
  },
  clear() {
    if (st.clear) {
      st.clear();
    }
  },
};

// export function setCookieHour(name, value, hours) {
//   var now = new Date();
//   var time = now.getTime();
//   time += 3600 * hours;
//   now.setTime(time);
//   document.cookie = name + '=' + escape(value) + '; path=/; expires=' + now.toUTCString() + ';';
// }

// export function setCookieDay(name, value, days) {
//   var now = new Date();
//   var time = now.getTime();
//   time += 3600 * 24 * days;
//   now.setTime(time);
//   document.cookie = name + '=' + escape(value) + '; path=/; expires=' + now.toUTCString() + ';';
// }

// 브라우저를 닫으면 지워지는 쿠키설정
export function setSessionCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

// 1h * 시간 * 날짜
const maxAge = 3600 * 24 * 7;
export function setCookie(name, value, options = {}) {
  // console.log('options', options);
  options = {
    path: '/',
    // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
    'max-age': maxAge,
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp('(?:^|; )' + name?.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export default storage;
