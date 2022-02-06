import { all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as teethApi from 'api/teeth';

export const fetch_teeth_indication_format = createFetchAction('fetch_teeth_indication_format');

const initialState = {
  indicationFormat: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'teeth',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_teeth_indication_format, 'indicationFormat'),
  },
});

export const actions = slice.actions;

export function* teethSaga() {
  yield all([
    takeLatest(
      actions.fetch_teeth_indication_format_request,
      createSaga(actions, 'fetch_teeth_indication_format', teethApi.fetchTeethIndicationFormat),
    ),
  ]);
}

export default slice.reducer;
