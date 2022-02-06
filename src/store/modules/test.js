import { all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as testApi from 'api/test';

export const fetch_tests = createFetchAction('fetch_tests');
export const fetch_test = createFetchAction('fetch_test');

const initialState = {
  tests: {
    ...fetchInitialState,
    data: null,
  },
  test: {
    ...fetchInitialState,
    data: null,
  },
  obj: {
    list: {
      item: {
        ...fetchInitialState,
        data: null,
      },
    },
  },
};

const slice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    ...new fetchReducerActions(fetch_tests, 'tests'),
    ...new fetchReducerActions(fetch_test, 'test'),
  },
});

export const actions = slice.actions;

// saga
// function* handleFetchTests() {
//   try {
//     yield put(actions.fetch_tests_sucess());
//   } catch (err) {
//     yield put(actions.fetch_tests_failure());
//   } finally {
//   }
// }

// function* handleFetchTest() {
//   try {
//     yield put(actions.fetch_test_sucess());
//   } catch (err) {
//     yield put(actions.fetch_test_failure());
//   }
// }

export function* testSaga() {
  yield all([
    takeLatest(actions.fetch_tests_request, createSaga(actions, 'fetch_tests', testApi.fetchTests)),
    takeLatest(
      actions.fetch_test_request,
      createSaga(actions, 'fetch_test', testApi.fetchTestById),
    ),
  ]);
}

export default slice.reducer;
