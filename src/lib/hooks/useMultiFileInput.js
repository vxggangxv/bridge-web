import { useCallback, useMemo, useState } from 'react';
import uuid from 'react-uuid';
import moment from 'moment';

// files안에 객체당 value, name 등의 속성을 배열로 리턴
export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    const {
      target: { files },
    } = e;

    // console.log(files, 'files');
    const fileList = Object.keys(files).reduce((acc, key) => {
      const { name, size, type } = files[key];
      const obj = {
        id: moment() + uuid(),
        file: files[key],
        name: name,
        size: size,
        type: type?.split('/')[0],
      };

      return acc.concat(obj);
    }, []);
    // console.log(fileList, 'fileList');

    setValue(fileList);
  }, []);
  const reset = useCallback(() => setValue(defaultValue), [defaultValue]);
  return useMemo(() => ({ value, onChange, setValue, reset }), [value]);
};
