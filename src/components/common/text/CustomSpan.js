import React from 'react';
import styled from 'styled-components';

export default function CustomSpan(props) {
  const {
    children,
    className,
    style,
    fontSize,
    fontColor,
    fontWeight,
    fontStyle,
    marginLeft,
    marginRight,
    width,
    display,
    alignItems,
  } = props;
  return (
    <Styled.CustomSpan
      data-component-name="CustomSpan"
      className={className}
      fontSize={fontSize}
      fontColor={fontColor}
      fontWeight={fontWeight}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      marginLeft={marginLeft}
      marginRight={marginRight}
      width={width}
      display={display}
      alignItems={alignItems}
      style={style}
    >
      {children}
    </Styled.CustomSpan>
  );
}

const Styled = {
  CustomSpan: styled.span`
    display: ${({ width }) => width && `inline-block`};
    font-size: ${({ fontSize }) => fontSize && `${fontSize}px`};
    color: ${({ fontColor }) => fontColor && `${fontColor}`};
    font-weight: ${({ fontWeight }) => fontWeight && `${fontWeight}`};
    font-style: ${({ fontStyle }) => fontStyle && `${fontStyle}`};
    margin-top: ${({ marginTop }) => marginTop && `${marginTop}px`};
    margin-bottom: ${({ marginBottom }) => marginBottom && `${marginBottom}px`};
    margin-left: ${({ marginLeft }) => marginLeft && `${marginLeft}px`};
    margin-right: ${({ marginRight }) => marginRight && `${marginRight}px`};
    width: ${({ width }) => width && `${width}px`};
    display: ${({ display }) => display && display};
    align-items: ${({ alignItems }) => alignItems && alignItems};
  `,
};
