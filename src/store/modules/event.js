import { all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as eventApi from 'api/event';

export const fetch_events = createFetchAction('fetch_events');
export const read_events = createFetchAction('read_events');
export const delete_events = createFetchAction('delete_events');
export const fetch_new_events = createFetchAction('fetch_new_events');

const initialState = {
  events: { ...fetchInitialState, data: null },
  readEvents: { ...fetchInitialState },
  deleteEvents: { ...fetchInitialState },
  newEvents: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    ...new fetchReducerActions(fetch_events, 'events'),
    ...new fetchReducerActions(read_events, 'readEvents'),
    ...new fetchReducerActions(delete_events, 'deleteEvents'),
    ...new fetchReducerActions(fetch_new_events, 'newEvents'),
  },
});

export const actions = slice.actions;

export function* eventSaga() {
  yield all([
    takeLatest(
      actions.fetch_events_request,
      createSaga(actions, 'fetch_events', eventApi.fetchEvents),
    ),
    takeLatest(
      actions.read_events_request,
      createSaga(actions, 'read_events', eventApi.readEvents),
    ),
    takeLatest(
      actions.delete_events_request,
      createSaga(actions, 'delete_events', eventApi.deleteEvents),
    ),
    takeLatest(
      actions.fetch_new_events_request,
      createSaga(actions, 'fetch_new_events', eventApi.fetchNewEvents),
    ),
  ]);
}

export default slice.reducer;
