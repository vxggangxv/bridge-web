import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { icon_picture } from 'components/base/images';
import uuid from 'react-uuid';
// import { AirlineSeatIndividualSuiteSharp } from '@material-ui/icons';
// import axios from 'axios';

/**
 * e.g.
 * <Dropzone
 *  @param {number} width : styles가 없을 경우 width 적용, 기본 100%
 *  @param {number} height : styles가 없을 경우 height 적용, 기본 100%
 *  @param {object} styles : style property 객체
 *  @param {function} onSetVisible : dropzoneView visible설정을 위해 DropzoneWrapper에서 받은 function
 * />
 */
function Dropzone({ width, height, styles, onSetVisible = () => {}, apiRequest = () => {} }) {
  const [dropFiles, setDropFiles] = useState([]);
  const [isRequest, setIsRequest] = useState(false);
  // DEBUG: async await 실제 api테스트 필요
  const onDrop = useCallback(async acceptedFiles => {
    acceptedFiles.forEach(file => {
      // setIsRequest(false);
      const reader = new FileReader();
      const localFileId = uuid();

      file.id = localFileId;
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = e => {
        // console.log(e.target.result, 'e.target.result');
        // console.log(file, 'file');
        // Do whatever you want with the file contents
        // const binaryStr = reader.result;
        // console.log(binaryStr, 'binaryStr');
        // console.log(reader, 'reader');
      };
      // reader.readAsDataURL(file);
      // reader.readAsArrayBuffer(file);
    });
    setDropFiles(dropFiles.concat(acceptedFiles));
    setIsRequest(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const rootProps = {
    ...getRootProps(),
    maxsize: 100,
    // multiple: false,
    onDragLeave: () => onSetVisible(false),
    // onDrop: () => onSetVisible(false),
    // onDrop: () => console.log('onDrop'),
  };

  const inputProps = {
    ...getInputProps(),
    // multiple: false,
    // accept: 'image/gif, image/jpg, image/jpeg',
  };

  // useEffect(() => {
  //   console.log(getRootProps(), 'getRootProps()');
  //   console.log(getInputProps(), 'getInputProps()');
  // }, []);

  // valuesImage에 담은 후 api호출
  // await call Api 은 DropzoneWrapper에서 연결
  // useEffect(() => {
  //   console.log(dropFiles, 'dropFiles');
  // }, [dropFiles]);

  // 파일 Drop 완료후 set Dropzone visible false
  useEffect(() => {
    // console.log(isRequest, 'isRequest');
    if (isRequest) {
      // apiRequest();
      apiRequest({ dropFiles });
      setDropFiles([]);
      onSetVisible(false);
      setIsRequest(false);
    }
  }, [dropFiles, isRequest]);

  return (
    <Styled.Dropzone
      data-component-name="Dropzone"
      style={styles}
      width={width}
      height={height}
      className={!styles && 'default'}
    >
      <div className="dropzoneView">
        <div className="dropzoneView__picture_box">
          <div className="dropzoneView__picture_img">
            <img src={icon_picture} alt="picture" />
          </div>
          <div className="dropzoneView__picture_text">Drag&amp;Drop File here</div>
        </div>
      </div>
      <div {...rootProps} className="dropzone__container">
        <input {...inputProps} />
        {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )} */}
        {/* <br />
      업로드 파일명: {image} */}
      </div>
    </Styled.Dropzone>
  );
}

const Styled = {
  Dropzone: styled.div`
    &.default,
    .dropzone__container {
      position: absolute;
      top: 0;
      left: 0;
      width: ${({ width }) => (width ? `${width}px` : `100%`)};
      height: ${({ height }) => (height ? `${height}px` : `100%`)};
    }
    &.default {
      padding: 20px;
      background-color: #fff;
      /* border: 1px solid #333; */
    }
    .dropzone__container {
      outline: none;
    }
    .dropzoneView {
      /* border: 1px solid #333; */
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .dropzoneView__picture_box {
      text-align: center;
      .dropzoneView__picture_img {
      }
      .dropzoneView__picture_text {
        margin-top: 15px;
      }
    }
  `,
};

export default Dropzone;
