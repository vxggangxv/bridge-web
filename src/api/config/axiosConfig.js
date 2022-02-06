import axios from 'axios';
import { ENV_MODE_DEV, ENV_MODE_PROD } from 'lib/setting';
import { BaseActions } from 'store/actionCreators';
import store from 'store';
import storage, { keys, setCookie, setSessionCookie } from 'lib/storage';
// import { useShallowSelector } from 'lib/utils';

/**
 *
 * @param {*} axiosConf object
 * 통신할때 필요한 axios의 config 값을 넣어줍니다.
 */

// NOTE: 취소 토큰
// const { CancelToken } = axios;
// const source = CancelToken.source();
export function axs(axiosConf) {
  // set Authorization
  if (!!store.getState().auth.accessToken)
    axiosConf.headers = { 'x-access-token': store.getState().auth.accessToken };

  // axiosConf.cancelToken = source.token;
  // NOTE: 차후 cancel 필요시 추가 개발
  // if (axiosConf.cancel) source.cancel('Operation canceled');

  // NOTE: 기본 타임아웃: 10초
  if (axiosConf.timeout !== false) axiosConf.timeout = 10000;

  // NOTE: 보낸 데이터 payload data(data, url, method, params) 확인용
  axiosConf.data = axiosConf.data ? axiosConf.data : {};
  axiosConf.data.url = axiosConf.url;
  axiosConf.data.method = axiosConf.method;
  if (axiosConf.params) axiosConf.data.params = axiosConf.params;

  return axios(axiosConf)
    .then(response => {
      // console.log(response, 'response');
      if (response.headers['x-access-token']) {
        const accessToken = response.headers['x-access-token'];
        response.data.accessToken = accessToken;
        response.data.payload = axiosConf.data;
        // 자동 accessToken 갱신
        setSessionCookie(keys.sign_in_token, accessToken);
        // if (store.getState().auth.autoLogin)
        // console.log('storage.get(keys.user)?.autoLogin', storage.get(keys.user)?.autoLogin);
        if (storage.get(keys.user)?.autoLogin) {
          // console.log('accessToken', accessToken);
          setCookie(keys.remember_user_token, accessToken, { 'max-age': 3600 * 6 });
        }
      }

      return response;
    })
    .catch(error => {
      const { response = {}, request = '', message = '' } = error;
      const { data = null, status = '', headers = null } = response;
      // const responseStatus = data?.status ? data.status : status;
      const responseStatus = status;
      const responseMessage = data?.msg ? data.msg : message;

      if (!!(String(responseStatus).charAt(0) !== '5')) {
        BaseActions.response_status(responseStatus);
      }
      if (ENV_MODE_PROD && !!(String(responseStatus).charAt(0) === '5')) {
        BaseActions.response_status(500);
      }
      throw {
        status: responseStatus,
        message: responseMessage,
        payload: axiosConf.data,
      };
    });
}

// NOTE: DOFSync 사용
/**
 * Test Server Set Header
 * @param {} axiosConf
 */
export function setHeader(axiosConf) {
  // NOTE: receiver : 20Jan31-0001
  // NOTE: sender : 20Feb12-0002
  let headerObj;
  if (ENV_MODE_DEV) {
    headerObj = {
      headers: {
        'x-access-token': '',
      },
    };
  }
  Object.assign(axiosConf.data, headerObj);
  return axiosConf;
}

// console.log(response.data);
// console.log(response.status);
// console.log(response.statusText);
// console.log(response.headers);
// console.log(response.config);
// console.log(response.headers['x-access-token'], 'axios response');

// console.log(error, 'error');
// console.log(response, 'response');
// console.log(request, 'request');
// console.log(message, 'message');
// console.log(data, 'Error response data');
// console.log(status, 'Error response status');
// console.log(headers, 'Error response headers');

// 참고
/* 
if (response) {
  // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
  // console.log(data, 'Error response data');
  // console.log(status, 'Error response status');
  // console.log(headers, 'Error response headers');
  // TEST: 에러 상태에 대한 처리
  // if (data) BaseActions.response_error(data);
  // if (status) BaseActions.response_status(status);
  // NOTE: 차후 auth에 대한 에러처리
  // const { status } = response;
  // if (status === 401) return onUnauthorized();
} else if (request) {
  // 요청이 이루어 졌으나 응답을 받지 못했습니다.
  // console.log(request, 'Error request');
} else {
  // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
  // console.log(message, 'Error message');
}
*/
