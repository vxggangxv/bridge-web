import { useCallback, useMemo, useState } from 'react';

// 단일 checkbox에서 사용
export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    // console.log('e', e);
    const checked = e.target?.checked;
    setValue(checked);
  }, []);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
