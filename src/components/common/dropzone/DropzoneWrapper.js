import React, { useEffect, useState } from 'react';
import Dropzone from 'components/common/dropzone/Dropzone';
import styled from 'styled-components';

// test
function DropzoneChildren() {
  return (
    <Styled.DropzoneChildren className="content__container">
      Test content UI
    </Styled.DropzoneChildren>
  );
}

// 차후 dropzoneComponent 종류 추가될 경우 키값 추가
// 드래그할 경우 나타났다 사라지게 하는 wrapper
/**
 * e.g.
 * <DropzoneWrapper
 *  apiRequest={function}> : api요청 function
 *  className={string} : 상위컴포넌트에서 스타일을 설정한 className
 *  width={number} : styles가 없을 경우 width 적용, 기본 100%
 *  height={number} : styles가 없을 경우 height 적용, 기본 100%
 *  {children}
 * </>
 */
function DropzoneWrapper({ className, children, width, height, apiRequest }) {
  const [visible, setVisible] = useState(false);

  const handleSetVisible = toggle => {
    setVisible(toggle);
  };

  // const apiRequest = () => {
  //   // return new Promise((resolve, reject) => {
  //   //   setTimeout(() => {
  //   //     resolve(5);
  //   //   }, 5000);
  //   // });
  // };

  // useEffect(() => {
  //   console.log(visible, 'visible');
  // }, [visible]);

  return (
    <Styled.DropzoneWrapper
      data-component-name="DropzoneWrapper"
      onDragEnter={() => handleSetVisible(true)}
      className={className}
      width={!className && width}
      height={!className && height}
    >
      {children}
      {visible && <Dropzone onSetVisible={handleSetVisible} apiRequest={apiRequest} />}
      {/* {true && <Dropzone onSetVisible={handleSetVisible} />} */}
    </Styled.DropzoneWrapper>
  );
}

const Styled = {
  DropzoneWrapper: styled.div`
    position: relative;
    width: ${({ width }) => (width ? `${width}px` : `100%`)};
    height: ${({ height }) => (height ? `${height}px` : `100%`)};
  `,
  DropzoneChildren: styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid #bbb;
    padding: 50px;
  `,
};

export default DropzoneWrapper;
