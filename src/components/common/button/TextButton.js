import React from 'react';
import styled from 'styled-components';

export default function TextButton(props) {
  const { children, className = '' } = props;
  return (
    <Styled.TextButton
      {...props}
      data-component-name="TextButton"
      className={`button ${className}`}
    >
      {children}
    </Styled.TextButton>
  );
}

const Styled = {
  TextButton: styled.button`
    background-color: transparent;
    border-color: transparent;
    cursor: pointer;
    font: inherit;
    font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
    color: ${props => (props.fontColor ? props.fontColor : 'inherit')};
  `,
};
