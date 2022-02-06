import { all, takeLatest } from 'redux-saga/effects';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';

const initialState = {
  // router에 error 연결(e.g serverError : 500)
  responseStatus: null,
  // responseStatus: 401,
  // TODO: 차후 error toasty또는 popup과 연결 예정
  // responseError: {
  //   isShow: false,
  //   message: null,
  //   data: null,
  // },
  language: 'en',
  // language: 'ko',
  test: 'test',
  popup: {},
};

const slice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    response_status: (state, { payload }) => {
      // DEBUG: 필요
      state.responseStatus = payload;
    },
    // response_error: (state, { payload }) => {
    //   // DEBUG: 필요
    //   state.responseError.message = payload.message;
    //   state.responseError.data = payload;
    // },
    change_language: (state, { payload }) => {
      state.language = payload;
    },
    base_popup: (state, { payload }) => {
      if (payload.type === 'dim') {
        state.popup.isOpen = false;
      } else {
        state.popup = {
          ...payload,
        };
      }
    },
  },
});

export const actions = slice.actions;

// saga
export function* baseSaga() {
  yield all([
    // takeLatest(actions.sync_init_request, createSaga(actions, 'sync_init', etcApi.fetchSyncInit)),
  ]);
}

export default slice.reducer;
