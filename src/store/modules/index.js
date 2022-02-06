import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import test, { testSaga } from './test';
import app, { appSaga } from './app';
import base, { baseSaga } from './base';
import auth, { authSaga } from './auth';
import user, { userSaga } from './user';
import util, { utilSaga } from './util';
import designer, { designerSaga } from './designer';
import project, { projectSaga } from './project';
import bin, { binSaga } from './bin';
// import teeth, { teethSaga } from './teeth';
import event, { eventSaga } from './event';
import point, { pointSaga } from './point';
import store, { storeSaga } from './store';

const rootReducer = combineReducers({
  test,
  app,
  base,
  auth,
  user,
  util,
  designer,
  project,
  bin,
  // teeth,
  event,
  point,
  store,
});

export function* rootSaga() {
  yield all([
    fork(testSaga),
    fork(appSaga),
    fork(baseSaga),
    fork(authSaga),
    fork(userSaga),
    fork(utilSaga),
    fork(designerSaga),
    fork(projectSaga),
    fork(binSaga),
    // fork(teethSaga),
    fork(eventSaga),
    fork(pointSaga),
    fork(storeSaga),
  ]);
}

export default rootReducer;
