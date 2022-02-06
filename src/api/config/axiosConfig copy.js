import _ from 'lodash';
import axios from 'axios';
import { ENV_MODE_DEV, ENV_MODE_PROD } from 'lib/setting';

/**
 *
 * @param {*} axiosConf object
 * 통신할때 필요한 axios의 config 값을 넣어줍니다.
 * @param {*} config object
 * {header:false} 라고 할 시 header 체크를 하지 않습니다.
 */
/**
 *
  "result": 1,
    "headers": {
      "loginUserCode": "",
      "x-access-token": null
    }
  }
 */

// NOTE: 취소 토큰
const { CancelToken } = axios;
const source = CancelToken.source();

export function axs(axiosConf, config = {}) {
  axiosConf.cancelToken = source.token;

  const defaultConfig = { header: true };
  const mergeConfig = _.merge(defaultConfig, config);

  // NOTE: axiosConf data check
  const hasData = axiosConf.data;
  if (hasData) {
    axiosConf.data.url = axiosConf.url;
  }

  if (mergeConfig && mergeConfig.header) {
    // NOTE: 기본 타임아웃: 10초
    if (axiosConf.timeout !== false) axiosConf.timeout = 10000;

    return axios(axiosConf)
      .then(response => {
        const { data, error } = response;
        // NOTE: response로 error값이 왔을 경우 취소
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
          return { cancel: true };
        }
        try {
          // NOTE: data.headers 로 actinos 처리
          if (data) {
            // Actions.network_connect({ value: data.headers?.onlineState });
            // Actions.message_get({ value: data.headers?.notReadMessage });
            // if (data.result === 5 && ENV_MODE_PROD) Actions.result_status(5);
          }
        } catch (error) {
          // NOTE: try 에러 로그
          console.log(error, 'error');
          console.error('Response Data is undefined');
          // const errorConf = {
          //   // url:"http://localhost:9999/errortest",
          //   url: endPoint.post_error_meesage,
          //   method: 'post',
          //   data: {
          //     url: axiosConf.url,
          //     payload: axiosConf,
          //     statusCode: error.statusCode,
          //     message: error.message,
          //     stack: error.stack,
          //   },
          // };

          // axios(errorConf).catch(error => ({ error, payload: axiosConf.data }));
        }
        // NOTE: 전송된 paylod check
        response.data.payload = axiosConf.data;
        return response;
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.resquest) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        return { error, payload: axiosConf.data };
      });
  }
  return axios(axiosConf).catch(error => ({ error, payload: axiosConf.data }));
}

// export function axiosCancel() {
//   source.cancel('Operation canceled');
// }

// NOTE: 개별 수정
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
        'x-access-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiOTA3MjhmOWUtZDI3Mi00YmVkLTkwYTQtNDliMzUyNTYwYzQzIiwiaWF0IjoxNTgxMDUzMTA2LCJleHAiOjE1ODEwNTMxMDd9.rYK8C5f7SRFrn_1RRX9cxTHsNH9csKmXqmwhbwGsrkY',
        loginUserCode: '20Jan31-0001',
      },
    };
  }
  Object.assign(axiosConf.data, headerObj);
  return axiosConf;
}
