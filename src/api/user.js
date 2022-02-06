import { axs } from './config/axiosConfig';
import { SYNC_API_URL, BASE_API_URL } from 'lib/setting';
import request from './config/axiosUtils';

const syncPath = `${SYNC_API_URL}/my`;
const basePath = `${BASE_API_URL}/my`;

export function fetchUser() {
  return axs({ url: `${basePath}/information`, method: 'post' });
}

const profilePath = `${basePath}/profile`;
export function fetchProfile() {
  return axs({ url: `${profilePath}`, method: 'get' });
}

export function editProfile(payload) {
  return axs({ url: `${profilePath}`, method: 'put', data: payload });
}

// projectType=0&projectDuration=1M
export function fetchOverview(payload) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

export function fetchSummary() {
  return axs({ url: `${basePath}/summary`, method: 'get' });
}

// page=1&stage=0%1&duration=1M
export function fetchProjectGraph(payload) {
  return axs({ url: `${basePath}/projectgraph`, method: 'get', params: payload });
}

// projectType=0&projectDuration=1M
export function fetchResentProjects(payload) {
  return axs({ url: `${basePath}/project/resent`, method: 'get', params: payload });
}

// page=1&stage=0&keyword=&order=0
// page=1&stage=0%1&duration=1M
export function fetchProjects(payload) {
  return axs({ url: `${basePath}/project`, method: 'get', params: payload });
}

const qnaPath = `${basePath}/qna`;
// const testUrl = `http://15.164.27.98:35180/bridge/api/v1/my/qna`;
//page=1
export function fetchQnaList(payload) {
  return axs({ url: `${qnaPath}/list`, method: 'get', params: payload });
}

//bridgeQnaIdx=12
export function fetchQna(payload) {
  return axs({ url: `${qnaPath}`, method: 'get', params: payload });
}

export function fetchNewQna(payload) {
  return axs({ url: `${qnaPath}`, method: 'post', data: payload });
}

export function editQna(payload) {
  return axs({ url: `${qnaPath}`, method: 'put', data: payload });
}

export function deleteQna(payload) {
  return axs({ url: `${qnaPath}`, method: 'delete', data: payload });
}
