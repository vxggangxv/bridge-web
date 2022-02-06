import { css } from 'styled-components';
import Color from 'color';

const purpleBgGradient = `linear-gradient(180deg, #EBEFFF 0%, #FFFFFF 48.96%, #EBEFFF 99.99%);`;
const scannerBgGradient = `linear-gradient(0deg, rgba(255, 255, 255, 0) 11.49%, rgba(255, 254, 250, 0.0128372) 12.05%, rgba(65, 244, 255, 0.1372) 17.48%, rgba(65, 244, 255, 0.26) 23.07%, rgba(65, 244, 255, 0.4) 28.76%, rgba(65, 244, 255, 0.5) 34.55%, rgba(65, 244, 255, 0.66) 40.51%, rgba(65, 244, 255, 0.85) 46.73%, #41F4FF 127.1%);`;
const timeLineBgGradient = `linear-gradient(90deg, #00A6E2 0%, #5B86E5 100%);`;

// NOTE: 새로 작업시 재설정
export const _color = {
  // red: `#d20000`,
  red: `#d40000`,
  white: `#ffffff`,
  black_hover: `#1f1e4f`,
  purple: `#726aa6`,
  purple_hover: `#5a509a`,
  purple_weak: `#f5f7ff`,
  purple_bg: `#f8f9ff`,
  purple_deep: `#353147`,
  green: `#309687`,
  green_hover: `#229987`,
  green_deep: `#00884f`,
  // blue2: `#1da7e0`,
  // blue: `#00a6e2`,
  blue: `#00A6E2`,
  blue_week: `#69c9ee`,
  blue_hover: `#059cd2`,
  // navy_blue: `#17288b`,
  navy_blue: `#00155E`,
  navy_blue_deep: `#00155E`,
  navy: `#26256f`,
  navy_hover: `#1a194d`,
  navy_deep: `#1e1d5e`,
  // yellow: `#fec600`,
  yellow: `#ffc632`,
  red_alert: `#be0000`,
  red_alert1: `#d20000`,
  red_icon: `#ea8484`,
  black_font: `#333333`,
  black_title: '#313136',
  black_font1: `#000`,
  purple_hoverbg: `rgba(224, 222, 236, 0.3)`,
  // gray_text: `#666666`,
  gray_da: '#dddee4',
  gray_b5: '#b5b7c1',
  // gray font
  gray_font: `#555555`,
  gray_font2: `#bcbcbc`,
  gray_week_font: `#9f9f9f`,
  gray_placeholder: `#cacaca`,
  gray_deep_week: `#eeeeee`,
  gray_bg: `#f5f5f5`,
  gray_bg1: `#f4f4f4`,
  gray_bg1_hover: `#e4e4e4`,
  gray_bg2: `#dddddd`,
  gray_bg3: `#a4a4a4`,
  gray_border: `#bababa`,
  gray_border2: `#e2e7ea`,
  gray_border3: `#dddddd`,
  gray_border4: `#cccccc`,
  gray_dashboard: `#fafafa`,
  gray_meterial: `#50575a`,
  // gray_bc: `#bcbcbc`,
  // gray_table: `#bfc9ce`,
  gray_table: `#fbfbfb`,
  gray_icon: `#c6cbcd`,
  window_bg: `#353147`,
  // blue_week: `#9dc7e0`,
  // blue_week_hover: `#f8fcfe`,
  blue_week: `#f0f7fb`,
  blue_week_hover: Color('#f0f7fb').alpha(0.5),
  blue_font: `#47a7df`,
  blue_line_bg: `#f0f7fb`,
  blue_cloud: `#5185d3`,
  btn_color: '#98b8cb',
  btn_color_hover: '#89abbf',
  complete_btn: `#8938af`,
  complete_btn_hover: `#75259a`,
  purple_bg_gradient: purpleBgGradient,
  scanner_gradient: scannerBgGradient,
  time_line_bg_gradient: timeLineBgGradient,
  //
  btn_disabled: '#A6A8B1',
  btn_disabled_text: '#cdd0d9',
  //
  // stage_waiting: '#ff7146',
  // stage_matching: '#ea519a',
  // stage_working: '#00884f',
  // stage_done: '#3a7ee5',
  // stage_complete: '#75229b',
  stage_waiting: '#ffc400',
  stage_matching: '#0fdc0f',
  stage_working: '#05abe9',
  stage_done: '#000000',
  stage_design: '#05abe9',
  stage_complete: '#000000',
  // stage_complete: '#9a00e5',
  // stage_waiting_designer : '#ffc400',
  stage_matching_designer: '#05e994',
  stage_working_designer: '#05d9e9',
  stage_done_designer: '#676767',
  stage_complete_designer: '#dc00b8',
  // client, designer, admin color
  client_color: '#f3cb00',
  designer_color: '#04d8f1',
  admin_color: '#6204f1',
};

export const _deviceSize = {
  xl: 1920,
  // lg: 1460,
  lg: 1300,
  lgPadding: 10,
  md: 960,
  sm: 600,
  xs: 0,
};

export const _theme = {
  color: {
    primary: _color.blue, // 주 색상
    // secondary: ,  // 부 색상
    white: '#fff',
    gray: '#ccc',
    default: _color.black_font, // 기본 문자 색상
    error: _color.red, // 오류 색상
  },
};

export const _font = {
  notoSans: `"Noto Sans KR", sans-serif`,
  mulish: `"Mulish"`,
  roboto: `"Roboto"`,
  opensans: `"Open Sans"`,
};

// TEST:
export const responsive = {
  lgMore: `@media (min-width: ${_deviceSize.lg}px)`,
  mdMoreAndLess: `@media (min-width: ${_deviceSize.md}px) and (max-width: ${_deviceSize.lg - 1}px)`,
};
