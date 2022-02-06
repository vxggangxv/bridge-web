import { createAction, createSlice } from '@reduxjs/toolkit';
import storage, { keys } from 'lib/storage';
import { all, takeLatest } from 'redux-saga/effects';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';
import * as userApi from 'api/user';
import { UserActions } from 'store/actionCreators';

export const set_user = createAction('set_user');

export const fetch_user = createFetchAction('fetch_user');
export const fetch_profile = createFetchAction('fetch_profile');
export const fetch_profile_oauth2 = createFetchAction('fetch_profile_oauth2');
export const edit_profile = createFetchAction('edit_profile');
export const fetch_overview = createFetchAction('fetch_overview');
export const fetch_resent_projects = createFetchAction('fetch_resent_projects');
export const fetch_projects = createFetchAction('fetch_projects');
export const fetch_qna_list = createFetchAction('fetch_qna_list');
export const fetch_qna = createFetchAction('fetch_qna');
export const fetch_new_qna = createFetchAction('fetch_new_qna');
export const edit_qna = createFetchAction('edit_qna');
export const delete_qna = createFetchAction('delete_qna');
export const fetch_summary = createFetchAction('fetch_summary');
export const fetch_project_graph = createFetchAction('fetch_project_graph');

// fetch의 경우 target이 stage key 값, fetch가 아닌경우 action에 대하여 action+target이 state key 값
const initialState = {
  // 최초 랜딩시 storage값 유무 확인
  user: storage.get(keys.user) || null,
  fetchUser: {
    ...fetchInitialState,
    data: null,
  },
  fetchProfileOauth2: {
    ...fetchInitialState,
    data: null,
  },
  fetchProfile: {
    ...fetchInitialState,
    data: null,
  },
  editProfile: {
    ...fetchInitialState,
    data: null,
  },
  overview: {
    ...fetchInitialState,
    data: null,
  },
  resentProjects: {
    ...fetchInitialState,
    data: null,
  },
  projects: {
    ...fetchInitialState,
    data: null,
  },
  qnaList: {
    ...fetchInitialState,
    data: null,
  },
  fetchQna: {
    ...fetchInitialState,
    data: null,
  },
  newQna: {
    ...fetchInitialState,
    data: null,
  },
  editQna: {
    ...fetchInitialState,
    data: null,
  },
  deleteQna: {
    ...fetchInitialState,
    data: null,
  },
  fetchSummary: {
    ...fetchInitialState,
    data: null,
  },
  fetchProjectGraph: {
    ...fetchInitialState,
    data: null,
  },
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set_user: (state, { payload }) => {
      // console.log(payload, 'payload SET_USER');
      state.user = payload;
    },
    // TEMP: Sync 임시
    // ...fetchReducerActions(fetch_user, 'fetchUser', {
    //   success(state, { payload }) {
    //     // console.log(payload, 'payload');
    //     state.user = payload?.info;
    //   },
    // }),
    ...fetchReducerActions(fetch_profile_oauth2, 'fetchProfileOauth2'),
    ...fetchReducerActions(fetch_profile, 'fetchProfile', {
      success(state, { payload }) {
        console.log('payload', payload);
        const profile = payload?.profile;
        if (profile) {
          state.user = profile;
          const { userCode, email, profileImg, autoLogin, company, country_id, type } = profile;
          // console.log('Object.entries(type)', Object.entries(type));
          // let userType = Object.entries(type).reduce((acc, [key, value]) => {
          //   if (value) return acc.concat(key);
          //   return acc;
          // }, []);
          // console.log('userType', userType);
          let userInfo = storage.get(keys.user);
          userInfo = {
            ...userInfo,
            userCode,
            profileImg,
            email,
            company,
            country_id,
            autoLogin: true,
            type,
          };
          storage.set(keys.user, userInfo);
        }
      },
    }),
    ...fetchReducerActions(edit_profile, 'editProfile'),
    ...fetchReducerActions(fetch_overview, 'overview'),
    ...fetchReducerActions(fetch_resent_projects, 'resentProjects'),
    ...fetchReducerActions(fetch_projects, 'projects'),
    ...fetchReducerActions(fetch_qna_list, 'qnaList'),
    ...fetchReducerActions(fetch_qna, 'fetchQna'),
    ...fetchReducerActions(fetch_new_qna, 'newQna'),
    ...fetchReducerActions(edit_qna, 'editQna'),
    ...fetchReducerActions(delete_qna, 'deleteQna'),
    ...fetchReducerActions(fetch_summary, 'fetchSummary'),
    ...fetchReducerActions(fetch_project_graph, 'fetchProjectGraph'),
  },
});

export const name = slice.name;
export const actions = slice.actions;

export function* userSaga() {
  yield all([
    // takeLatest(actions.fetch_request, createSaga(actions, 'fetch_user', userApi.fetchUser)),
    takeLatest(
      actions.fetch_profile_oauth2_request,
      createSaga(actions, 'fetch_profile_oauth2', userApi.fetchProfile),
    ),
    takeLatest(
      actions.fetch_profile_request,
      createSaga(actions, 'fetch_profile', userApi.fetchProfile),
    ),
    takeLatest(
      actions.edit_profile_request,
      createSaga(actions, 'edit_profile', userApi.editProfile, { isAlertSuccess: true }),
    ),
    takeLatest(
      actions.fetch_overview_request,
      createSaga(actions, 'fetch_overview', userApi.fetchOverview, {
        success() {
          UserActions.fetch_profile_request();
        },
      }),
    ),

    takeLatest(
      actions.fetch_summary_request,
      createSaga(actions, 'fetch_summary', userApi.fetchSummary),
    ),
    takeLatest(
      actions.fetch_project_graph_request,
      createSaga(actions, 'fetch_project_graph', userApi.fetchProjectGraph),
    ),

    takeLatest(
      actions.fetch_resent_projects_request,
      createSaga(actions, 'fetch_resent_projects', userApi.fetchResentProjects),
    ),
    takeLatest(
      actions.fetch_projects_request,
      createSaga(actions, 'fetch_projects', userApi.fetchProjects),
    ),
    takeLatest(
      actions.fetch_qna_list_request,
      createSaga(actions, 'fetch_qna_list', userApi.fetchQnaList),
    ),
    takeLatest(actions.fetch_qna_request, createSaga(actions, 'fetch_qna', userApi.fetchQna)),
    takeLatest(
      actions.fetch_new_qna_request,
      createSaga(actions, 'fetch_new_qna', userApi.fetchNewQna),
    ),
    takeLatest(actions.edit_qna_request, createSaga(actions, 'edit_qna', userApi.editQna)),
    takeLatest(actions.delete_qna_request, createSaga(actions, 'delete_qna', userApi.deleteQna)),
  ]);
}

export default slice.reducer;
