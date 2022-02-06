import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { fontFamilyValue } from 'styles/utils';
import { _color } from 'styles/_variables';

export default React.memo(function MuiWrapper(props) {
  const {
    children,
    config: customConfig = {},
    isGlobalStyle = false,
    className = '',
    childrenContent,
  } = props;
  const muiProps = {
    ...props,
  };
  delete muiProps.config;
  // const { height, fontColor, color, borderColor, errorColor, styleConfig = {} } = customConfig;
  const defaultColor = _color.blue;

  return (
    <Styled.MuiWrapper
      data-component-name="MuiWrapper"
      {...customConfig}
      defaultColor={defaultColor}
      fullWidth={children.props?.fullWidth}
      className={`muiWrapper ${className}`}
    >
      {children}
      {childrenContent}
      {isGlobalStyle && <Styled.GlobalStyles {...customConfig} defaultColor={defaultColor} />}
    </Styled.MuiWrapper>
  );
});

const Styled = {
  GlobalStyles: createGlobalStyle`
    .MuiPopover-root {
      .MuiList-root {
        // multiple select padding
        // checkbox color
        .MuiCheckbox-root {
          padding: 2px 0;
          margin-right: 8px;
          color: ${props => (props.color ? props.color : props.defaultColor)};
          &:hover {
            background-color: transparent;  
          }
          .MuiSvgIcon-root {
            font-size: 20px;
          }
        }
      }
    }
  `,
  MuiWrapper: styled.div`
    position: relative;
    display: inline-flex;
    overflow: hidden;
    // &[data-component-name='MuiWrapper']
    // width apply
    width: ${props => props.width && props.width};
    width: ${props => props.fullWidth && `100%`};
    // height apply, default height: 40px
    height: ${props => (props.height ? props.height : '40px')};
    color: ${props => (props.fontColor ? props.fontColor : '#333')};
    font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
    font-family: ${fontFamilyValue};
    &.sm {
      height: 34px;
      .MuiOutlinedInput-input {
        line-height: 34px;
      }
    }
    .MuiFormControl-root {
      height: 100%;
    }
    .MuiButtonBase-root,
    .MuiInputBase-root,
    .MuiSelect-select,
    .MuiInputBase-root input::placeholder {
      height: 100%;
      font-size: inherit;
      font-family: inherit;
    }
    .MuiOutlinedInput-input {
      padding-top: 0px;
      padding-bottom: 0px;
      line-height: ${props => (props.height ? props.height : '40px')};
    }
    .MuiSelect-selectMenu {
      height: initial;
    }
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline,
    .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline,
    .MuiInput-underline:after,
    .MuiInput-underline:hover:not(.Mui-disabled):before {
      border-width: 1px;
    }
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline,
    .MuiInput-underline:after {
      border-color: ${props => (props.borderColor ? props.borderColor : props.defaultColor)};
    }
    .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline,
    .MuiInput-underline.Mui-error:after {
      border-color: ${props => (props.borderColor ? props.errorColor : _color.red)};
    }
    /* .MuiInputBase-root input::placeholder {
      font-size: 14px;
    } */
    .MuiSvgIcon-root {
      &.cursor {
        cursor: pointer;
      }
    }
    .MuiFormGroup-root {
      flex-direction: initial;
    }
    .MuiRadio-colorPrimary.Mui-checked,
    .MuiCheckbox-colorPrimary.Mui-checked,
    .MuiSvgIcon-colorPrimary {
      color: ${props => (props.color ? props.color : props.defaultColor)};
    }
    .MuiFormControlLabel-label.MuiTypography-body1 {
      font: inherit;
    }
    // border-radius custom
    .MuiInputBase-root,
    .MuiTextField-root {
      &.radius-sm {
        .MuiSelect-root,
        .MuiInputBase-root {
          border-radius: 3px;
        }
      }
      &.radius-md {
        .MuiSelect-root,
        .MuiInputBase-root {
          border-radius: 5px;
        }
      }
    }
  `,
};
