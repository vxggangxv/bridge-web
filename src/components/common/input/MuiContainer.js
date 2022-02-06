import React, { useState } from 'react';
import { createMuiTheme, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import styled, { createGlobalStyle } from 'styled-components';
import { color, fontFamilyValue } from 'styles/utils';
import { _color } from 'styles/_variables';
import useInput from 'lib/hooks/useInput';

export default React.memo(function MuiContainer(props) {
  const { children, config = {}, isGlobalStyle = false, className = '', childrenContent } = props;
  const { height, fontColor, color, borderColor, errorColor, styleConfig = {} } = config;
  const defaultColor = _color.blue;

  // console.log(muiProps, 'muiProps');
  // console.log(config, 'config');

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: defaultColor,
        // contrastText: primaryfontColor,
      },
      error: {
        main: _color.red,
      },
      // secondary: {
      //   main: color ? color : '#11cb5f',
      //   contrastText: '#fff',
      // },
    },
    typography: {
      fontFamily: fontFamilyValue,
    },
    props: {},
  });

  return (
    <Styled.MuiContainer
      data-component-name="MuiContainer"
      {...config}
      defaultColor={defaultColor}
      fullWidth={props?.fullWidth}
      className={`muiWrapper muiContainer ${className}`}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
      {childrenContent}
      {isGlobalStyle && <Styled.GlobalStyles {...config} defaultColor={defaultColor} />}
    </Styled.MuiContainer>
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
  MuiContainer: styled.div`
    position: relative;
    display: inline-flex;
    overflow: hidden;
    // &[data-component-name='MuiContainer']
    // width apply
    min-width: ${({ minWidth }) => minWidth && minWidth};
    width: ${props => props.fullWidth && `100%`};
    width: ${props => props.width && props.width};
    // height apply, default height: 40px
    height: ${props => (props.height ? props.height : '40px')};
    color: ${props => (props.fontColor ? props.fontColor : '#333')};
    font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
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
    .MuiOutlinedInput-notchedOutline {
      border-width: 1px !important;
    }
    .MuiOutlinedInput-multiline {
      padding: 14px;
    }
    /* .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline,
    .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline,
    .MuiInput-underline:after,
    .MuiInput-underline:hover:not(.Mui-disabled):before {
      border-width: 1px !important;
    } */
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
    .MuiFormControlLabel-label.MuiTypography-body1 {
      font: inherit;
    }
    // border-radius custom
    .MuiInputBase-root,
    .MuiTextField-root {
      color: inherit;
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
