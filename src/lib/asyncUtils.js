import produce from 'immer';
import _ from 'lodash';
import { createActinos } from 'redux-actions';
import { dispatch } from 'store/actionCreators';
import { call } from 'redux-saga/effects';
import { ENV_MODE_DEV } from 'lib/setting';

/**
 * makeAsyncActions: 액션 타입 생성
 * @param {*} actionName string
 */
export function makeAsyncActions(actionName) {
  const prefix = actionName;
  const prefixObj = {
    INDEX: 'INDEX',
    INIT: `INIT`,
    REQUEST: `REQUEST`,
    PENDING: `PENDING`,
    SUCCESS: `SUCCESS`,
    FAILURE: `FAILURE`,
    CANCEL: `CANCEL`,
  };
  for (const item in prefixObj) {
    prefixObj[item] = prefix + `_${item}`;
  }
  // NOTE: 초기화 SAGA.init() 생성 ActionsFunction.init 에 연결됨
  const init = payload => makeActionCreator(prefixObj.INIT, payload);
  prefixObj.init = init;
  return prefixObj;
}

/**
 * makeAsyncCreateActions: 액션 타입과 dispatch 연결
 * @param {*} actions Object
 */
export function makeAsyncCreateActions(actions) {
  // NOTE: createPromiseSaga type에 .index와 연결 takeEvery에 적용
  const ActionsFunction = payload => makeActionCreator(actions.INDEX, payload);

  return api => {
    if (typeof api !== 'function') new Error('api must be Function');

    const request = data => api(data);
    const init = payload => {
      // console.log(`${actions.INIT}`);
      makeActionCreator(actions.INIT, payload);
    };
    const pending = payload => {
      // console.log(`${actions.PENDING}`);
      makeActionCreator(actions.PENDING, payload);
    };
    const success = payload => {
      // console.log(`${actions.SUCCESS}`);
      makeActionCreator(actions.SUCCESS, payload);
    };
    const failure = payload => {
      // console.log(`${actions.FAILURE}`);
      makeActionCreator(actions.FAILURE, payload);
    };
    ActionsFunction.index = actions.INDEX;
    ActionsFunction.request = request;
    ActionsFunction.init = init;
    ActionsFunction.pending = pending;
    ActionsFunction.success = success;
    ActionsFunction.failure = failure;
    return ActionsFunction;
  };
}

/**
 * makeActionCreator: dispatch 연결
 * @param {*} actionType
 * @param {*} payload
 */
export function makeActionCreator(actionType, payload) {
  return dispatch({ type: actionType, payload: payload });
}

/**
 * createPromiseSaga: saga의 api 연결
 * @param {*} type
 * @param {*} promiseCreator
 */
export const createPromiseSaga = ({
  type,
  tag,
  pending = () => {},
  success = () => {},
  failure = () => {},
}) => {
  return function* saga(action) {
    let currentState = null;
    let payload = null;

    // console.log(`
    // ==========================
    // >>> *${tag}
    // ==========================
    // `);

    if (!type) {
      console.warn(`createPromiseSaga Need type`);
      return null;
    }

    try {
      payload = action.payload;

      type.pending();
      pending(action);
      currentState = 'pending';
      const { data, error, cancel } = yield call(type.request, payload);
      const viewPayload = error ? error.payload : data.payload;
      data.payload = viewPayload || {};

      if (ENV_MODE_DEV) {
        console.group(`-- ${tag} Redux saga`);
        console.log(` %cRequest Data :\n`, 'color:red;padding:5px;font-weight:bold', viewPayload);
        console.log(` %cResponse Data :\n`, 'color:red;padding:5px;font-weight:bold', data);
        console.groupEnd();
      }

      // NOTE: 차후 추가개발
      if (cancel) {
        type.pending({ type: 'cancel' });
        return;
      }

      // if (data && !error) {
      //   if (data.result === 1) {
      //     currentState = 'success';
      //     type.success(data);
      //     success(data, payload);
      //   } else {
      //     currentState = 'failure';
      //     type.failure(data);
      //     failure(data);
      //   }
      if (data && !error) {
        currentState = 'success';
        type.success(data);
        success(data, payload);
      } else {
        currentState = 'failure';
        type.failure(data);
        failure(data);
      }
    } catch (err) {
      console.log('\n');
      console.group(`${tag} ${currentState}` + ' error');
      console.log(payload, 'payload');
      console.log(err);
      console.groupEnd();
      console.log('\n');
    }
  };
};

/**
 * SpreadSagas: reducer 연결
 * @param {*} config
 */
export function SpreadSagas(config) {
  const { state: defaultState } = config;

  return function (customState, types, config = {}) {
    const { init, pending, success, failure, callback } = config;
    const notation = (str, obj) => str.split('.').reduce((a, c) => a[c], obj);

    try {
      // single
      if (customState === null) {
        this[types] = (state, payload) => produce(state, draft => callback(draft, payload, state));
        return;
      }

      const setPartial = (fn, draft, payload, state, type) => {
        let targetState = notation(customState, draft);
        const initialState = notation(customState, defaultState);
        const { pending, success, failure } = targetState;
        if ([pending, success, failure].every(item => item === undefined)) return;

        if (type === 'init') {
          targetState.pending = false;
          targetState.success = false;
          targetState.failure = false;
          // _.forEach(initialState, (value, key, obj) => {
          //   targetState[key] = value;
          // });
        } else {
          targetState.pending = false;
          targetState.success = false;
          targetState.failure = false;
          targetState[type] = true;
        }

        if (typeof fn === 'function') {
          fn(draft, payload, state);
        }
      };

      // types
      this[types.INIT] = (state, payload) =>
        produce(state, draft => {
          setPartial.apply(this, [init, draft, payload, state, 'init']);
        });
      this[types.PENDING] = (state, payload) =>
        produce(state, draft => {
          setPartial.apply(this, [pending, draft, payload, state, 'pending']);
        });
      this[types.SUCCESS] = (state, payload) =>
        produce(state, draft => {
          setPartial.apply(this, [success, draft, payload, state, 'success']);
        });
      this[types.FAILURE] = (state, payload) =>
        produce(state, draft => {
          setPartial.apply(this, [failure, draft, payload, state, 'failure']);
        });
    } catch (e) {
      console.log('SpreadSagas error', e);
    }
  };
}
