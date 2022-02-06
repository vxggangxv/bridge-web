export const ENV_MODE_DEV = process.env.NODE_ENV === 'development';
export const ENV_MODE_PROD = process.env.NODE_ENV === 'production';

const apiConfig = window.globalConfig;
// console.log('apiConfig', apiConfig);
export const SYNC_API_URL = `${process.env.REACT_APP_SYNC_API_URL}/launcher/api`;

export const BASE_API_URL =
  apiConfig?.BASE_API_URL ||
  (ENV_MODE_PROD
    ? `${process.env.REACT_APP_BASE_API_URL}/api/v2`
    : `${process.env.REACT_APP_BASE_API_LOCAL_URL}/api/v2`);
// console.log('BASE_API_URL ______ ', BASE_API_URL);

export const BASE_BIN_URL =
  apiConfig?.BASE_BIN_URL ||
  (ENV_MODE_PROD
    ? `${process.env.REACT_APP_BASE_BIN_URL}/bin/v1`
    : `${process.env.REACT_APP_BASE_BIN_LOCAL_URL}/bin/v1`);

export const BASE_SOCKET_PRIVATE_URL =
  apiConfig?.BASE_SOCKET_PRIVATE_URL ||
  (ENV_MODE_PROD
    ? `${process.env.REACT_APP_BASE_SOCKET_URL}/private`
    : `${process.env.REACT_APP_BASE_SOCKET_LOCAL_URL}/private`);

export const BASE_SOCKET_PROJECT_URL =
  apiConfig?.BASE_SOCKET_PROJECT_URL ||
  (ENV_MODE_PROD
    ? `${process.env.REACT_APP_BASE_SOCKET_URL}/project`
    : `${process.env.REACT_APP_BASE_SOCKET_LOCAL_URL}/project`);

// window.globalConfig = {
//   BASE_API_URL: 'url/api/v1',
//   BASE_BIN_URL: 'url/bin/v1',
//   BASE_SOCKET_PRIVATE_URL: 'url/notification/socket.io/private',
//   BASE_SOCKET_PROJECT_URL: 'url/notification/socket.io/project',
// };

// window.globalConfig = {
//   REACT_APP_BASE_API_URL: 'https://api.dofbridge.com/',
//   REACT_APP_BASE_API_URL: 'http://localhost:13986/',
//   REACT_APP_BASE_API_LOCAL_URL: ,
// };

// REACT_APP_SYNC_API_URL=http://localhost:13986
// REACT_APP_BASE_API_URL=https://api.dofbridge.com
// REACT_APP_BASE_API_LOCAL_URL=http://15.164.27.98:35180
// REACT_APP_BASE_BIN_URL=https://api.dofbridge.com
// REACT_APP_BASE_BIN_LOCAL_URL=http://15.164.27.98:31810
// REACT_APP_BASE_SOCKET_URL=https://api.dofbridge.com/notification/socket.io
// REACT_APP_BASE_SOCKET_LOCAL_URL=http://15.164.27.98:48052/notification/socket.io
