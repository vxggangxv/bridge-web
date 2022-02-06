import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/project`;

// page=1&type=1&programGroup=&order=1&keyword=&languageGroup=KR%EN
// export function fetchProjects(payload) {
//   return axs({ url: `${basePath}`, method: 'get', params: payload });
// }

// export function fetchProject(id) {
//   return axs({ url: `${basePath}/${id}`, method: 'get' });
// }
export function fetchProjects(payload) {
  return axs({ url: `${basePath}/list`, method: 'get', params: payload });
}

export function fetchProject(payload) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

export function editProject(payload) {
  return axs({ url: `${basePath}`, method: 'post', data: payload });
}

// export function editProject(payload) {
//   return axs({ url: `${basePath}`, method: 'put', data: payload,  });
// }

// projectCode
export function deleteProject(payload) {
  return axs({ url: `${basePath}`, method: 'delete', data: payload });
}

// userCode
export function initProject(payload) {
  return axs({ url: `${basePath}/init`, method: 'post', data: payload });
}

// { "projectCode": "20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510", "rating" : 5 }
export function evaluateProject(payload) {
  return axs({ url: `${basePath}/evaluate`, method: 'post', data: payload });
}
// projectCode=20210204-cab22000-3671-494a-bb8b-87b3de2ee3fd
export function fetchProjectFiles(payload) {
  return axs({ url: `${basePath}/file`, method: 'get', params: payload });
}

// projectCode=20210324-50bbd4e0-4f32-4f58-9bf2-9e1517ae7d60&page=1
export function fetchProjectHistories(payload) {
  return axs({ url: `${basePath}/history`, method: 'get', params: payload });
}

// projectCode, eventType, params
export function createProjectHistory(payload) {
  return axs({ url: `${basePath}/history`, method: 'post', data: payload });
}

// projectCode=20210427-1f54ba3f-1bc6-4730-8365-09bfef146bf6&remakeIdx=6
export function fetchRemakeProject(payload) {
  return axs({ url: `${basePath}/remake`, method: 'get', params: payload });
}

// projectCode=20210427-1f54ba3f-1bc6-4730-8365-09bfef146bf6&
export function completeReview(payload) {
  return axs({ url: `${basePath}/review`, method: 'post', data: payload });
}

// projectCode=20210427-1f54ba3f-1bc6-4730-8365-09bfef146bf6&
export function fetchConfirmProject(payload) {
  return axs({ url: `${basePath}/confirm`, method: 'get', params: payload });
}

// projectCode=20210427-1f54ba3f-1bc6-4730-8365-09bfef146bf6&
export function confirmProject(payload) {
  return axs({ url: `${basePath}/confirm`, method: 'post', data: payload });
}
