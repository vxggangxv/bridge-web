import Button from '@material-ui/core/Button';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import cx from 'classnames';
import Color from 'color';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { color, fontFamilyValue } from 'styles/utils';
import { _color } from 'styles/_variables';

const StartIcon = styled.span`
  margin-left: ${({ width, iconMarginAlign }) => `-${width + iconMarginAlign}px`};
  margin-right: ${({ iconMarginAlign }) => iconMarginAlign && `${iconMarginAlign}px`};
`;

const EndIcon = styled.span`
  margin-left: ${({ iconMarginAlign }) => iconMarginAlign && `${iconMarginAlign}px`};
  margin-right: ${({ width, iconMarginAlign }) => `-${width + iconMarginAlign}px`};
`;

/*
 * <MuiButton
 *    disableElevation
 *    variant="contained"
 *    color="primary"
 *    config={{ color: color.navy }}
 *    className="checkout__btn"
 *  >
 *    버튼
 * </MuiButton>
 */
/**
 * @param {boolean} disableElevation : 뜨는 효과 삭제
 * @param {string} variant : contained(색상버튼), outlined(border버튼)
 * @param {string} color : primary색상(적용), HEX 타입, contained, outlined variant에 영항, outlined 일 경우 배경이 흰색이 아닐경우라면 color값만 줘도 자동 적용, disabled시 white적용을 위해선 값을 주지 말아야한다
 * @param {string} bgColor : outlined 버튼 색상(적용), HEX 타입, outlined variant에 영항, outlined일 경우 배경이 흰색일 경우 bgColor '#fff' 값 적용 필요
 * @param {string} borderColor : outlined 버튼 색상(적용), HEX 타입, outlined variant에 영항, outlined일 경우 color 값 적용을 하지 않을 경우, borderColor 적용
 * @param {string} fontColor : font색상(적용)
 * @param {object} config : config옵션
 * @param {string} className : button 클래스 적용
 * @param {element} endIcon : Mui에 적용되는 endIcon 적용시 사용 / 텍스트 중앙용 custom endIcon은 config안에 전달
 * 기존 palette 컬러 사용시 color="name" 맞혀서 적용, 커스텀 컬러 사용시 config={{ color: 적용컬러 }} 적용
 */
