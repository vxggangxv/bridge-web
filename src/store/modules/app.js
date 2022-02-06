import { takeEvery, put, all, delay } from 'redux-saga/effects';
import { createAction, createSlice } from '@reduxjs/toolkit';

export const exit_landing = createAction('exit_landing');
export const set_api_calling_status = createAction('set_api_calling_status');
export const clear_api_calling_status = createAction('clear_api_calling_status');

export const show_toast = createAction('show_toast');
export const add_toast = createAction('add_toast');
export const remove_toast = createAction('remove_toast');

export const add_popup = createAction('add_popup');
export const remove_popup = createAction('remove_popup');
export const remove_popup_config = createAction('remove_popup_config');
export const remove_popup_delay = createAction('remove_popup_delay');

// axios onUploadProgress
export const set_upload_file_progress = createAction('set_upload_file_progress');
export const upload_file_progress_success = createAction('upload_file_progress_success');
export const upload_file_progress_failure = createAction('upload_file_progress_failure');

// axios downloadFile
// export const download_file_success = createAction('download_file_success');
// export const download_file_failure = createAction('download_file_failure');

// popups으로 대체
// export const show_dialog = createAction('show_dialog');
// export const confirm_dialog = createAction('confirm_dialog');
// export const cancel_dialog = createAction('cancel_dialog');

const initialState = {
  // 초기 랜딩중일 경우 true, false일 경우 화면 랜딩 완료
  landing: true,
  // api통신 pending, success, failure에 따른 자동 loading show
  apiCalling: false,
  toasts: [],
  // dialog: undefined,
  popups: [],
  // { id, file, progress, status } - status: 0, 1, 3
  // status - 0: 초기값, 1: 성공, 2: 요청 후 실패
  fileProgress: [
    // { id: 1, file: { name: 'sample1' }, progress: 50, status: 0 },
    // { id: 2, file: { name: 'sample2' }, progress: 50, status: 0 },
    // { id: 3, file: { name: 'sample3' }, progress: 50, status: 0 },
  ],
};

// Popups id
let _pid = 0;

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    exit_landing: state => {
      state.landing = false;
    },
    set_api_calling_status: state => {
      state.apiCalling = true;
    },
    clear_api_calling_status: state => {
      state.apiCalling = false;
    },
    show_toast: () => {},
    add_toast: (state, { payload }) => {
      state.toasts = state.toasts.concat(payload);
    },
    remove_toast: (state, { payload }) => {
      // console.log(payload, 'payload');
      const toastId = payload.id;
      // console.log(toastId, 'toastId');
      state.toasts = state.toasts.filter(item => item.id !== toastId);
    },
    remove_toasts: (state, { payload }) => {
      state.toasts = [];
    },
    add_popup: (state, { payload }) => {
      const nextId = _pid + 1;
      _pid = nextId;
      const config = payload;
      state.popups = state.popups.concat({ id: nextId, config });
    },
    set_popup: (state, { payload }) => {
      const { id, isOpen } = payload;
      state.popups.find(item => item.id === id).config.isOpen = isOpen;
    },
    remove_popup_delay: () => {},
    remove_popup: (state, { payload }) => {
      state.popups = state.popups.filter(item => item.id !== payload.id);
    },
    remove_popups: (state, { payload }) => {
      state.popups = [];
    },
    add_upload_file_progress: (state, { payload }) => {
      // console.log(payload, 'add_upload_file_progress payload');
      state.fileProgress = state.fileProgress.concat(payload);
    },
    set_upload_file_progress: (state, { payload }) => {
      // console.log(payload, 'set_upload_file_progress payload');
      const currentFile = state.fileProgress.find(item => item.id === payload.id);
      if (currentFile) currentFile.progress = payload.progress;
    },
    remove_upload_file_progress: (state, { payload }) => {
      if (payload?.type === 'all') {
        state.fileProgress = [];
      } else {
        state.fileProgress = state.fileProgress.filter(item => item.id !== payload.id);
      }
    },
    upload_file_progress_success: (state, { payload }) => {
      // console.log(payload, 'upload_file_progress_success payload');
      // console.log(
      //   state.fileProgress.find(item => item.id === payload.id),
      //   'state.fileProgress.find(item => item.id === payload.id)',
      // );
      const currentFile = state.fileProgress.find(item => item.id === payload.id);
      if (currentFile) currentFile.status = 1;
    },
    upload_file_progress_failure: (state, { payload }) => {
      console.log(payload, 'failure_upload_file_progress payload');
      const currentFile = state.fileProgress.find(item => item.id === payload.id);
      if (currentFile) {
        currentFile.status = 2;
        currentFile.progress = 0;
      }
    },
    // download_file_success: () => {},
    // download_file_failure: () => {},
  },
});

export const actions = slice.actions;

function* handleRequest(action) {
  // console.log('handleRequest');
  // yield put(actions.set_api_calling_status());
}

function* handleSuccess(action) {
  // yield put(actions.clear_api_calling_status());
  // yield put(actions.show_toast('Request Completed.'));
}

function* handleFailure({ payload }) {
  // yield put(actions.clear_api_calling_status());
  const isShow = payload?.isShow;
  const status = payload?.status;
  let message = payload?.message;
  // message = message ? message : 'Request Failed.';
  message = message ? message : 'Fail.';
  if (isShow) yield put(actions.show_toast({ status, type: 'error', message }));
  // message: '데이터를 불러오기에 실패했습니다.'
}

// 토스트 아이디로 사용한다
let _tid = 0;

// { message: '', type: '', eventType: 'default', isAutoRemove: true }
/**
 * @param {!string} messge
 * @param {!string} type
 * @param {!string} [eventType = 'default']
 * @param {!boolan} [isAutoRemove = true]
 * @param {?string} okText - eventType byProject 에서 사용, project용 알림에서만 적용
 * @param {?number} delay
 */
function* handleShowToast(action) {
  // console.log('handleShowToast');
  const nextId = _tid + 1;
  _tid = nextId;

  // 기본 값 정의
  let config = {
    eventType: 'default',
    isAutoRemove: true,
    delay: 2000,
    okText: 'Ok',
  };
  config = {
    ...config,
    ...action.payload,
  };

  // TEMP:
  console.log('handleShowToast config', config);
  const id = nextId;

  // 토스트를 상태에 추가한다
  yield put(actions.add_toast({ id, config }));

  // 초 대기한다, 250 - animation transition seconds
  yield delay(config.delay + 250);

  // 토스트를 상태에서 제거한다
  if (config.isAutoRemove) yield put(actions.remove_toast({ id }));
}

// onExited 사용을 위한 delay 및, isOpen 연결 설정
// id, isOpen: false 필수
function* handleRemovePopupDelay({ payload }) {
  const { id, isOpen } = payload;

  yield put(actions.set_popup({ id, isOpen }));
  // yield delay(225);
  yield delay(250);
  yield put(actions.remove_popup({ id }));
}

export function* appSaga() {
  yield all([
    takeEvery(action => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_request');
      }
    }, handleRequest),
    takeEvery(action => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_success');
      }
    }, handleSuccess),
    takeEvery(action => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_failure');
      }
    }, handleFailure),
    takeEvery(actions.show_toast.type, handleShowToast),
    takeEvery(actions.remove_popup_delay.type, handleRemovePopupDelay),
  ]);
}

export default slice.reducer;
