import axios from 'axios';
import { ENV_MODE_DEV, ENV_MODE_PROD } from 'lib/setting';

// const domain = ENV_MODE_DEV ? 'http://localhost:3000' : 'http://localhost:3000';
const domain = 'https://jsonplaceholder.typicode.com';

export const setAuthInHeader = token => {
  axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : null;
};

class Request {
  constructor(props) {
    this.url = props.url;
    console.log(domain);
    console.log(this.url);
  }
  get(id) {
    console.log('in');
    console.log(id, 'id');
    console.log(`${domain + this.url}/${id}`, '`${domain + this.url}/${id}`');
    console.log(domain + this.url, 'domain + this.url');
    // if (id) return axios.get(`${domain + this.url}/${id}`);
    if (id) return { url: `${domain + this.url}/${id}`, method: 'get' };
    return axios.get(domain + this.url);
  }
  post(data) {
    return axios.post({
      url: `${domain + this.url}`,
      ...data,
    });
  }
  put(id, data) {
    return axios.put({
      url: `${domain + this.url}/${id}`,
      ...data,
    });
  }
  delete(id) {
    return axios.delete({
      url: `${domain + this.url}/${id}`,
    });
  }
}

class acx extends Request {
  constructor(props) {
    super({
      url: props.url,
    });
  }
  syncResultCheck() {}
}

export default acx;
