import { createSlice } from '@reduxjs/toolkit';
import { all, takeLatest } from 'redux-saga/effects';
import {
  createFetchAction,
  createSaga,
  fetchInitialState,
  fetchProjectAfterSuccess,
  fetchReducerActions,
} from 'store/utils';
import * as projectApi from 'api/project';
import { createActions } from 'redux-actions';
import { ProjectActions } from 'store/actionCreators';
import store from 'store';

export const set_project = createActions('set_project');

export const fetch_projects = createFetchAction('fetch_projects');
export const fetch_project = createFetchAction('fetch_project');
// export const create_project = createFetchAction('create_project');
export const edit_project = createFetchAction('edit_project');
export const delete_project = createFetchAction('delete_project');
export const init_project = createFetchAction('init_project');
export const evaluate_project = createFetchAction('evaluate_project');
export const fetch_project_files = createFetchAction('fetch_project_files');
export const fetch_project_histories = createFetchAction('fetch_project_histories');
export const create_project_history = createFetchAction('create_project_history');
export const fetch_remake_project = createFetchAction('fetch_remake_project');
export const complete_review = createFetchAction('complete_review');
export const fetch_confirm_project = createFetchAction('fetch_confirm_project');
export const confirm_project = createFetchAction('confirm_project');

const initialState = {
  projects: { ...fetchInitialState, data: null },
  project: { ...fetchInitialState, data: null },
  // createProject: { ...fetchInitialState },
  editProject: { ...fetchInitialState },
  deleteProject: { ...fetchInitialState },
  initProject: { ...fetchInitialState, data: null },
  evaluateProject: { ...fetchInitialState },
  projectFiles: { ...fetchInitialState, data: null },
  projectHistories: { ...fetchInitialState, data: null },
  createProjectHistory: { ...fetchInitialState, data: null },
  remakeProject: { ...fetchInitialState, data: null },
  completeReview: { ...fetchInitialState },
  confirmProject: { ...fetchInitialState, data: null },
  confirmProjectResult: { ...fetchInitialState }, // state 중복으로 result로 붙혀줌
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_projects, 'projects'),
    ...fetchReducerActions(fetch_project, 'project', {
      success: (state, { payload }) => {
        console.log('fetch project action', payload);
        const { fileList, hasNewFile } = payload;
        state.projectFiles.data = {
          ...state.projectFiles.data,
          fileList,
          hasNewFile,
        };
      },
    }),
    // ...fetchReducerActions(create_project, 'createProject', { isRestful: true }),
    ...fetchReducerActions(edit_project, 'editProject'),
    ...fetchReducerActions(delete_project, 'deleteProject'),
    ...fetchReducerActions(init_project, 'initProject'),
    ...fetchReducerActions(evaluate_project, 'evaluateProject'),
    ...fetchReducerActions(fetch_project_files, 'projectFiles'),
    ...fetchReducerActions(fetch_project_histories, 'projectHistories'),
    ...fetchReducerActions(create_project_history, 'createHistory'),
    ...fetchReducerActions(fetch_remake_project, 'remakeProject'),
    ...fetchReducerActions(complete_review, 'completeReview'),
    ...fetchReducerActions(fetch_confirm_project, 'confirmProject'),
    ...fetchReducerActions(confirm_project, 'confirmProjectResult'),
  },
});

export const actions = slice.actions;

export function* projectSaga() {
  yield all([
    takeLatest(
      actions.fetch_projects_request,
      createSaga(actions, 'fetch_projects', projectApi.fetchProjects),
    ),
    takeLatest(
      actions.fetch_project_request,
      createSaga(actions, 'fetch_project', projectApi.fetchProject),
    ),
    // takeLatest(
    //   actions.create_project_request,
    //   createSaga(actions, 'create_project', projectApi.createProject),
    // ),
    takeLatest(
      actions.edit_project_request,
      createSaga(actions, 'edit_project', projectApi.editProject),
    ),
    takeLatest(
      actions.delete_project_request,
      createSaga(actions, 'delete_project', projectApi.deleteProject),
    ),
    takeLatest(
      actions.init_project_request,
      createSaga(actions, 'init_project', projectApi.initProject),
    ),
    takeLatest(
      actions.evaluate_project_request,
      createSaga(actions, 'evaluate_project', projectApi.evaluateProject),
    ),
    takeLatest(
      actions.fetch_project_files_request,
      createSaga(actions, 'fetch_project_files', projectApi.fetchProjectFiles),
    ),
    takeLatest(
      actions.fetch_project_histories_request,
      createSaga(actions, 'fetch_project_histories', projectApi.fetchProjectHistories),
    ),
    takeLatest(
      actions.create_project_history_request,
      createSaga(actions, 'create_project_history', projectApi.createProjectHistory),
    ),
    takeLatest(
      actions.fetch_remake_project_request,
      createSaga(actions, 'fetch_remake_project', projectApi.fetchRemakeProject),
    ),
    takeLatest(
      actions.complete_review_request,
      createSaga(actions, 'complete_review', projectApi.completeReview, {
        success() {
          fetchProjectAfterSuccess();
        },
      }),
    ),
    takeLatest(
      actions.fetch_confirm_project_request,
      createSaga(actions, 'fetch_confirm_project', projectApi.fetchConfirmProject),
    ),
    takeLatest(
      actions.confirm_project_request,
      createSaga(actions, 'confirm_project', projectApi.confirmProject, {
        success() {
          fetchProjectAfterSuccess();
        },
      }),
    ),
  ]);
}

export default slice.reducer;
