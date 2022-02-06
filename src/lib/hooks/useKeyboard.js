import React, { useCallback, useMemo, useState } from 'react';

/**
 * 키보드 입력
 */
export default () => {
  const [value, setValue] = useState(new Set());

  const onChange = useCallback(({ key, type }) => {
    setValue(draft => {
      if (type === 'keydown') {
        draft.add(key.toUpperCase());
        setValue(new Set([...draft]));
        // if (!draft.has(key.toUpperCase())) {
        //   draft.add(key.toUpperCase());
        //   setValue(new Set([...draft]));
        // }
      }

      if (type === 'keyup') {
        draft.delete(key.toUpperCase());
        setValue(new Set([...draft]));
        // if (draft.has(key.toUpperCase())) {
        //   draft.delete(key.toUpperCase());
        //   setValue(new Set([...draft]));
        // }
      }
    });
  }, []);

  // console.log('value', value);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
