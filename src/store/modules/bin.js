import { createSlice } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';
import {
  createFetchAction,
  createSaga,
  fetchInitialState,
  fetchReducerActions,
  uploadFileProgress,
} from 'store/utils';
import { BASE_BIN_URL } from 'lib/setting';
import { BinActions, ProjectActions } from 'store/actionCreators';
import * as binApi from 'api/bin';
import uuid from 'react-uuid';
import moment from 'moment';
import store from 'store';
import { projectEventType } from 'lib/mapper';

export const edit_portfolio_file = createFetchAction('edit_portfolio_file');
export const upload_project_file = createFetchAction('upload_project_file');
export const delete_project_file = createFetchAction('delete_project_file');

const initialState = {
  editPortfolioFile: { ...fetchInitialState },
  uploadProjectFile: { ...fetchInitialState },
  deleteProjectFile: { ...fetchInitialState },
};

const slice = createSlice({
  name: 'bin',
  initialState,
  reducers: {
    ...fetchReducerActions(edit_portfolio_file, 'editPortfolioFile'),
    ...fetchReducerActions(upload_project_file, 'uploadProjectFile'),
    ...fetchReducerActions(delete_project_file, 'deleteProjectFile'),
  },
});

export const actions = slice.actions;

// createSaga
function* handleUploadProjectFile({ payload }) {
  const { company, projectCode, project: files } = payload;
  const fileGroupId = moment().unix() + uuid();
  console.log('handleUploadProjectFile payload----------------------------------', payload);
  // console.log('fileGroupId', fileGroupId);

  if (!files?.length) return;
  try {
    let filesContent = '';

    files.forEach(async item => {
      const formPayload = new FormData();
      formPayload.append('projectCode', projectCode);
      formPayload.append('project', item.file);
      formPayload.append('fileGroupId', fileGroupId);

      uploadFileProgress({
        file: item.file,
        url: `${BASE_BIN_URL}/project`,
        formPayload,
        config: {
          headers: {
            'x-access-token': store.getState().auth.accessToken,
            projectCode,
            cloudDataIdx: item.cloudDataIdx,
          },
        },
        success() {
          BinActions.upload_project_file_success();
        },
        finish() {
          ProjectActions.fetch_project_files_request({ projectCode });
        },
      });

      if (item?.file?.name) {
        filesContent = filesContent + `, ${item?.file?.name}`;
      }
    });

    const createHistoryData = {
      projectCode,
      eventType: projectEventType.fileUpload,
      params: {
        content: `${company}${filesContent}`,
      },
    };
    ProjectActions.create_project_history_request(createHistoryData);
  } catch (error) {
    console.log(error);
  }
}

function* handleEditPortfolioFile({ payload }) {
  const { deletePortfolio, portfolio: files, userCode } = payload;
  console.log('handleEditPortfolioFile payload', payload);

  if (files.length) {
    files.forEach(async file => {
      const formPayload = new FormData();
      formPayload.append('deletePortfolio', deletePortfolio);
      formPayload.append('portfolio', file);

      uploadFileProgress({
        file,
        url: `${BASE_BIN_URL}/portfolio`,
        formPayload,
        config: {
          headers: {
            'x-access-token': store.getState().auth.accessToken,
          },
        },
        success() {
          BinActions.upload_project_file_success();
        },
        finish() {
          ProjectActions.fetch_portfolio_request({ userCode });
        },
      });
    });
  }
}

export function* binSaga() {
  yield all([
    takeLatest(
      actions.edit_portfolio_file_request,
      // createSaga(actions, 'edit_portfolio_file', handleEditPortfolioFile),
      createSaga(actions, 'edit_portfolio_file', binApi.editPortfolioFile),
    ),
    takeLatest(actions.upload_project_file_request, handleUploadProjectFile),
    takeLatest(
      actions.delete_project_file_request,
      createSaga(actions, 'delete_project_file', binApi.deleteProjectFile),
    ),
  ]);
}

export default slice.reducer;
