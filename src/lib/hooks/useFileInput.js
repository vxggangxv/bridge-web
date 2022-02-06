import { useCallback, useMemo, useState } from 'react';

export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    const {
      target: { files },
    } = e;

    console.log(files, 'files');
    setValue({
      file: files[0],
      name: files[0]?.name || '',
      size: files[0]?.size,
      type: files[0]?.type.split('/')[0],
    });
  }, []);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
