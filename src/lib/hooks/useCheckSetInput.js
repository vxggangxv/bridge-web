import { useCallback, useMemo, useState } from 'react';

// 복수 checkbox or form태그가 아닌(예. button)으로 checkbox의 역할이 필요한 경우 사용
// new Set([]) : defaultValue
export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    // form 태그가 아닌경우
    // ㄴ direct element일 경우 data-value로 전달하여 사용
    // ㄴ direct element가 아닐경우는 onChange({value}) 또는 setValue로 사용
    let dataValue = e.target?.dataset?.value;
    dataValue = dataValue || e.value;

    setValue(draft => {
      if (draft.has(dataValue)) {
        // const returnValue = new Set([...draft]);
        draft.delete(dataValue);
        return new Set([...draft]);
      } else {
        // const returnValue = new Set([...draft]);
        draft.add(dataValue);
        return new Set([...draft]);
      }
    });
  }, []);
  // console.log('value', value);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