export default React.memo(function MuiButton(props) {
  const startIconRef = useRef();
  const [startIconWidth, setStartIconWidth] = useState(0);
  const endIconRef = useRef();
  const [endIconWidth, setEndIconWidth] = useState(0);
  const { children = null, fullWidth = false, className = '', config = {} } = props;
  // mui error를 피하기 위해 분류
  const muiProps = {
    ...props,
  };
  delete muiProps.config;
  const {
    minWidth,
    height,
    width,
    color, // 배경 색
    bgColor, // 배경색 여부, oulined의 hover되는 배경색에 영향 e.g. outlined
    borderColor,
    fontColor,
    fontSize,
    borderWidth,
    borderRadius,
    wrapperClassName = '', // TODO: 제거 예정
    startIcon = null,
    endIcon = null,
    iconMarginAlign = 0, // 아이콘 등록시 좌우 당김
    disableBackground = '', // disabled background-color
    disableFontColor = '', // disabled font color
  } = config;

  const primaryColor = color ? color : _color.blue;
  const primaryFontColor = fontColor ? fontColor : '#fff';
  config.primaryColor = primaryColor;
  config.primaryFontColor = primaryFontColor;
  config.fullWidth = props.fullWidth;
  // console.log(config, 'config');

  // memoizaion을 위한 dependency array
  // const childrenProps = Object.keys(muiProps).reduce((acc, curr) => {
  //   return acc.concat(children.props[curr]);
  // }, []);

  const dataType = props['data-type'];
  // radio, size 영향을 받게 하기 위해 prop여부 확인
  const isChangeSize = dataType === 'radio' || !!props.size;

  // console.log(props['data-type'], 'props.dataType');

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: _color.blue,
        contrastText: '#fff',
      },
      secondary: {
        main: _color.navy_blue,
        contrastText: '#fff',
      },
      // secondary: {
      //   main: color ? color : '#11cb5f',
      //   contrastText: '#fff',
      // },
    },
    typography: {
      fontFamily: fontFamilyValue,
    },
    props: {
      // Styled Component로 변경 하여 사용 불가 에러메시지
      MuiButtonBase: {
        // disableRipple: true,
        // disableElevation: true,
      },
    },
  });

  /* 
  * 색상 적용 예시
  * muiButton Error는 무시
  theme.palette.red = theme.palette.augmentColor({
    main: _color.red,
    main: '#fff',
  });

  const isSuccessOutlined = style => props =>
    props.color === 'red' && props.variant === 'contained' ? style : {};

  theme.overrides = {
    MuiButton: {
      root: {
        color: isSuccessOutlined(theme.palette.red.contrastText),
        backgroundColor: isSuccessOutlined(theme.palette.red.main),
        '&:hover': {
          backgroundColor: isSuccessOutlined(theme.palette.red.dark),
        },
      },
    },
  };
  */

  // custom button error
  theme.palette.error = theme.palette.augmentColor({
    main: _color.red,
  });

  const isSuccessOutlined = style => props =>
    props.color === 'red' && props.variant === 'outlined' ? style : {};

  theme.overrides = {
    MuiButton: {
      root: {
        color: isSuccessOutlined(theme.palette.error.main),
        borderColor: isSuccessOutlined(`${theme.palette.error.main} !important`),
        backgroundColor: isSuccessOutlined('#fff'),
        '&:hover': {
          backgroundColor: isSuccessOutlined(`${Color(theme.palette.error.main).alpha(0.04)}`),
        },
      },
    },
  };

  // SECTION: init set icon width
  useEffect(() => {
    if (startIconRef.current) {
      setStartIconWidth(startIconRef.current.clientWidth);
    }
    if (endIconRef.current) {
      setEndIconWidth(endIconRef.current.clientWidth);
    }
  }, [startIconRef.current, endIconRef.current]);

  return (
    <ThemeProvider theme={theme}>
      <Styled.MuiButton
        data-component-name="MuiButton"
        {...muiProps}
        config={config}
        className={cx(`button ${className}`, { size: isChangeSize, label: dataType === 'label' })}
      >
        {startIcon && (
          <StartIcon
            className="button__icon start_icon"
            width={startIconWidth}
            iconMarginAlign={iconMarginAlign}
            ref={startIconRef}
          >
            {startIcon}
          </StartIcon>
        )}
        {children}
        {endIcon && (
          <EndIcon
            className="button__icon end_icon"
            width={endIconWidth}
            iconMarginAlign={iconMarginAlign}
            ref={endIconRef}
          >
            {endIcon}
          </EndIcon>
        )}
        {/* {useMemo(() => ({ children }), [...childrenProps])} */}
      </Styled.MuiButton>
    </ThemeProvider>
  );
});

