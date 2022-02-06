import { all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as pointApi from 'api/point';
import { UserActions } from 'store/actionCreators';

export const fetch_histories = createFetchAction('fetch_histories');
export const fetch_status = createFetchAction('fetch_status');
export const fetch_points = createFetchAction('fetch_points');
export const exchage_points = createFetchAction('exchage_points');

const initialState = {
  histories: { ...fetchInitialState, data: null },
  status: { ...fetchInitialState, data: null },
  points: { ...fetchInitialState, data: null },
  exchangePoints: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'point',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_histories, 'histories'),
    ...fetchReducerActions(fetch_status, 'status'),
    ...fetchReducerActions(fetch_points, 'points'),
    ...fetchReducerActions(exchage_points, 'exchangePoints'),
  },
});

export const actions = slice.actions;

export function* pointSaga() {
  yield all([
    takeLatest(
      actions.fetch_histories_request,
      createSaga(actions, 'fetch_histories', pointApi.fetchHistories),
    ),
    takeLatest(
      actions.fetch_status_request,
      createSaga(actions, 'fetch_status', pointApi.fetchStatus),
    ),
    takeLatest(
      actions.fetch_points_request,
      createSaga(actions, 'fetch_points', pointApi.fetchPoints, {
        success() {
          UserActions.fetch_overview_request();
        },
      }),
    ),
    takeLatest(
      actions.exchage_points_request,
      createSaga(actions, 'exchage_points', pointApi.exchangePoints),
    ),
  ]);
}

export default slice.reducer;
