import Color from 'color';
import { css } from 'styled-components';
import { _color, _deviceSize, _font } from 'styles/_variables';

export const fontFamilyValue = `${_font.roboto}, ${_font.notoSans}`;
// export const fontFamilyValue = `${_font.opensans}, ${_font.notoSans}`;
export const fontFamily = css`
  font-family: ${fontFamilyValue};
`;
export const robotoFont = `${_font.roboto}, ${_font.notoSans}`;
export const opensansFont = `${_font.opensans}, ${_font.notoSans}`;

export const color = _color;
export const device = _deviceSize;

export const theme = {
  color: {
    primary: _color.blue, // 주 색상
    secondary: _color.navy_blue, // 부 색상
    // white: '#fff',
    // gray: '#ccc',
    blackFont: _color.black_font, // 기본 문자 색상
    error: _color.red, // 오류 색상
  },
  gradient: {
    primary: `linear-gradient(90deg, rgba(0, 166, 226, 1) 0%, rgba(8, 123, 238, 1) 100%);`,
  },
  device: {
    mobile: `screen and (max-width: ${_deviceSize.sm} - 1)`, // 600 down
    tablet: `screen and (min-width: ${_deviceSize.sm}) and (max-width: ${_deviceSize.lg} - 1)`, // 600 ~ 1280
    laptop: `screen and (min-width: ${_deviceSize.lg})`, // 1280 up
  },
};

// TODO: 변경 테마 적용시 기본 테마에 변경되는 사항 적용
export const lightTheme = {
  ...theme,
  // color: {
  //   ...theme.color,
  //   primary: _color.blue,
  // },
  header: {
    bgColor: 'white',
    fontColor: _color.black_font,
  },
};

export const darkTheme = {
  ...theme,
  color: {
    ...theme.color,
    primary: 'white',
  },
  header: {
    bgColor: _color.navy_blue,
    fontColor: 'white',
  },
};

export const primaryGradient = deg => {
  return css`
    background: ${_color.blue};
    background: ${`linear-gradient(${deg}deg, rgba(0, 166, 226, 1) 0%, rgba(8, 123, 238, 1) 100%)`};
  `;
};

export const floatClear = css`
  &:after {
    content: '';
    display: block;
    clear: both;
  }
`;

export const positionCenterCenter = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const positionWidthCenter = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const positionHeightCenter = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;
export const positionWide = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// font-size, color 두개 다 사용할 경우
export const font = (size = 14, color = 'black') => {
  return css`
    color: ${color};
    font-size: ${size}px;
    /* ${fontFamily}; */
    /* @content; */
  `;
};

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const flexAlignItemsCenter = css`
  display: flex;
  align-items: center;
`;
export const flexJustifyContentCenter = css`
  display: flex;
  justify-content: center;
`;
export const InlineflexCenter = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
export const InlineflexAlignItemsCenter = css`
  display: inline-flex;
  align-items: center;
`;
export const InlineflexJustifyContentCenter = css`
  display: flex;
  justify-content: center;
`;

/* border-radius:3px; */
export const buttonBlue = css`
  ${InlineflexCenter};
  background: ${color.blue};
  transition: 0.3s;
  border: 1px solid ${color.blue};
  padding: 5px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  transition: background-color 0.25s;
  &:hover {
    background: ${Color(color.blue).darken(0.12)};
  }
  &:disabled {
    color: rgb(118, 118, 118, 0.5);
    background: rgba(118, 118, 118, 0.2);
    border-color: rgba(118, 118, 118, 0.1);
    cursor: initial;
  }
`;

export const outlinedButtonBlue = css`
  ${InlineflexCenter};
  background: ${color.white};
  transition: 0.3s;
  border: 1px solid ${color.blue};
  padding: 5px 15px;
  cursor: pointer;
  font-size: 16px;
  color: ${color.blue};
`;

export const buttonGray = css`
  ${InlineflexCenter};
  background: ${color.btn_gray};
  transition: 0.3s;
  border: 1px solid ${color.btn_gray};
  padding: 5px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  transition: background-color 0.25s;
  &:hover {
    background: ${color.btn_gray};
  }
`;

