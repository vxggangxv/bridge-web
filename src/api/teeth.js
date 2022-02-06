import { axs } from './config/axiosConfig';
import { BASE_API_URL, SYNC_API_URL } from 'lib/setting';

const syncPath = `${SYNC_API_URL}/teeth`;
const basePath = `${BASE_API_URL}/teeth`;

// "language":"EN"
// export function fetchTeethIndicationFormat() {
//   return axs({ url: `${basePath}/indication/format`, method: 'get' });
// }

// "language":"EN"
export function fetchTeethIndicationFormat(payload) {
  return axs({ url: `${basePath}/indication/format`, method: 'post', data: payload });
}
