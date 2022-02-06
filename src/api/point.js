import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/point`;

// page=1&pointType=1
export function fetchHistories(payload) {
  return axs({ url: `${basePath}/history`, method: 'get', params: payload });
}

export function fetchStatus(payload) {
  return axs({ url: `${basePath}/status`, method: 'get', params: payload });
}

// [GET] /point/exchange
export function fetchPoints() {
  return axs({ url: `${basePath}/exchange`, method: 'get' });
}
// [POST] /point/exchange
export function exchangePoints(payload) {
  return axs({ url: `${basePath}/exchange`, method: 'post', data: payload });
}
