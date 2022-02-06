import React, { useEffect } from 'react';
import { useDidUpdateEffect } from 'lib/utils';
import { useCallback, useMemo, useState } from 'react';

/**
 * @params {object} : defaultValue - fetchList, 랜더링 전 api response success 확인용
 * redux에서 api call 이후 init으로 돌아가기때문에 request success(true) 값만 캐치 하는 hook
 */
export default defaultValue => {
  // console.log(defaultValue, 'defaultValue');
  const fetchSuccessListInitValue = Object.keys(defaultValue).reduce((acc, curr) => {
    const obj = { [curr]: null };
    return Object.assign(acc, obj);
  }, {});
  // console.log(fetchSuccessListInitValue, 'fetchSuccessListInitValue');
  const [fetchSuccessList, setFetchSuccessList] = useState(fetchSuccessListInitValue);

  // dependency에 비교값 success === true
  const isFetchSuccess = useMemo(() => {
    const statusList = Object.keys(fetchSuccessList).reduce((acc, curr) => {
      return acc.concat(fetchSuccessList[curr]);
    }, []);

    return statusList.every(item => item === true);
  }, [fetchSuccessList]);

  useDidUpdateEffect(() => {
    // console.log(' work?? number?');
    for (const key in defaultValue) {
      const inValue = defaultValue[key];
      // console.log(inValue, 'inValue');
      // 성공 이후, init시점 null 값이 들어가는걸 방지, 성공 시점만 캐치
      if (inValue === true) setFetchSuccessList(draft => ({ ...draft, [key]: inValue }));
    }
  }, [defaultValue]);

  // return { isFetchSuccess };
  return useMemo(() => ({ isFetchSuccess }), [defaultValue]);
};