export const buttonNavy = css`
  ${InlineflexCenter};
  background: ${color.navy};
  transition: 0.3s;
  border: 1px solid ${color.navy};
  padding: 5px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  transition: background-color 0.25s;
  &:hover {
    background: ${Color(color.navy).darken(0.12)};
  }
`;

export const buttonLightPink = css`
  ${InlineflexCenter};
  background: ${color.lightPink};
  transition: 0.3s;
  border: 1px solid ${color.lightPink};
  padding: 5px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  transition: background-color 0.25s;
  &:hover {
    background: ${Color(color.lightPink).darken(0.12)};
  }
`;

export const buttonWhite = css`
  ${InlineflexCenter};
  background: ${color.white};
  transition: 0.3s;
  border: 1px solid ${color.blue};
  padding: 5px 15px;
  /* text-transform: uppercase; */
  cursor: pointer;
  font-size: 16px;
  color: ${color.blue};
  transition: background-color 0.25s;
  &:hover {
    background: ${Color(color.white).darken(0.12)};
  }
`;

export const dotdotdot = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const disableDrag = css`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const checkboxBlue = css`
  /* color: ${color.blue}; */
  .MuiCheckbox-colorPrimary.Mui-checked {
    color: ${color.blue};
  }
  &:hover {
    /* color: ${color.blue}; */
    background: rgba(0, 0, 0, 0.1);
  }
`;
export const checkboxBlueStyled = css`
  &.MuiCheckbox-colorSecondary.Mui-checked {
    color: ${color.blue};
  }
  &.MuiIconButton-colorSecondary:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &.MuiCheckbox-colorSecondary.Mui-checked:hover {
    background: #61b1e63a;
  }
`;

// export const _media = Object.keys(_sizes).reduce((acc, label) => {
//   acc[label] = (...args) => css`
//     @media (max-width: ${_sizes[label] / 16}em) {
//       ${css(...args)}
//     }
//   `;

//   return acc;
// }, {});

// Mui Color Custom
export const muiOutlinedInputFocus = (color = _color.blue) => {
  return css`
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${color};
    }
  `;
};
export const muiOutlinedInputError = (color = _color.red) => {
  return css`
    .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline {
      border-color: ${color};
    }
  `;
};

// NOTE: 상위요소에 div하나로 감싸야하고, height가 있어야함
export const animationProgress = config => {
  const { color = '#1a90ff', width } = config;
  // width가 있거나 trasform을 -10%로 하면 왼쪽으로 넘어감, 즉 90%게이지가 찾다는소리
  return css`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    color: #fff;
    text-align: center;
    background-color: ${color};
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
    transition: width 0.4s linear, transform 3s linear;
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 40px 40px;
    animation: progress-bar-stripes 1s linear infinite;

    @keyframes progress-bar-stripes {
      0% {
        background-position: 40px 0;
      }
      100% {
        background-position: 0 0;
      }
    }
  `;
};

export const animationMoveInfinite = config => {
  const { color = '#1a90ff', width } = config;
  // width가 있거나 trasform을 -10%로 하면 왼쪽으로 넘어감, 즉 90%게이지가 찾다는소리
  return css`
    position: relative;
    animation: ani-move 1s linear infinite alternate;
    @keyframes ani-move {
      0% {
        top: 0px;
      }
      100% {
        top: 5px;
      }
    }
  `;
};

// default : width + marginRight = 60
export const beforeDash = ({
  width = 45,
  height = 4,
  marginRight = 15,
  backgroundColor = _color.blue,
  fontSize = 22,
}) => {
  return css`
    display: flex;
    align-items: center;
    font-size: ${`${fontSize}px`};
    color: ${color.navy_blue};
    font-weight: 500;
    &:before {
      content: '';
      width: ${`${width}px`};
      height: ${`${height}px`};
      margin-right: ${`${marginRight}px`};
      background-color: ${backgroundColor};
    }
  `;
};

export const paper = css`
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  /* box-shadow: 0px 0px 10px #000629; */
  /* box-shadow: 0 0 10px rgba(0, 6, 41, 0.13); */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.13);
  padding: 40px 0;
  &:not(:first-of-type) {
    margin-top: 20px;
  }
`;

export const paperSubtitle = css`
  ${beforeDash({})};
  padding-bottom: 40px;
`;
