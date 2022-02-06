import React, { useEffect, useRef, useReducer, useState, useCallback } from 'react';
import _ from 'lodash';
import { convertObjectToQueryString } from 'lib/library';
import { BaseActions, dispatch } from 'store/actionCreators';
import { useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';

/**
 *
 * @param {*} draft
 * @param {*} type
 */
export function IPSFset(draft, type) {
  draft.pending = false;
  draft.success = false;
  draft.failure = false;
  if (type !== 'init') {
    draft[type] = true;
  }
}

/**
 * useInput
 * @param {*} initialForm object
 */
// export const useInput = (function () {
//   function reducer(state, action) {
//     return { ...state, [action.name]: action.value };
//   }

//   return function useInput(initialForm) {
//     const [state, dispatch] = useReducer(reducer, initialForm);

//     const onChange = e => {
//       dispatch(e.target);
//     };
//     return [state, onChange];
//   };
// })();

/**
 *
 * @param {*} f
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
export const useDidMount = f => useEffect(() => f && f(), []);

/**
 * DidUpdateMount를 구현한 Custom hooks, useEffect를 쓰면 한번 읽히는 것을 방지하기 위한 최적화 작업
 * @param {*} fn
 * @param {*} inputs
 */
export function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      fn();
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}

/**
 * NOTE: 랜더링 부분에서 사용하면 됨
 * const prevState = usePrevious(values);
 * @param {*} value
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * NOTE: 강제로 렌더링을 진행할때 사용합니다.
 */
export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}

/**
 *
 * @param {*} value
 * @param {*} delay
 */
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useActiveElement = () => {
  const [active, setActive] = React.useState(document.activeElement);
  const handleFocusIn = e => {
    setActive(document.activeElement);
  };
  React.useEffect(() => {
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);
  return active;
};

/**
 * current 이벤트 바인딩시 이벤트 컨택스트가 달라질때 사용.
 * @param {*} callback
 */
export function useSharedCallbackUnsafe(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return (...args) => callbackRef.current(...args);
}

//SECTION: Hign Order Component (HOC)
/**
 *
 * @param {*} url
 */
export const withLoading = WrappedComponent => props => {
  return props.isLoading ? (
    (console.log('Base landing...'), (<div>Loading ...</div>))
  ) : (
    <WrappedComponent {...props} />
  );
};

export const withUseEffect = (fn, arr) => {
  // arr.forEach((item)=>{
  //   useEffect(()=>{
  //   },[item]);
  // });
};

/**
 * NOTE: keyPress를 위한 훅스
 * @param {*} targetKey
 */
export function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = _.debounce(({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }, 100);

  // If released key is our target key then set to false

  const upHandler = _.debounce(({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }, 100);

  // Add event listeners
  useEffect(() => {
    document.addEventListener('keydown', downHandler);
    document.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('keydown', downHandler);
      document.removeEventListener('keyup', upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

export function useMultiKeyPress(keyCombine = []) {
  const [keysPressed, setKeyPressed] = useState(new Set([]));

  const downHandler = ({ key }) => {
    setKeyPressed(keysPressed.add(key));
  };

  const upHandler = ({ key }) => {
    keysPressed.delete(key);
    setKeyPressed(keysPressed);
  };

  useEffect(() => {
    document.addEventListener('keydown', downHandler);
    document.addEventListener('keyup', upHandler);
    return () => {
      document.removeEventListener('keydown', downHandler);
      document.removeEventListener('keyup', upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keysPressed;
}

//SECTION: Reducer
/**
 *
 * @param {*} reducerInitalize
 */
export function initReducer(typeAction) {
  dispatch(typeAction);
}

/**
 *
 * @param {*} param0
 */
export const useDoubleClick = ({
  ref,
  latency = 300,
  onClick = () => null,
  onDoubleClick = () => null,
}) => {
  useEffect(() => {
    const clickRef = ref.current;
    let clickCount = 0;
    const handleClick = e => {
      clickCount += 1;
      setTimeout(() => {
        if (clickCount === 1) onClick(e);
        else if (clickCount === 2) onDoubleClick(e);

        clickCount = 0;
      }, latency);
    };
    clickRef.addEventListener('click', handleClick);
    return () => {
      clickRef.removeEventListener('click', handleClick);
    };
  });
};

/**
 * const historyPush = useHistoryPush();
 * historyPush({
        url: '/mypage/partners',
        query: {
          type: name,
          page: 1,
        },
      })
 * NOTE:  함수 실행 시 쿼리형태로 파싱하여 push 해줍니다
 */

export function useWithHistory() {
  let history = useHistory();
  return {
    historyPush(config) {
      const { url = '/', query = {} } = config;
      const parseQuery = convertObjectToQueryString(query);
      const queryUrl = !!parseQuery ? `?${parseQuery}` : '';
      const pushUrl = url + queryUrl;
      history.push(pushUrl);
    },
    historyReplace(config) {
      const { url = '/', query = {} } = config;
      const parseQuery = convertObjectToQueryString(query);
      const queryUrl = !!parseQuery ? `?${parseQuery}` : '';
      const pushUrl = url + queryUrl;
      history.replace(pushUrl);
    },
    history,
  };
}
// DEBUG: 임시
export function useHistoryPush() {
  let history = useHistory();
  return {
    historyPush(config) {
      const { url = '/', query = {} } = config;
      const parseQuery = convertObjectToQueryString(query);
      const queryUrl = !!parseQuery ? `?${parseQuery}` : '';
      const pushUrl = url + queryUrl;
      history.push(pushUrl);
    },
    historyReplace(config) {
      const { url = '/', query = {} } = config;
      const parseQuery = convertObjectToQueryString(query);
      const queryUrl = !!parseQuery ? `?${parseQuery}` : '';
      const pushUrl = url + queryUrl;
      history.replace(pushUrl);
    },
    history,
  };
}

// NOTE: Popup
export const Popup = config => BaseActions.base_popup(config);

// NOTE: useInterval
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

// NOTE: shallowEqual
export function useShallowSelector(fn) {
  return useSelector(fn, shallowEqual);
}
