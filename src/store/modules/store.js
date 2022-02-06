import { all, takeLatest } from 'redux-saga/effects';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as storeApi from 'api/store';

export const fetch_store_products = createFetchAction('fetch_store_products');
export const fetch_store_orders = createFetchAction('fetch_store_orders');
export const fetch_payment_detail = createFetchAction('fetch_payment_detail');
export const make_payment_receipt_info = createFetchAction('make_payment_receipt_info');
export const make_payment_payletter = createFetchAction('make_payment_payletter');
export const make_payment_cash_receipt = createFetchAction('make_payment_cash_receipt');

const initialState = {
  storeProducts: { ...fetchInitialState, data: null },
  storeOrders: { ...fetchInitialState, data: null },
  paymentDetail: { ...fetchInitialState, data: null },
  makePayment: { ...fetchInitialState, data: null },
  receiptInfo: { ...fetchInitialState, data: null },
  cashReceipt: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_store_products, 'storeProducts'),
    ...fetchReducerActions(fetch_store_orders, 'storeOrders'),
    ...fetchReducerActions(fetch_payment_detail, 'paymentDetail'),
    ...fetchReducerActions(make_payment_payletter, 'makePayment'),
    ...fetchReducerActions(make_payment_receipt_info, 'receiptInfo'),
    ...fetchReducerActions(make_payment_cash_receipt, 'cashReceipt'),
  },
});

export const actions = slice.actions;

export function* storeSaga() {
  yield all([
    takeLatest(
      actions.fetch_store_products_request,
      createSaga(actions, 'fetch_store_products', storeApi.fetchStoreProducts),
    ),
    takeLatest(
      actions.fetch_store_orders_request,
      createSaga(actions, 'fetch_store_orders', storeApi.fetchStoreOrders),
    ),
    takeLatest(
      actions.fetch_payment_detail_request,
      createSaga(actions, 'fetch_payment_detail', storeApi.fetchPaymentDetail),
    ),
    takeLatest(
      actions.make_payment_receipt_info_request,
      createSaga(actions, 'make_payment_receipt_info', storeApi.makePaymentReceiptInfo),
    ),
    takeLatest(
      actions.make_payment_cash_receipt_request,
      createSaga(actions, 'make_payment_cash_receipt', storeApi.makePaymentCashReceipt),
    ),
    takeLatest(
      actions.make_payment_payletter_request,
      createSaga(actions, 'make_payment_payletter', storeApi.makePaymentPayletter),
    ),
  ]);
}

export default slice.reducer;
