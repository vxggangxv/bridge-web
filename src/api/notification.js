import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

// notification
const basePath = `${BASE_API_URL}/socekTest`;

export function joinProject(payload) {
  return axs({ url: `${basePath}/project/join`, method: 'post', params: payload });
}
export function sendChat(payload) {
  return axs({ url: `${basePath}/send`, method: 'post', params: payload });
}
// export function leaveChat(payload) {
//   return axs({ url: `${basePath}/leave`, method: 'post', params: payload });
// }