const Styled = {
  MuiButton: styled(Button)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    // width apply
    min-width: ${({ config }) =>
      config.minWidth && typeof config.minWidth === 'string'
        ? config.minWidth
        : config.minWidth && config.minWidth + 'px'};
    width: ${({ config }) =>
      config.width && typeof config.width === 'string'
        ? config.width
        : config.width && config.width + 'px'};
    border-radius: ${({ config }) => (config.borderRadius ? config.borderRadius : 5)}px;
    font-weight: inherit;
    &:not(.size) {
      // height apply, default height: 40px
      height: 40px;
      height: ${({ config }) =>
        config.height && typeof config.height === 'string'
          ? config.height
          : config.height && config.height + 'px'};
      // width, fullWidth 있을 경우 padding: 0
      padding: ${({ config }) => (config.width || config.fullWidth ? 0 : `0px 16px`)};
      font-size: ${({ config }) => (config.fontSize ? config.fontSize : '14px')};
    }
    &.label {
      .MuiButton-label > label,
      .MuiButton-label {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }
    // Mui color change
    &.MuiButton-contained:not(.MuiButton-containedPrimary):not(.MuiButton-containedSecondary) {
      background-color: ${({ config }) => config.primaryColor};
      border: 1px solid transparent;
      color: ${({ config }) => config.primaryFontColor};
    }
    &.MuiButton-contained:not(.MuiButton-containedPrimary):not(.MuiButton-containedSecondary):hover {
      background-color: ${({ config }) => Color(config.primaryColor).darken(0.12)};
    }
    &.MuiButton-outlined:not(.MuiButton-outlinedPrimary):not(.MuiButton-outlinedSecondary) {
      background-color: ${({ config }) => (config.bgColor ? config.bgColor : 'transparent')};
    }
    &.MuiButton-outlined:not(.MuiButton-outlinedPrimary):not(.MuiButton-outlinedSecondary),
    &.MuiButtonGroup-groupedOutlined:hover {
      border-color: ${({ config }) =>
        config.borderColor ? config.borderColor : config.primaryColor};
      color: ${({ config }) => (config.borderColor ? config.borderColor : config.primaryColor)};
    }
    &.MuiButton-outlined:not(.MuiButton-outlinedPrimary):not(.MuiButton-outlinedSecondary):hover {
      background-color: ${({ config }) =>
        ['white', '#fff', '#ffffff'].includes(config.bgColor)
          ? Color('black').alpha(0.02)
          : config.bgColor
          ? Color(config.bgColor).alpha(0.04)
          : Color(config.primaryColor).alpha(0.04)};
    }
    &.MuiButton-contained.Mui-disabled {
      /* color: rgba(0, 0, 0, 0.26); */
      /* box-shadow: none; */
      /* background-color: ${color.btn_disabled} !important; */
      background-color: ${({ config }) =>
        !!config.disableBackground ? config.disableBackground : color.btn_disabled} !important;
      color: ${({ config }) =>
        !!config.disableFontColor ? config.disableFontColor : color.btn_disabled_text} !important;
    }

    .xs,
    .sm {
      min-width: initial;
    }
    .button__icon {
      line-height: 0;
      /* &.start_icon {
        margin-left: ${({ config }) => config.iconMarginAlign && `-${config.iconMarginAlign}px`};
        margin-right: ${({ config }) => config.iconMarginAlign && `${config.iconMarginAlign}px`};
      }
      &.end_icon {
        margin-left: ${({ config }) => config.iconMarginAlign && `${config.iconMarginAlign}px`};
        margin-right: ${({ config }) => config.iconMarginAlign && `-${config.iconMarginAlign}px`};
      } */
    }

    // add custom style
    &.inset-shadow-default,
    &.inset-shadow-default:hover {
      box-shadow: inset 3px 3px 6px rgb(0, 0, 0, 0.16) !important;
      &.xs,
      &.sm {
        box-shadow: inset 3px 3px 2px rgb(0, 0, 0, 0.16) !important;
      }
    }
    &.border-radius-round {
      &.xs {
        border-radius: 12px;
      }
      &.sm {
        border-radius: 15px;
      }
      &.md {
        border-radius: 20px;
      }
      &.lg {
        border-radius: 25px;
      }
      &.xl {
        border-radius: 30px;
      }
      &.MuiButtonGroup-groupedHorizontal:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      &.MuiButtonGroup-groupedHorizontal:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    &.xs {
      min-width: initial;
      height: 24px;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 300;
    }
    &.sm {
      min-width: initial;
      /* height: 30px; */
      height: 34px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 300;
    }
    &.md {
      min-width: initial;
      height: 40px;
      padding: 0 10px;
      font-size: 14px;
    }
    &.lg {
      min-width: initial;
      height: 46px;
      /* height: 50px; */
      padding: 0 10px;
      font-size: 16px;
      /* font-size: 18px; */
    }
    &.xl {
      min-width: initial;
      height: 56px;
      padding: 0 10px;
      font-size: 18px;
    }
    // class를 이용한 색상 적용, ex) button group
    &.active {
      color: #fff !important;
      background-color: ${({ config }) => config.primaryColor} !important;
      border-color: ${({ config }) => config.primaryColor} !important;
    }
    &.outline {
      color: ${color.gray_font};
      background-color: #fff;
      border-color: ${color.gray_border};
    }
    &.radius-no {
      border-radius: 0;
    }
    /* &.radius-sm {
      border-radius: 3px;
    }
    &.radius-md {
      border-radius: 5px;
    } */
    &.MuiButton-root {
      text-transform: initial;
      line-height: initial;
    }
  `,
};

// background-color: ${({ config }) => config.color && `${config.color} !important`};
// color: ${({ config }) => config.fontColor && `${config.fontColor} !important`};
