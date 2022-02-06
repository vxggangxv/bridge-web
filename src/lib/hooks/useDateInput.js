import { useCallback, useMemo, useState } from 'react';
import moment from 'moment';

export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback((value, cb) => {
    const dateValue = value ? moment(value) : null;
    setValue(dateValue);
    // onChange시점 콜백함수, (ex. valid체크)
    if (typeof cb === 'function') {
      cb(value);
    }
  }, []);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
