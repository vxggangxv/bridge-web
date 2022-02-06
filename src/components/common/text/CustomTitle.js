import React from 'react';
import styled from 'styled-components';

export default function CustomTitle(props) {
  const {
    children,
    fontSize,
    fontColor,
    fontWeight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  } = props;
  return (
    <Styled.CustomTitle
      fontSize={fontSize}
      fontColor={fontColor}
      fontWeight={fontWeight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      data-component-name="CustomTitle"
    >
      {children}
    </Styled.CustomTitle>
  );
}

const Styled = {
  CustomTitle: styled.h1`
    font-size: ${props => props.fontSize && `${props.fontSize}px`};
    color: ${props => props.fontColor && `${props.fontColor}`};
    font-weight: ${props => props.fontWeight && `${props.fontWeight}`};
    margin-top: ${props => props.marginTop && `${props.marginTop}px`};
    margin-bottom: ${props => props.marginBottom && `${props.marginBottom}px`};
    margin-left: ${props => props.marginLeft && `${props.marginLeft}px`};
    margin-right: ${props => props.marginRight && `${props.marginRight}px`};
  `,
};
