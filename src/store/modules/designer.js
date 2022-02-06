import { createSlice } from '@reduxjs/toolkit';
import { all, takeLatest } from 'redux-saga/effects';
import {
  createFetchAction,
  createSaga,
  fetchInitialState,
  fetchProjectAfterSuccess,
  fetchReducerActions,
} from 'store/utils';
import * as designerApi from 'api/designer';
import { ProjectActions } from 'store/actionCreators';
import store from 'store';

export const fetch_designers = createFetchAction('fetch_designers');
export const toggle_like_designer = createFetchAction('toggle_like_designer');
export const invite_designer = createFetchAction('invite_designer');
export const fetch_profile = createFetchAction('fetch_profile');
export const edit_profile = createFetchAction('edit_profile');
export const fetch_portfolio = createFetchAction('fetch_portfolio');
export const edit_portfolio = createFetchAction('edit_portfolio');
export const fetch_projects = createFetchAction('fetch_projects');
export const fetch_attend_designers = createFetchAction('fetch_attend_designers');
export const fetch_select_designers = createFetchAction('fetch_select_designers');
export const fetch_like_designers = createFetchAction('fetch_like_designers');
export const apply_project = createFetchAction('apply_project');
export const cancel_apply_project = createFetchAction('cancel_apply_project');
export const accept_project = createFetchAction('accept_project');
export const select_designer = createFetchAction('select_designer');
export const working_project = createFetchAction('working_project');
export const reject_project = createFetchAction('reject_project');
export const done_project = createFetchAction('done_project');
export const remake_project = createFetchAction('remake_project');
export const give_up_project = createFetchAction('give_up_project');
export const confirm_project = createFetchAction('confirm_project');
export const rework_project = createFetchAction('rework_project');
export const change_designer = createFetchAction('change_designer');

// fetch의 경우 target이 stage key 값, fetch가 아닌경우 action에 대하여 action+target이 state key 값
const initialState = {
  designers: { ...fetchInitialState, data: null },
  toggleLikeDesigner: { ...fetchInitialState },
  inviteDesigner: { ...fetchInitialState },
  profile: { ...fetchInitialState, data: null },
  editProfile: { ...fetchInitialState },
  portfolio: { ...fetchInitialState, data: null },
  editPortfolio: { ...fetchInitialState, data: null },
  projects: { ...fetchInitialState, data: null },
  attendDesigners: { ...fetchInitialState, data: null },
  selectDesigners: { ...fetchInitialState, data: null },
  likeDesigners: { ...fetchInitialState, data: null },
  applyProject: { ...fetchInitialState },
  cancelApplyProject: { ...fetchInitialState },
  acceptProject: { ...fetchInitialState },
  selectDesigner: { ...fetchInitialState },
  workingProject: { ...fetchInitialState },
  rejectProject: { ...fetchInitialState },
  doneProject: { ...fetchInitialState },
  remakeProject: { ...fetchInitialState },
  giveUpProject: { ...fetchInitialState },
  confirmProject: { ...fetchInitialState },
  reworkProject: { ...fetchInitialState },
  changeDesigner: { ...fetchInitialState },
};

const slice = createSlice({
  name: 'designer',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_designers, 'designers'),
    ...fetchReducerActions(toggle_like_designer, 'toggleLikeDesigner'),
    ...fetchReducerActions(invite_designer, 'inviteDesigner'),
    ...fetchReducerActions(fetch_profile, 'profile'),
    ...fetchReducerActions(edit_profile, 'editProfile'),
    ...fetchReducerActions(fetch_portfolio, 'portfolio', {
      pending: state => {
        state.portfolio.data = null;
      },
    }),
    ...fetchReducerActions(edit_portfolio, 'editPortfolio'),
    ...fetchReducerActions(fetch_projects, 'projects'),
    ...fetchReducerActions(fetch_attend_designers, 'attendDesigners'),
    ...fetchReducerActions(fetch_select_designers, 'selectDesigners'),
    fetch_attend_designers_clear: state => {
      state.likeDesigners.data = null;
    },
    ...fetchReducerActions(fetch_like_designers, 'likeDesigners'),
    ...fetchReducerActions(apply_project, 'applyProject'),
    ...fetchReducerActions(cancel_apply_project, 'cancelApplyProject'),
    ...fetchReducerActions(accept_project, 'acceptProject'),
    ...fetchReducerActions(select_designer, 'selectDesigner'),
    ...fetchReducerActions(working_project, 'workingProject'),
    ...fetchReducerActions(reject_project, 'rejectProject'),
    ...fetchReducerActions(done_project, 'doneProject'),
    ...fetchReducerActions(remake_project, 'remakeProject'),
    ...fetchReducerActions(give_up_project, 'giveUpProject'),
    ...fetchReducerActions(confirm_project, 'confirmProject'),
    ...fetchReducerActions(rework_project, 'reworkProject'),
    ...fetchReducerActions(change_designer, 'changeDesigner'),
  },
});

