import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { px2number } from 'lib/library';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useShallowSelector } from 'lib/utils';

export default function ImgCrop({
  width,
  height,
  display,
  src,
  className = '',
  isCircle = null,
  isBorder = null,
}) {
  const widthProp = px2number(width);
  const heightProp = px2number(height);
  const [imgLoad, setImgLoad] = useState(null);
  const [imgWidth, setImgWidth] = useState(null);
  const [imgHeight, setImgHeight] = useState(null);
  const img = new Image();
  img.src = src;

  useEffect(() => {
    if (imgLoad) {
      // console.log('img.width', img.width);
      // console.log('img.height', img.height);
      setImgWidth(img.width);
      setImgHeight(img.height);
      setImgLoad(false);
    }
  }, [imgLoad]);

  return (
    <Styled.ImgCrop
      data-component-name="ImgCrop"
      width={widthProp}
      height={heightProp ? heightProp : widthProp}
      imgWidth={imgWidth}
      imgHeight={imgHeight}
      // imgWidth={img.width}
      // imgHeight={img.height}
      display={display}
      className={cx(`${className}`, { circle: isCircle, border: isBorder })}
    >
      <img src={src} alt={`img-${className}`} onLoad={() => setImgLoad(true)} />
    </Styled.ImgCrop>
  );
}

ImgCrop.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.string.isRequired,
};

const Styled = {
  ImgCrop: styled.div`
    position: relative;
    margin: 0 auto;
    display: ${({ display }) => display && `${display}`};
    width: ${({ width }) => (width ? `${width}px` : `100%`)};
    height: ${({ height }) => (height ? `${height}px` : `100%`)};
    overflow: hidden;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: ${({ imgWidth, imgHeight }) => imgWidth <= imgHeight && `100%`};
      max-height: ${({ imgWidth, imgHeight }) => imgWidth > imgHeight && `100%`};
    }
    &.circle {
      border-radius: 50%;
    }
    &.border {
      border: 1px solid #eee;
    }
  `,
};
