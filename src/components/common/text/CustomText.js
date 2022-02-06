import React from 'react';
import styled from 'styled-components';

export default function CustomText(props) {
  const {
    children,
    className,
    style,
    fontSize,
    fontColor,
    fontWeight,
    fontStyle,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    alignItems,
  } = props;
  return (
    <Styled.CustomText
      data-component-name="CustomText"
      className={className}
      fontSize={fontSize}
      fontColor={fontColor}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      alignItems={alignItems}
      style={style}
    >
      {children}
    </Styled.CustomText>
  );
}

const Styled = {
  CustomText: styled.p`
    font-size: ${({ fontSize }) => fontSize && `${fontSize}px`};
    color: ${({ fontColor }) => fontColor && `${fontColor}`};
    font-weight: ${({ fontWeight }) => fontWeight && `${fontWeight}`};
    font-style: ${({ fontStyle }) => fontStyle && `${fontStyle}`};
    margin-top: ${({ marginTop }) => marginTop && `${marginTop}px`};
    margin-bottom: ${({ marginBottom }) => marginBottom && `${marginBottom}px`};
    margin-left: ${({ marginLeft }) => marginLeft && `${marginLeft}px`};
    margin-right: ${({ marginRight }) => marginRight && `${marginRight}px`};
    align-items: ${({ alignItems }) => alignItems && alignItems};
  `,
};
