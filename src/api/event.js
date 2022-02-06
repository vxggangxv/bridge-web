import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/event`;

// page=1&order=0&eventType=0&searchType=0&keyword=sender
export function fetchEvents(payload) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

// bridgeEventIdxArr = []
export function readEvents(payload) {
  return axs({ url: `${basePath}`, method: 'put', data: payload });
}

// bridgeEventIdxArr = []
export function deleteEvents(payload) {
  return axs({ url: `${basePath}`, method: 'delete', data: payload });
}

export function fetchNewEvents(payload) {
  return axs({ url: `${basePath}/new`, method: 'get', params: payload });
}
