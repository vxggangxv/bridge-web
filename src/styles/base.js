import { css, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { fontFamilyValue, fontFamily, disableDrag, device, color } from 'styles/utils';
import { ENV_MODE_PROD } from 'lib/setting';

const globalStyle = css`
  ${reset};
  * {
    box-sizing: border-box !important;
    /* ${ENV_MODE_PROD && disableDrag} */
  }
  *[tabIndex],
  input,
  textarea,
  select,
  a,
  button {
    outline: none;
    box-shadow: none;
  }
  input,
  textarea {
    font-family: ${fontFamilyValue} !important;
  }
  b {
    font-weight: 700;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  body {
    ${fontFamily}
    /* font-size: 14px; */
    color: #333;
  }
  /* set width, height 100% */
  body,
  #root {
    /* position: absolute;
    min-width: 100%;
    min-height: 100%; */
  }
  .hidden {
    display: none !important;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    padding: 0;
    margin: -1px;
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
  }
  .cf:after {
    content: '';
    display: table;
    clear: both;
  }
  .padding-none {
    padding: 0 !important;
  }
  .margin-none {
    margin: 0 !important;
  }
  .cursor-pointer {
    cursor: pointer !important;
    user-select: none;
  }
  .cursor-default {
    cursor: default !important;
  }
  .input-reset,
  .btn-reset {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: #333;
  }
  .btn-reset {
    cursor: pointer;
  }
  .hr-reset {
    margin: 0;
    border: 0;
  }
  .font-italic {
    font-style: italic;
  }
  button:disabled {
    color: rgba(0, 0, 0, 0.26);
    cursor: default;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inline-flex-center {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  /* custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    transition: width 0.3s;
  }
  ::-webkit-scrollbar-track {
    &:hover {
      background-color: #f4f5fa;
    }
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    &:hover {
      /* background-color: rgba(0, 0, 0, 0.6); */
    }
  }
  .main-layout {
    position: relative;
    width: ${`${device.lg}px`};
    padding: 0 ${`${device.lgPadding}px`};
    /* width: 1200px; */
    margin: 0 auto;
  }
  .sub-layout {
    position: relative;
    width: 1020px;
    margin: 0 auto;
  }
  .radius-circle {
    border-radius: 50%;
  }
  .box-shadow-default {
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  }
  // inset btn shadow
  .btn-inset-shadow-default {
    box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.16);
  }
  .text-overflow-ellipis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  // Mui Global styles
  // MuiGrid-item
  .MuiGrid-item {
    word-break: break-word;
  }
  // .MuiTypography-root[class*='MuiTypography-body'] {}
  .MuiPopover-root .MuiList-root .MuiMenuItem-root,
  .MuiTableCell-root.MuiTableCell-head,
  .MuiTableCell-root.MuiTableCell-body {
    font-family: ${fontFamilyValue};
    font-size: 14px;
  }
  .MuiTableCell-root.MuiTableCell-head,
  .MuiTableCell-root.MuiTableCell-body {
    color: ${color.black_font};
    border-bottom-color: ${color.gray_border2};
  }
  /* .button[data-component-name='MuiButton'] {
    &.xs {
      height: 24px;
      padding: 0 8px;
    }
    &.sm {
      height: 34px;
      padding: 0 10px;
    }
    &.lg {
      height: 50px;
      font-size: 18px;
    }
    &.active {
      color: #fff;
      background-color: ${color.blue};
      border-color: ${color.blue};
    }
    &.outline {
      color: ${color.gray_font};
      background-color: #fff;
      border-color: ${color.gray_border};
    }
    &.radius-no {
      border-radius: 0;
    }
    &.radius-sm {
      border-radius: 3px;
    }
    &.radius-md {
      border-radius: 5px;
    }
    &.MuiButton-root {
      text-transform: initial;
      line-height: initial;
    }
  } */
`;

export default createGlobalStyle`
  ${globalStyle}
`;
