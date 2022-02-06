import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/designer`;

// return axs({
//   url: `${basePath}/list`,
//   params: {
//     languageGroup: payload?.languageGroup,
//     order: payload?.order,
//     page: payload?.page,
//     keyword: payload?.keyword,
//   },
//   method: 'get',
// });

// language=&order=0&page=1&keyword=
export function fetchDesigners(payload) {
  return axs({ url: `${basePath}/list`, method: 'get', params: payload });
}

// "designerUserCode":"E220AUG-0000", "status" : 1
export function toggleLikeDesigner(payload) {
  return axs({ url: `${basePath}/like`, method: 'post', data: payload });
}

// "designerUserCode":"E220AUG-0000", "projectCode": ""
export function inviteDesigner(payload) {
  return axs({ url: `${basePath}/invite`, method: 'post', data: payload });
}

// userCode=FE20AUG-0000
export function fetchProfile(payload) {
  return axs({ url: `${basePath}/profile`, method: 'get', params: payload });
}

// "languageGroup" : [6,7],  "rework" : 2
export function editProfile(payload) {
  return axs({ url: `${basePath}/profile`, method: 'put', data: payload });
}

// userCode=FE20AUG-0000
export function fetchPortfolio(payload) {
  return axs({ url: `${basePath}/portfolio`, method: 'get', params: payload });
}

// "languageGroup" : ["KR", "EN"], "rework" : 2
export function editPortfolio(payload) {
  return axs({ url: `${basePath}/portfolio`, method: 'put', data: payload });
}

// page=1&userCode=FE20AUG-0000
export function fetchProjects(payload) {
  return axs({ url: `${basePath}/project`, method: 'get', params: payload });
}

// ?projectCode=20201231-71fd76ab-0906-4d12-b84f-59e5cf6b133c
export function fetchAttendDesigners(payload) {
  return axs({ url: `${basePath}/attend/list`, method: 'get', params: payload });
}

// projectCode
export function fetchSelectDesigners(payload) {
  return axs({ url: `${basePath}/select`, method: 'get', params: payload });
}

// projectCode
export function fetchLikeDesigners(payload) {
  return axs({ url: `${basePath}/like/list`, method: 'get', params: payload });
}

// 프로젝트 지원하기 (디자이너)
// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510", "point" : 30, "deliveryDate" : 1612504283, "programTypeIdx" : 2
export function applyProjectFromDesigner(payload) {
  return axs({ url: `${basePath}/apply`, method: 'post', data: payload });
}

// 프로젝트 지원 취소
// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function cancelApplyProjectFromDesigner(payload) {
  return axs({ url: `${basePath}/apply`, method: 'delete', data: payload });
}

// 초대 수락(디자이너)
// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function acceptProjectFromDesigner(payload) {
  return axs({ url: `${basePath}/accept`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510", "selectDesignerList": [{ "userCode" : "EY21JAN-0000", "pushOrder" : 1, "pushTerm" : 50 }, {}, {}]
export function selectDesigner(payload) {
  return axs({ url: `${basePath}/select`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function workingProjectFromDesigner(payload) {
  return axs({ url: `${basePath}/working`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function rejectProjectFromDesigner(payload) {
  return axs({ url: `${basePath}/reject`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function doneProjectFromDesigner(payload) {
  return axs({ url: `${basePath}/done`, method: 'post', data: payload });
}

export function remakeProjectFromClient(payload) {
  return axs({ url: `${basePath}/remake`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function giveUpProjectFromDesigner(payload) {
  return axs({ url: `${basePath}/giveup`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function confirmProjectFromClient(payload) {
  return axs({ url: `${basePath}/confirm`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510"
export function reworkProjectFromClient(payload) {
  return axs({ url: `${basePath}/rework`, method: 'post', data: payload });
}

// "projectCode":"20210204-4f0bfc13-8637-45dd-a328-e1ee23bf1510", "designerCode" : "EY21JAN-0000"
export function changeDesigner(payload) {
  return axs({ url: `${basePath}/change`, method: 'post', data: payload });
}
