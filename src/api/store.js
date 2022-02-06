import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/store`;

export function fetchStoreProducts() {
  return axs({ url: `${basePath}/products`, method: 'get' });
}

export function fetchStoreOrders(payload) {
  return axs({ url: `${basePath}/order`, method: 'get', params: payload });
}

export function fetchPaymentDetail(payload) {
  return axs({ url: `${basePath}/payletter/payment`, method: 'get', params: payload });
}

export function makePaymentPayletter(payload) {
  return axs({ url: `${basePath}/payletter/payment`, method: 'post', data: payload });
}

export function makePaymentReceiptInfo(payload) {
  return axs({ url: `${basePath}/payletter/receipt/info`, method: 'get', params: payload });
}

export function makePaymentCashReceipt(payload) {
  return axs({ url: `${basePath}/payletter/cashreceipt`, method: 'post', params: payload });
}
