import React from 'react';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import styled, { createGlobalStyle } from 'styled-components';
import { color, fontFamilyValue } from 'styles/utils';
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
  const { height, fontColor, color, borderColor, errorColor, styleConfig = {} } = customConfig;
  const defaultColor = _color.blue;

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
    <Styled.MuiWrapper
      data-component-name="MuiWrapper"
      {...customConfig}
      defaultColor={defaultColor}
      fullWidth={children.props?.fullWidth}
      className={`muiWrapper ${className}`}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
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

/*
<MuiWrapper
  childrenContent={
    <>
      {isShowTimer && <span className="verify__input_timer">{timer}</span>}
      {checkCodeStatus && <span className="input__icon_success"></span>}
    </>
  }
>
// TextField
  <TextField
    variant="outlined"
    fullWidth
    disabled
    placeholder={licenseFile.value.name}
    error={isSubmit && isRequiredBusiness ? !licenseFile.value.name : false}
  />
</MuiWrapper>
<CustomFormHelperText
  className={cx(`error`, {
    active: isSubmit && isRequiredBusiness ? !licenseFile.value.name : false,
  })}
>
  <T>reg.required</T>
</CustomFormHelperText>

// Select
<FormControl
  fullWidth
  variant="outlined"
  error={isSubmit ? !region.value : false}
  >
  <Select
  MenuProps={{
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
    marginThreshold: 10,
  }}
  displayEmpty
  name="country"
  value={country.value}
  onChange={e => {
    country.onChange(e);
    region.setValue('');
  }}
  >
  {countryList?.length > 0 &&
    countryList.map(item => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
*/
/*
// AutoComplete
<Autocomplete
  freeSolo
  id="email"
  value={email.value}
  onChange={(e, newVal) => email.setValue(newVal)}
  options={resentLoginList?.length > 0 ? resentLoginList.map(option => option) : []}
  renderInput={params => (
    <MuiWrapper>
      <TextField
        {...params}
        id="email"
        name="email"
        variant="outlined"
        fullWidth
        autoComplete="off"
        onChange={email.onChange}
      />
    </MuiWrapper>
  )}
/>
*/
