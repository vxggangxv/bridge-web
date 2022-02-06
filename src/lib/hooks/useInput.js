import { useCallback, useMemo, useState } from 'react';
import { throttle } from 'lodash';

// useInput을 적용하는 태그에서는 value or data-value  택1 사용,
// 다른 value를 전달하여야 하는 경우 키 값이 겹치지 않게 사용
export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  // const onChange = throttle(
  //   useCallback(
  //     e => {
  //       const value = e.target?.value;

  //       // form 태그가 아닌경우
  //       // ㄴ direct element일 경우 data-value로 전달하여 사용
  //       // ㄴ direct element가 아닐경우는 onChange({value}) 또는 setValue로 사용
  //       let dataValue = e.target?.dataset?.value;
  //       dataValue = dataValue || e.value;

  //       const applyValue = value ? value : dataValue;
  //       // console.log(applyValue, 'applyValue');

  //       setValue(applyValue);
  //     },
  //     [],
  //     500,
  //   ),
  // );
  const onChange = useCallback(e => {
    const value = e.target?.value || '';

    // form 태그가 아닌경우
    // ㄴ direct element일 경우 data-value로 전달하여 사용
    // ㄴ direct element가 아닐경우는 onChange({value}) 또는 setValue로 사용
    let dataValue = e.target?.dataset?.value;
    const eNumberValue = typeof e?.value === 'number' ? e?.value : '';
    dataValue = dataValue || e.value || eNumberValue;
    // console.log('typeof', typeof e.value);
    // console.log('value', value);
    // console.log('dataValue', dataValue);

    const applyValue = value ? value : dataValue;
    // console.log(applyValue, 'applyValue');

    setValue(applyValue);
  }, []);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
