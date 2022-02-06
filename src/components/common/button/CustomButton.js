import React from 'react';
import styled from 'styled-components';
import { _color } from 'styles/_variables';
import { fontFamilyValue } from 'styles/utils';
import Color from 'color';

function CustomButton(props) {
  const { children, config: customConfig = {} } = props;
  const componentProps = {
    ...props,
  };
  delete componentProps.config;
  const { color = _color.blue, styleConfig = {} } = customConfig;

  return (
    <Styled.CustomButton
      data-component-name="CustomButton"
      {...customConfig}
      color={Color(color)}
      darkenColor={Color(color).darken(0.12)}
    >
      <button {...componentProps} style={styleConfig} className="button">
        {children}
      </button>
    </Styled.CustomButton>
  );
}

const Styled = {
  CustomButton: styled.div`
    display: inline;
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: 500;
      line-height: 1.75;
      border-radius: 4px;
      letter-spacing: 0.02857em;
      text-transform: uppercase;
      font-size: 14px;
      border: 1px solid ${props => (props.color ? `${props.color}` : _color.blue)};
      border-radius: 4px;
      // width apply
      width: ${props => (props.width ? props.width : props.fullWidth ? `100%` : `auto`)};
      // height apply, default height: 40px
      height: ${props => (props.height ? props.height : `40px`)};
      // width, fullWidth 있을 경우 padding: 0
      padding: ${props => (props.width || props.fullWidth ? 0 : `6px 16px`)};
      color: ${props => (props.fontColor ? props.fontColor : `#fff`)};
      font-family: ${fontFamilyValue};
      background-color: ${props => (props.color ? `${props.color}` : _color.blue)};
      &:hover {
        background-color: ${props =>
          props.darkenColor ? `${props.darkenColor}` : _color.blue_hover};
      }
    }
  `,
};

export default CustomButton;
