// import axios from 'axios';
import { SYNC_API_URL } from 'lib/setting';
// import { ENV_MODE_DEV, ENV_MODE_PROD } from 'lib/setting';
// import { useHistory } from 'react-router-dom';
// import { render } from '@testing-library/react';

// const SYNC_API_URL = ENV_MODE_DEV ? 'http://localhost:3000' : 'http://localhost:3000';
// const SYNC_API_URL = 'https://jsonplaceholder.typicode.com';

// NOTE: url: api url, config: 기타 설정값 (e.g. timeout: false)
export function request({ url = '', config = {} }) {
  return {
    get(id) {
      if (id) return { url: `${SYNC_API_URL + url}/${id}`, method: 'get', ...config };
      return { url: `${SYNC_API_URL + url}`, method: 'get', ...config };
    },
    post(data) {
      return { url: `${SYNC_API_URL + url}`, method: 'post', data, ...config };
    },
    edit(id, data) {
      // if (id) return { url: `${SYNC_API_URL + url}/${id}`, method: 'put', data, ...config };
      return { url: `${SYNC_API_URL + url}`, method: 'put', data, ...config };
    },
    delete(id) {
      return { url: `${SYNC_API_URL + url}/${id}`, method: 'delete', ...config };
    },
  };
}

export default request;
