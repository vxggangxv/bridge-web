import useInput from 'lib/hooks/useInput';
import React from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';

export default React.memo(function CustomFormHelperText(props) {
  const {
    children,
    fontSize,
    fontColor,
    fontWeight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    className = '',
  } = props;

  return (
    <Styled.CustomFormHelperText
      fontSize={fontSize}
      fontColor={fontColor}
      fontWeight={fontWeight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      data-component-name="CustomFormHelperText"
      className={`customFormHelperText ${className}`}
    >
      {children}
    </Styled.CustomFormHelperText>
  );
});

const Styled = {
  CustomFormHelperText: styled.div`
    margin-top: 3px;
    min-height: 15px;
    width: 100%;
    line-height: 1.1;
    font-size: ${props => (props.fontSize ? `${props.fontSize}px` : `12px`)};
    color: ${props => (props.fontColor ? `${props.fontColor}` : `${color.blue}`)};
    font-weight: ${props => props.fontWeight && `${props.fontWeight}`};
    margin-top: ${props => props.marginTop && `${props.marginTop}px`};
    margin-bottom: ${props => props.marginBottom && `${props.marginBottom}px`};
    margin-left: ${props => props.marginLeft && `${props.marginLeft}px`};
    margin-right: ${props => props.marginRight && `${props.marginRight}px`};
    &.active {
      opacity: 1;
    }
    &.info {
    }
    &.error {
      color: ${color.red};
      opacity: 0;
      &.active {
        opacity: 1;
      }
    }
  `,
};
