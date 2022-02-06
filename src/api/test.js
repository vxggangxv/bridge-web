import { axs } from './config/axiosConfig';
// import { SYNC_API_URL } from 'lib/setting';
import request from './config/axiosUtils';

export const test = request({ url: '/todos', config: { timeout: false } });
// const path = `${SYNC_API_URL}/todos`;
// fetchPosts
// fetchPostById
// editPostById
// deletePostById
export function fetchTests() {
  return axs(test.get());
  // return axs({ url: `${path}`, method: 'get' });
}
export function fetchTestById(id) {
  return axs(test.get(id));
  // return axs({ url: `${path}/${id}`, method: 'get' });
}
