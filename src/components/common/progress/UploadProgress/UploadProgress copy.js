import React, { useEffect } from 'react';
import { size, toArray } from 'lodash';
import UploadItem from '../UploadItem/UploadItem';
import { useShallowSelector } from 'lib/utils';
import Styles from './UploadProgress.module.css';

export default function UploadProgress(props) {
  const { fileProgress } = useShallowSelector(state => ({
    fileProgress: state.app.fileProgress,
  }));
  const uploadedFileAmount = size(fileProgress);

  console.log(fileProgress, 'fileProgress');

  // useEffect(() => {
  //   const fileToUpload = toArray(fileProgress).filter(file => file.progress === 0);
  //   console.log(fileToUpload, 'fileToUpload');
  //   // uploadFile(fileToUpload);
  // }, [uploadedFileAmount]);

  return uploadedFileAmount > 0 ? (
    <div className={Styles.wrapper}>
      <h4>Uploading File</h4>
      {toArray(fileProgress).map(file => (
        <UploadItem key={file.id} file={file} />
      ))}
    </div>
  ) : null;
}
