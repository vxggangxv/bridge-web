import { useCallback, useMemo, useState } from 'react';

// 단일 or 복수 checkbox의 경우 사용(웬만하면 복수, input type="checkbox" 에서 사용)
export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    const {
      target: { checked, name },
    } = e;
    // console.log('name', name);
    // console.log('checked', checked);

    setValue(draft => ({ ...draft, [name]: checked }));
  }, []);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
