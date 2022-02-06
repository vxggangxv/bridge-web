import { axs } from './config/axiosConfig';
import { BASE_API_URL, SYNC_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/util`;

export function fetchCountries() {
  return axs({ url: `${basePath}/country/list`, method: 'get' });
}

// country=
export function fetchRegions(payload) {
  return axs({ url: `${basePath}/country/region/list`, method: 'get', params: payload });
}

export function fetchSupportCountry() {
  return axs({ url: `${basePath}/support/country`, method: 'get' });
}

// "language":"EN"
export function fetchTeethIndicationFormat(payload) {
  return axs({
    url: `${basePath}/indication/format`,
    method: 'get',
    params: { version: 2, ...payload },
  });
}

export function fetchTeethIndicationInfo(payload) {
  return axs({
    url: `${basePath}/indication/info`,
    method: 'get',
    params: { version: 2, ...payload },
  });
}

export function fetchEventTypes(payload) {
  return axs({ url: `${basePath}/event/type`, method: 'get', params: payload });
}

export function fetchPayletterPgcodes() {
  return axs({ url: `${basePath}/payletter/pgcode`, method: 'get' });
}

export function fetchGoogleTranslate(payload) {
  return axs({ url: `${basePath}/translate`, method: 'get', params: payload });
}
