import { enableMapSet } from 'immer';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
enableMapSet();

// 2depth 이상 객체에 사용, setValue사용시 return 사용 X, 자동 draft에 return 됨
export default defaultValue => {
  const [value, setValue] = useImmer(defaultValue);

  return useMemo(() => ({ value, setValue }), [value]);
};