export const actions = slice.actions;

export function* designerSaga() {
  yield all([
    takeLatest(
      actions.fetch_designers_request,
      createSaga(actions, 'fetch_designers', designerApi.fetchDesigners),
    ),
    takeLatest(
      actions.toggle_like_designer_request,
      createSaga(actions, 'toggle_like_designer', designerApi.toggleLikeDesigner),
    ),
    takeLatest(
      actions.invite_designer_request,
      createSaga(actions, 'invite_designer', designerApi.inviteDesigner, { isAlertSuccess: true }),
    ),
    takeLatest(
      actions.fetch_profile_request,
      createSaga(actions, 'fetch_profile', designerApi.fetchProfile),
    ),
    takeLatest(
      actions.edit_profile_request,
      createSaga(actions, 'edit_profile', designerApi.editProfile),
    ),
    takeLatest(
      actions.fetch_portfolio_request,
      createSaga(actions, 'fetch_portfolio', designerApi.fetchPortfolio),
    ),
    takeLatest(
      actions.edit_portfolio_request,
      createSaga(actions, 'edit_portfolio', designerApi.editPortfolio),
    ),
    takeLatest(
      actions.fetch_projects_request,
      createSaga(actions, 'fetch_projects', designerApi.fetchProjects),
    ),
    takeLatest(
      actions.fetch_attend_designers_request,
      createSaga(actions, 'fetch_attend_designers', designerApi.fetchAttendDesigners),
    ),
    takeLatest(
      actions.fetch_select_designers_request,
      createSaga(actions, 'fetch_select_designers', designerApi.fetchSelectDesigners),
    ),
    takeLatest(
      actions.fetch_like_designers_request,
      createSaga(actions, 'fetch_like_designers', designerApi.fetchLikeDesigners),
    ),
    takeLatest(
      actions.apply_project_request,
      createSaga(actions, 'apply_project', designerApi.applyProjectFromDesigner, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.cancel_apply_project_request,
      createSaga(actions, 'cancel_apply_project', designerApi.cancelApplyProjectFromDesigner, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.accept_project_request,
      createSaga(actions, 'accept_project', designerApi.acceptProjectFromDesigner, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.select_designer_request,
      createSaga(actions, 'select_designer', designerApi.selectDesigner, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.working_project_request,
      createSaga(actions, 'working_project', designerApi.workingProjectFromDesigner, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.reject_project_request,
      createSaga(actions, 'reject_project', designerApi.rejectProjectFromDesigner, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.done_project_request,
      createSaga(actions, 'done_project', designerApi.doneProjectFromDesigner, {
        isAlertSuccess: true,
        success() {
          fetchProjectAfterSuccess();
        },
      }),
    ),
    takeLatest(
      actions.remake_project_request,
      createSaga(actions, 'remake_project', designerApi.remakeProjectFromClient, {
        isAlertSuccess: true,
        success() {
          fetchProjectAfterSuccess();
        },
      }),
    ),
    takeLatest(
      actions.give_up_project_request,
      createSaga(actions, 'give_up_project', designerApi.giveUpProjectFromDesigner, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.confirm_project_request,
      createSaga(actions, 'confirm_project', designerApi.confirmProjectFromClient, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.rework_project_request,
      createSaga(actions, 'rework_project', designerApi.reworkProjectFromClient, {
        isAlertSuccess: true,
      }),
    ),
    takeLatest(
      actions.change_designer_request,
      createSaga(actions, 'change_designer', designerApi.changeDesigner, { isAlertSuccess: true }),
    ),
  ]);
}

export default slice.reducer;
