import { all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as utilApi from 'api/util';

export const set_teeth = createFetchAction('set_teeth');

export const fetch_countries = createFetchAction('fetch_countries');
export const fetch_regions = createFetchAction('fetch_regions');
export const fetch_support_countries = createFetchAction('fetch_support_countries');
export const fetch_teeth_indication_format = createFetchAction('fetch_teeth_indication_format');
export const fetch_teeth_indication_info = createFetchAction('fetch_teeth_indication_info');
export const fetch_event_types = createFetchAction('fetch_event_types');
export const fetch_payletter_pgcodes = createFetchAction('fetch_payletter_pgcodes');
export const fetch_google_translate = createFetchAction('fetch_google_translate');

const initialState = {
  teeth: [
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 22,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      teethTreatmentIdx: 852,
    },
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 23,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      teethTreatmentIdx: 852,
    },
  ],
  countries: { ...fetchInitialState, data: null },
  regions: { ...fetchInitialState, data: null },
  supportCountries: { ...fetchInitialState, data: null },
  indicationFormat: { ...fetchInitialState, data: null },
  indicationInfo: { ...fetchInitialState, data: null },
  eventTypes: { ...fetchInitialState, data: null },
  googleTranslate: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'util',
  initialState,
  reducers: {
    set_teeth: (state, { payload }) => {
      state.teeth = payload;
    },
    ...fetchReducerActions(fetch_countries, 'countries'),
    ...fetchReducerActions(fetch_regions, 'regions'),
    ...fetchReducerActions(fetch_support_countries, 'supportCountries'),
    ...fetchReducerActions(fetch_teeth_indication_format, 'indicationFormat'),
    ...fetchReducerActions(fetch_teeth_indication_info, 'indicationInfo'),
    ...fetchReducerActions(fetch_event_types, 'eventTypes'),
    ...fetchReducerActions(fetch_payletter_pgcodes, 'payletterPgcodes'),
    ...fetchReducerActions(fetch_google_translate, 'googleTranslate'),
  },
});

export const actions = slice.actions;

export function* utilSaga() {
  yield all([
    takeLatest(
      actions.fetch_countries_request,
      createSaga(actions, 'fetch_countries', utilApi.fetchCountries),
    ),
    takeLatest(
      actions.fetch_regions_request,
      createSaga(actions, 'fetch_regions', utilApi.fetchRegions),
    ),
    takeLatest(
      actions.fetch_support_countries_request,
      createSaga(actions, 'fetch_support_countries', utilApi.fetchSupportCountry),
    ),
    takeLatest(
      actions.fetch_teeth_indication_format_request,
      createSaga(actions, 'fetch_teeth_indication_format', utilApi.fetchTeethIndicationFormat),
    ),
    takeLatest(
      actions.fetch_teeth_indication_info_request,
      createSaga(actions, 'fetch_teeth_indication_info', utilApi.fetchTeethIndicationInfo),
    ),
    takeLatest(
      actions.fetch_event_types_request,
      createSaga(actions, 'fetch_event_types', utilApi.fetchEventTypes),
    ),
    takeLatest(
      actions.fetch_payletter_pgcodes_request,
      createSaga(actions, 'fetch_payletter_pgcodes', utilApi.fetchPayletterPgcodes),
    ),
    takeLatest(
      actions.fetch_google_translate_request,
      createSaga(actions, 'fetch_google_translate', utilApi.fetchGoogleTranslate),
    ),
  ]);
}

export default slice.reducer;
