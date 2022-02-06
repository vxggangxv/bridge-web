import { css } from 'styled-components';

/*
 * antd v4.1.1
 * ant-picker.
 */
const antPicker = css`
  html,
  body {
    width: 100%;
    height: 100%;
  }
  input::-ms-clear,
  input::-ms-reveal {
    display: none;
  }
  *,
  *::before,
  *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  html {
    font-family: sans-serif;
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -ms-overflow-style: scrollbar;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  article,
  aside,
  dialog,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  nav,
  section {
    display: block;
  }
  body {
    margin: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji';
    font-variant: tabular-nums;
    line-height: 1.5715;
    background-color: #fff;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum', 'tnum';
  }
  [tabindex='-1']:focus {
    outline: none !important;
  }
  hr {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 0.5em;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
  p {
    margin-top: 0;
    margin-bottom: 1em;
  }
  abbr[title],
  abbr[data-original-title] {
    text-decoration: underline;
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
    border-bottom: 0;
    cursor: help;
  }
  address {
    margin-bottom: 1em;
    font-style: normal;
    line-height: inherit;
  }
  input[type='text'],
  input[type='password'],
  input[type='number'],
  textarea {
    -webkit-appearance: none;
  }
  ol,
  ul,
  dl {
    margin-top: 0;
    margin-bottom: 1em;
  }
  ol ol,
  ul ul,
  ol ul,
  ul ol {
    margin-bottom: 0;
  }
  dt {
    font-weight: 500;
  }
  dd {
    margin-bottom: 0.5em;
    margin-left: 0;
  }
  blockquote {
    margin: 0 0 1em;
  }
  dfn {
    font-style: italic;
  }
  b,
  strong {
    font-weight: bolder;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    position: relative;
    font-size: 75%;
    line-height: 0;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  a {
    color: #1890ff;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    -webkit-transition: color 0.3s;
    transition: color 0.3s;
    -webkit-text-decoration-skip: objects;
  }
  a:hover {
    color: #40a9ff;
  }
  a:active {
    color: #096dd9;
  }
  a:active,
  a:hover {
    text-decoration: none;
    outline: 0;
  }
  a:focus {
    text-decoration: none;
    outline: 0;
  }
  a[disabled] {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
    pointer-events: none;
  }
  pre,
  code,
  kbd,
  samp {
    font-size: 1em;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }
  pre {
    margin-top: 0;
    margin-bottom: 1em;
    overflow: auto;
  }
  figure {
    margin: 0 0 1em;
  }
  img {
    vertical-align: middle;
    border-style: none;
  }
  svg:not(:root) {
    overflow: hidden;
  }
  a,
  area,
  button,
  [role='button'],
  input:not([type='range']),
  label,
  select,
  summary,
  textarea {
    -ms-touch-action: manipulation;
    touch-action: manipulation;
  }
  table {
    border-collapse: collapse;
  }
  caption {
    padding-top: 0.75em;
    padding-bottom: 0.3em;
    color: rgba(0, 0, 0, 0.45);
    text-align: left;
    caption-side: bottom;
  }
  th {
    text-align: inherit;
  }
  input,
  button,
  select,
  optgroup,
  textarea {
    margin: 0;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
  }
  button,
  input {
    overflow: visible;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  html [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button;
  }
  button::-moz-focus-inner,
  [type='button']::-moz-focus-inner,
  [type='reset']::-moz-focus-inner,
  [type='submit']::-moz-focus-inner {
    padding: 0;
    border-style: none;
  }
  input[type='radio'],
  input[type='checkbox'] {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
  }
  input[type='date'],
  input[type='time'],
  input[type='datetime-local'],
  input[type='month'] {
    -webkit-appearance: listbox;
  }
  textarea {
    overflow: auto;
    resize: vertical;
  }
  fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  legend {
    display: block;
    width: 100%;
    max-width: 100%;
    margin-bottom: 0.5em;
    padding: 0;
    color: inherit;
    font-size: 1.5em;
    line-height: inherit;
    white-space: normal;
  }
  progress {
    vertical-align: baseline;
  }
  [type='number']::-webkit-inner-spin-button,
  [type='number']::-webkit-outer-spin-button {
    height: auto;
  }
  [type='search'] {
    outline-offset: -2px;
    -webkit-appearance: none;
  }
  [type='search']::-webkit-search-cancel-button,
  [type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    font: inherit;
    -webkit-appearance: button;
  }
  output {
    display: inline-block;
  }
  summary {
    display: list-item;
  }
  template {
    display: none;
  }
  [hidden] {
    display: none !important;
  }
  mark {
    padding: 0.2em;
    background-color: #feffe6;
  }
  ::-moz-selection {
    color: #fff;
    background: #1890ff;
  }
  ::selection {
    color: #fff;
    background: #1890ff;
  }
  .clearfix::before {
    display: table;
    content: '';
  }
  .clearfix::after {
    display: table;
    clear: both;
    content: '';
  }
  .anticon {
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .anticon > * {
    line-height: 1;
  }
  .anticon svg {
    display: inline-block;
  }
  .anticon::before {
    display: none;
  }
  .anticon .anticon-icon {
    display: block;
  }
  .anticon[tabindex] {
    cursor: pointer;
  }
  .anticon-spin::before {
    display: inline-block;
    -webkit-animation: loadingCircle 1s infinite linear;
    animation: loadingCircle 1s infinite linear;
  }
  .anticon-spin {
    display: inline-block;
    -webkit-animation: loadingCircle 1s infinite linear;
    animation: loadingCircle 1s infinite linear;
  }
  .fade-enter,
  .fade-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .fade-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .fade-enter.fade-enter-active,
  .fade-appear.fade-appear-active {
    -webkit-animation-name: antFadeIn;
    animation-name: antFadeIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .fade-leave.fade-leave-active {
    -webkit-animation-name: antFadeOut;
    animation-name: antFadeOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .fade-enter,
  .fade-appear {
    opacity: 0;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
  }
  .fade-leave {
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
  }
  @-webkit-keyframes antFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes antFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @-webkit-keyframes antFadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes antFadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .move-up-enter,
  .move-up-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-up-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-up-enter.move-up-enter-active,
  .move-up-appear.move-up-appear-active {
    -webkit-animation-name: antMoveUpIn;
    animation-name: antMoveUpIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .move-up-leave.move-up-leave-active {
    -webkit-animation-name: antMoveUpOut;
    animation-name: antMoveUpOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .move-up-enter,
  .move-up-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .move-up-leave {
    -webkit-animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
    animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
  }
  .move-down-enter,
  .move-down-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-down-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-down-enter.move-down-enter-active,
  .move-down-appear.move-down-appear-active {
    -webkit-animation-name: antMoveDownIn;
    animation-name: antMoveDownIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .move-down-leave.move-down-leave-active {
    -webkit-animation-name: antMoveDownOut;
    animation-name: antMoveDownOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .move-down-enter,
  .move-down-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .move-down-leave {
    -webkit-animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
    animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
  }
  .move-left-enter,
  .move-left-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-left-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-left-enter.move-left-enter-active,
  .move-left-appear.move-left-appear-active {
    -webkit-animation-name: antMoveLeftIn;
    animation-name: antMoveLeftIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .move-left-leave.move-left-leave-active {
    -webkit-animation-name: antMoveLeftOut;
    animation-name: antMoveLeftOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .move-left-enter,
  .move-left-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .move-left-leave {
    -webkit-animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
    animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
  }
  .move-right-enter,
  .move-right-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-right-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .move-right-enter.move-right-enter-active,
  .move-right-appear.move-right-appear-active {
    -webkit-animation-name: antMoveRightIn;
    animation-name: antMoveRightIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .move-right-leave.move-right-leave-active {
    -webkit-animation-name: antMoveRightOut;
    animation-name: antMoveRightOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .move-right-enter,
  .move-right-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .move-right-leave {
    -webkit-animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
    animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
  }
  @-webkit-keyframes antMoveDownIn {
    0% {
      -webkit-transform: translateY(100%);
      transform: translateY(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @keyframes antMoveDownIn {
    0% {
      -webkit-transform: translateY(100%);
      transform: translateY(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @-webkit-keyframes antMoveDownOut {
    0% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(100%);
      transform: translateY(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @keyframes antMoveDownOut {
    0% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(100%);
      transform: translateY(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @-webkit-keyframes antMoveLeftIn {
    0% {
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @keyframes antMoveLeftIn {
    0% {
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @-webkit-keyframes antMoveLeftOut {
    0% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @keyframes antMoveLeftOut {
    0% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @-webkit-keyframes antMoveRightIn {
    0% {
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @keyframes antMoveRightIn {
    0% {
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @-webkit-keyframes antMoveRightOut {
    0% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @keyframes antMoveRightOut {
    0% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @-webkit-keyframes antMoveUpIn {
    0% {
      -webkit-transform: translateY(-100%);
      transform: translateY(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @keyframes antMoveUpIn {
    0% {
      -webkit-transform: translateY(-100%);
      transform: translateY(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
  }
  @-webkit-keyframes antMoveUpOut {
    0% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-100%);
      transform: translateY(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @keyframes antMoveUpOut {
    0% {
      -webkit-transform: translateY(0%);
      transform: translateY(0%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-100%);
      transform: translateY(-100%);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      opacity: 0;
    }
  }
  @-webkit-keyframes loadingCircle {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes loadingCircle {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  [ant-click-animating='true'],
  [ant-click-animating-without-extra-node='true'] {
    position: relative;
  }
  html {
    --antd-wave-shadow-color: #1890ff;
    --scroll-bar: 0;
  }
  [ant-click-animating-without-extra-node='true']::after,
  .ant-click-animating-node {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    border-radius: inherit;
    -webkit-box-shadow: 0 0 0 0 #1890ff;
    box-shadow: 0 0 0 0 #1890ff;
    -webkit-box-shadow: 0 0 0 0 var(--antd-wave-shadow-color);
    box-shadow: 0 0 0 0 var(--antd-wave-shadow-color);
    opacity: 0.2;
    -webkit-animation: fadeEffect 2s cubic-bezier(0.08, 0.82, 0.17, 1),
      waveEffect 0.4s cubic-bezier(0.08, 0.82, 0.17, 1);
    animation: fadeEffect 2s cubic-bezier(0.08, 0.82, 0.17, 1),
      waveEffect 0.4s cubic-bezier(0.08, 0.82, 0.17, 1);
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    content: '';
    pointer-events: none;
  }
  @-webkit-keyframes waveEffect {
    100% {
      -webkit-box-shadow: 0 0 0 #1890ff;
      box-shadow: 0 0 0 #1890ff;
      -webkit-box-shadow: 0 0 0 6px var(--antd-wave-shadow-color);
      box-shadow: 0 0 0 6px var(--antd-wave-shadow-color);
    }
  }
  @keyframes waveEffect {
    100% {
      -webkit-box-shadow: 0 0 0 #1890ff;
      box-shadow: 0 0 0 #1890ff;
      -webkit-box-shadow: 0 0 0 6px var(--antd-wave-shadow-color);
      box-shadow: 0 0 0 6px var(--antd-wave-shadow-color);
    }
  }
  @-webkit-keyframes fadeEffect {
    100% {
      opacity: 0;
    }
  }
  @keyframes fadeEffect {
    100% {
      opacity: 0;
    }
  }
  .slide-up-enter,
  .slide-up-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-up-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-up-enter.slide-up-enter-active,
  .slide-up-appear.slide-up-appear-active {
    -webkit-animation-name: antSlideUpIn;
    animation-name: antSlideUpIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .slide-up-leave.slide-up-leave-active {
    -webkit-animation-name: antSlideUpOut;
    animation-name: antSlideUpOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .slide-up-enter,
  .slide-up-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }
  .slide-up-leave {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  .slide-down-enter,
  .slide-down-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-down-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-down-enter.slide-down-enter-active,
  .slide-down-appear.slide-down-appear-active {
    -webkit-animation-name: antSlideDownIn;
    animation-name: antSlideDownIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .slide-down-leave.slide-down-leave-active {
    -webkit-animation-name: antSlideDownOut;
    animation-name: antSlideDownOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .slide-down-enter,
  .slide-down-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }
  .slide-down-leave {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  .slide-left-enter,
  .slide-left-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-left-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-left-enter.slide-left-enter-active,
  .slide-left-appear.slide-left-appear-active {
    -webkit-animation-name: antSlideLeftIn;
    animation-name: antSlideLeftIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .slide-left-leave.slide-left-leave-active {
    -webkit-animation-name: antSlideLeftOut;
    animation-name: antSlideLeftOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .slide-left-enter,
  .slide-left-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }
  .slide-left-leave {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  .slide-right-enter,
  .slide-right-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-right-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .slide-right-enter.slide-right-enter-active,
  .slide-right-appear.slide-right-appear-active {
    -webkit-animation-name: antSlideRightIn;
    animation-name: antSlideRightIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .slide-right-leave.slide-right-leave-active {
    -webkit-animation-name: antSlideRightOut;
    animation-name: antSlideRightOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .slide-right-enter,
  .slide-right-appear {
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }
  .slide-right-leave {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  @-webkit-keyframes antSlideUpIn {
    0% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }
  @keyframes antSlideUpIn {
    0% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }
  @-webkit-keyframes antSlideUpOut {
    0% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
  }
  @keyframes antSlideUpOut {
    0% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
  }
  @-webkit-keyframes antSlideDownIn {
    0% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 1;
    }
  }
  @keyframes antSlideDownIn {
    0% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 1;
    }
  }
  @-webkit-keyframes antSlideDownOut {
    0% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 0;
    }
  }
  @keyframes antSlideDownOut {
    0% {
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleY(0.8);
      transform: scaleY(0.8);
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      opacity: 0;
    }
  }
  @-webkit-keyframes antSlideLeftIn {
    0% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }
  @keyframes antSlideLeftIn {
    0% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }
  @-webkit-keyframes antSlideLeftOut {
    0% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
  }
  @keyframes antSlideLeftOut {
    0% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 0;
    }
  }
  @-webkit-keyframes antSlideRightIn {
    0% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 1;
    }
  }
  @keyframes antSlideRightIn {
    0% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 1;
    }
  }
  @-webkit-keyframes antSlideRightOut {
    0% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 0;
    }
  }
  @keyframes antSlideRightOut {
    0% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleX(0.8);
      transform: scaleX(0.8);
      -webkit-transform-origin: 100% 0%;
      transform-origin: 100% 0%;
      opacity: 0;
    }
  }
  .zoom-enter,
  .zoom-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-enter.zoom-enter-active,
  .zoom-appear.zoom-appear-active {
    -webkit-animation-name: antZoomIn;
    animation-name: antZoomIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .zoom-leave.zoom-leave-active {
    -webkit-animation-name: antZoomOut;
    animation-name: antZoomOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .zoom-enter,
  .zoom-appear {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .zoom-leave {
    -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .zoom-big-enter,
  .zoom-big-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-big-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-big-enter.zoom-big-enter-active,
  .zoom-big-appear.zoom-big-appear-active {
    -webkit-animation-name: antZoomBigIn;
    animation-name: antZoomBigIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .zoom-big-leave.zoom-big-leave-active {
    -webkit-animation-name: antZoomBigOut;
    animation-name: antZoomBigOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .zoom-big-enter,
  .zoom-big-appear {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .zoom-big-leave {
    -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .zoom-big-fast-enter,
  .zoom-big-fast-appear {
    -webkit-animation-duration: 0.1s;
    animation-duration: 0.1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-big-fast-leave {
    -webkit-animation-duration: 0.1s;
    animation-duration: 0.1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-big-fast-enter.zoom-big-fast-enter-active,
  .zoom-big-fast-appear.zoom-big-fast-appear-active {
    -webkit-animation-name: antZoomBigIn;
    animation-name: antZoomBigIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .zoom-big-fast-leave.zoom-big-fast-leave-active {
    -webkit-animation-name: antZoomBigOut;
    animation-name: antZoomBigOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .zoom-big-fast-enter,
  .zoom-big-fast-appear {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .zoom-big-fast-leave {
    -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .zoom-up-enter,
  .zoom-up-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-up-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-up-enter.zoom-up-enter-active,
  .zoom-up-appear.zoom-up-appear-active {
    -webkit-animation-name: antZoomUpIn;
    animation-name: antZoomUpIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .zoom-up-leave.zoom-up-leave-active {
    -webkit-animation-name: antZoomUpOut;
    animation-name: antZoomUpOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .zoom-up-enter,
  .zoom-up-appear {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .zoom-up-leave {
    -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .zoom-down-enter,
  .zoom-down-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-down-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-down-enter.zoom-down-enter-active,
  .zoom-down-appear.zoom-down-appear-active {
    -webkit-animation-name: antZoomDownIn;
    animation-name: antZoomDownIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .zoom-down-leave.zoom-down-leave-active {
    -webkit-animation-name: antZoomDownOut;
    animation-name: antZoomDownOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .zoom-down-enter,
  .zoom-down-appear {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .zoom-down-leave {
    -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .zoom-left-enter,
  .zoom-left-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-left-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-left-enter.zoom-left-enter-active,
  .zoom-left-appear.zoom-left-appear-active {
    -webkit-animation-name: antZoomLeftIn;
    animation-name: antZoomLeftIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .zoom-left-leave.zoom-left-leave-active {
    -webkit-animation-name: antZoomLeftOut;
    animation-name: antZoomLeftOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .zoom-left-enter,
  .zoom-left-appear {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .zoom-left-leave {
    -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .zoom-right-enter,
  .zoom-right-appear {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-right-leave {
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .zoom-right-enter.zoom-right-enter-active,
  .zoom-right-appear.zoom-right-appear-active {
    -webkit-animation-name: antZoomRightIn;
    animation-name: antZoomRightIn;
    -webkit-animation-play-state: running;
    animation-play-state: running;
  }
  .zoom-right-leave.zoom-right-leave-active {
    -webkit-animation-name: antZoomRightOut;
    animation-name: antZoomRightOut;
    -webkit-animation-play-state: running;
    animation-play-state: running;
    pointer-events: none;
  }
  .zoom-right-enter,
  .zoom-right-appear {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  }
  .zoom-right-leave {
    -webkit-animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
    animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  @-webkit-keyframes antZoomIn {
    0% {
      -webkit-transform: scale(0.2);
      transform: scale(0.2);
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes antZoomIn {
    0% {
      -webkit-transform: scale(0.2);
      transform: scale(0.2);
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }
  @-webkit-keyframes antZoomOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.2);
      transform: scale(0.2);
      opacity: 0;
    }
  }
  @keyframes antZoomOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.2);
      transform: scale(0.2);
      opacity: 0;
    }
  }
  @-webkit-keyframes antZoomBigIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes antZoomBigIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }
  @-webkit-keyframes antZoomBigOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 0;
    }
  }
  @keyframes antZoomBigOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 0;
    }
  }
  @-webkit-keyframes antZoomUpIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
    }
  }
  @keyframes antZoomUpIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
    }
  }
  @-webkit-keyframes antZoomUpOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
      opacity: 0;
    }
  }
  @keyframes antZoomUpOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 0%;
      transform-origin: 50% 0%;
      opacity: 0;
    }
  }
  @-webkit-keyframes antZoomLeftIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
    }
  }
  @keyframes antZoomLeftIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
    }
  }
  @-webkit-keyframes antZoomLeftOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
      opacity: 0;
    }
  }
  @keyframes antZoomLeftOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 0% 50%;
      transform-origin: 0% 50%;
      opacity: 0;
    }
  }
  @-webkit-keyframes antZoomRightIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
    }
  }
  @keyframes antZoomRightIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
    }
  }
  @-webkit-keyframes antZoomRightOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
      opacity: 0;
    }
  }
  @keyframes antZoomRightOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
      opacity: 0;
    }
  }
  @-webkit-keyframes antZoomDownIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
    }
  }
  @keyframes antZoomDownIn {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
      opacity: 0;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
    }
  }
  @-webkit-keyframes antZoomDownOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
      opacity: 0;
    }
  }
  @keyframes antZoomDownOut {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
      opacity: 0;
    }
  }
  .ant-motion-collapse-legacy {
    overflow: hidden;
  }
  .ant-motion-collapse-legacy-active {
    -webkit-transition: height 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
    transition: height 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
  }
  .ant-motion-collapse {
    overflow: hidden;
    -webkit-transition: height 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
    transition: height 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
  }

  .ant-affix {
    position: fixed;
    z-index: 10;
  }

  .ant-picker-calendar {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum', 'tnum';
    background: #fff;
  }
  .ant-picker-calendar-header {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: end;
    justify-content: flex-end;
    padding: 12px 0;
  }
  .ant-picker-calendar-header .ant-picker-calendar-year-select {
    min-width: 80px;
  }
  .ant-picker-calendar-header .ant-picker-calendar-month-select {
    min-width: 70px;
    margin-left: 8px;
  }
  .ant-picker-calendar-header .ant-picker-calendar-mode-switch {
    margin-left: 8px;
  }
  .ant-picker-calendar .ant-picker-panel {
    background: #fff;
    border: 0;
    border-top: 1px solid #f0f0f0;
    border-radius: 0;
  }
  .ant-picker-calendar .ant-picker-panel .ant-picker-month-panel,
  .ant-picker-calendar .ant-picker-panel .ant-picker-date-panel {
    width: auto;
  }
  .ant-picker-calendar .ant-picker-panel .ant-picker-body {
    padding: 8px 0;
  }
  .ant-picker-calendar .ant-picker-panel .ant-picker-content {
    width: 100%;
  }
  .ant-picker-calendar-mini {
    border-radius: 2px;
  }
  .ant-picker-calendar-mini .ant-picker-calendar-header {
    padding-right: 8px;
    padding-left: 8px;
  }
  .ant-picker-calendar-mini .ant-picker-panel {
    border-radius: 0 0 2px 2px;
  }
  .ant-picker-calendar-mini .ant-picker-content {
    height: 256px;
  }
  .ant-picker-calendar-mini .ant-picker-content th {
    height: auto;
    padding: 0;
    line-height: 18px;
  }
  .ant-picker-calendar-full .ant-picker-panel {
    display: block;
    width: 100%;
    text-align: right;
    background: #fff;
    border: 0;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-body th,
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-body td {
    padding: 0;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-body th {
    height: auto;
    padding: 0 12px 5px 0;
    line-height: 18px;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-cell::before {
    display: none;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-cell:hover .ant-picker-calendar-date {
    background: #f5f5f5;
  }
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell
    .ant-picker-calendar-date-today::before {
    display: none;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-cell-selected .ant-picker-calendar-date,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected:hover
    .ant-picker-calendar-date,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected
    .ant-picker-calendar-date-today,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected:hover
    .ant-picker-calendar-date-today {
    background: #e6f7ff;
  }
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected
    .ant-picker-calendar-date
    .ant-picker-calendar-date-value,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected:hover
    .ant-picker-calendar-date
    .ant-picker-calendar-date-value,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected
    .ant-picker-calendar-date-today
    .ant-picker-calendar-date-value,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected:hover
    .ant-picker-calendar-date-today
    .ant-picker-calendar-date-value {
    color: #1890ff;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date {
    display: block;
    width: auto;
    height: auto;
    margin: 0 4px;
    padding: 4px 8px 0;
    border: 0;
    border-top: 2px solid #f0f0f0;
    border-radius: 0;
    -webkit-transition: background 0.3s;
    transition: background 0.3s;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-value {
    line-height: 24px;
    -webkit-transition: color 0.3s;
    transition: color 0.3s;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-content {
    position: static;
    width: auto;
    height: 86px;
    overflow-y: auto;
    color: rgba(0, 0, 0, 0.65);
    line-height: 1.5715;
    text-align: left;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-today {
    border-color: #1890ff;
  }
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-calendar-date-today
    .ant-picker-calendar-date-value {
    color: rgba(0, 0, 0, 0.65);
  }
  @media only screen and (max-width: 480px) {
    .ant-picker-calendar-header {
      display: block;
    }
    .ant-picker-calendar-header .ant-picker-calendar-year-select {
      width: 50%;
    }
    .ant-picker-calendar-header .ant-picker-calendar-month-select {
      width: calc(50% - 8px);
    }
    .ant-picker-calendar-header .ant-picker-calendar-mode-switch {
      width: 100%;
      margin-top: 8px;
      margin-left: 0;
    }
    .ant-picker-calendar-header .ant-picker-calendar-mode-switch > label {
      width: 50%;
      text-align: center;
    }
  }

  .ant-radio-group {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum', 'tnum';
    display: inline-block;
    line-height: unset;
  }
  .ant-radio-group .ant-badge-count {
    z-index: 1;
  }
  .ant-radio-group > .ant-badge:not(:first-child) > .ant-radio-button-wrapper {
    border-left: none;
  }
  .ant-radio-wrapper {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum', 'tnum';
    position: relative;
    display: inline-block;
    margin-right: 8px;
    white-space: nowrap;
    cursor: pointer;
  }
  .ant-radio {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum', 'tnum';
    position: relative;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    vertical-align: sub;
    outline: none;
    cursor: pointer;
  }
  .ant-radio-wrapper:hover .ant-radio,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    border-color: #1890ff;
  }
  .ant-radio-input:focus + .ant-radio-inner {
    -webkit-box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
  }
  .ant-radio-checked::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #1890ff;
    border-radius: 50%;
    visibility: hidden;
    -webkit-animation: antRadioEffect 0.36s ease-in-out;
    animation: antRadioEffect 0.36s ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    content: '';
  }
  .ant-radio:hover::after,
  .ant-radio-wrapper:hover .ant-radio::after {
    visibility: visible;
  }
  .ant-radio-inner {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-color: #d9d9d9;
    border-style: solid;
    border-width: 1px;
    border-radius: 100px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  .ant-radio-inner::after {
    position: absolute;
    top: 3px;
    left: 3px;
    display: table;
    width: 8px;
    height: 8px;
    background-color: #1890ff;
    border-top: 0;
    border-left: 0;
    border-radius: 8px;
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
    -webkit-transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    content: ' ';
  }
  .ant-radio-input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    cursor: pointer;
    opacity: 0;
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: #1890ff;
  }
  .ant-radio-checked .ant-radio-inner::after {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
    -webkit-transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
  .ant-radio-disabled .ant-radio-inner {
    background-color: #f5f5f5;
    border-color: #d9d9d9 !important;
    cursor: not-allowed;
  }
  .ant-radio-disabled .ant-radio-inner::after {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .ant-radio-disabled .ant-radio-input {
    cursor: not-allowed;
  }
  .ant-radio-disabled + span {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
  span.ant-radio + * {
    padding-right: 8px;
    padding-left: 8px;
  }
  .ant-radio-button-wrapper {
    position: relative;
    display: inline-block;
    height: 32px;
    margin: 0;
    padding: 0 15px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 30px;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-top-width: 1.02px;
    border-left-width: 0;
    cursor: pointer;
    -webkit-transition: color 0.3s, background 0.3s, border-color 0.3s, -webkit-box-shadow 0.3s;
    transition: color 0.3s, background 0.3s, border-color 0.3s, -webkit-box-shadow 0.3s;
    transition: color 0.3s, background 0.3s, border-color 0.3s, box-shadow 0.3s;
    transition: color 0.3s, background 0.3s, border-color 0.3s, box-shadow 0.3s,
      -webkit-box-shadow 0.3s;
  }
  .ant-radio-button-wrapper a {
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-radio-button-wrapper > .ant-radio-button {
    display: block;
    width: 0;
    height: 0;
    margin-left: 0;
  }
  .ant-radio-group-large .ant-radio-button-wrapper {
    height: 40px;
    font-size: 16px;
    line-height: 38px;
  }
  .ant-radio-group-small .ant-radio-button-wrapper {
    height: 24px;
    padding: 0 7px;
    line-height: 22px;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    position: absolute;
    top: -1px;
    left: -1px;
    display: block;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    width: 1px;
    height: 100%;
    padding: 1px 0;
    background-color: #d9d9d9;
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
    content: '';
  }
  .ant-radio-button-wrapper:first-child {
    border-left: 1px solid #d9d9d9;
    border-radius: 2px 0 0 2px;
  }
  .ant-radio-button-wrapper:last-child {
    border-radius: 0 2px 2px 0;
  }
  .ant-radio-button-wrapper:first-child:last-child {
    border-radius: 2px;
  }
  .ant-radio-button-wrapper:hover {
    position: relative;
    color: #1890ff;
  }
  .ant-radio-button-wrapper:focus-within {
    -webkit-box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
  }
  .ant-radio-button-wrapper .ant-radio-inner,
  .ant-radio-button-wrapper input[type='checkbox'],
  .ant-radio-button-wrapper input[type='radio'] {
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    z-index: 1;
    color: #1890ff;
    background: #fff;
    border-color: #1890ff;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: #1890ff;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
    border-color: #1890ff;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    color: #40a9ff;
    border-color: #40a9ff;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover::before {
    background-color: #40a9ff;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active {
    color: #096dd9;
    border-color: #096dd9;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active::before {
    background-color: #096dd9;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
    -webkit-box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
  }
  .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    color: #fff;
    background: #40a9ff;
    border-color: #40a9ff;
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active {
    color: #fff;
    background: #096dd9;
    border-color: #096dd9;
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
    -webkit-box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
  }
  .ant-radio-button-wrapper-disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  .ant-radio-button-wrapper-disabled:first-child,
  .ant-radio-button-wrapper-disabled:hover {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
  }
  .ant-radio-button-wrapper-disabled:first-child {
    border-left-color: #d9d9d9;
  }
  .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked {
    color: #fff;
    background-color: #e6e6e6;
    border-color: #d9d9d9;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  @-webkit-keyframes antRadioEffect {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1.6);
      transform: scale(1.6);
      opacity: 0;
    }
  }
  @keyframes antRadioEffect {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1.6);
      transform: scale(1.6);
      opacity: 0;
    }
  }
  @supports (-moz-appearance: meterbar) and (background-blend-mode: difference, normal) {
    .ant-radio {
      vertical-align: text-bottom;
    }
  }
  .ant-radio-group.ant-radio-group-rtl {
    direction: rtl;
  }
  .ant-radio-wrapper.ant-radio-wrapper-rtl {
    margin-right: 0;
    margin-left: 8px;
  }
  .ant-radio-button-wrapper.ant-radio-button-wrapper-rtl {
    border-right-width: 0;
    border-left-width: 1px;
  }
  .ant-radio-button-wrapper.ant-radio-button-wrapper-rtl.ant-radio-button-wrapper:not(:first-child)::before {
    right: -1px;
    left: 0;
  }
  .ant-radio-button-wrapper.ant-radio-button-wrapper-rtl.ant-radio-button-wrapper:first-child {
    border-right: 1px solid #d9d9d9;
    border-radius: 0 2px 2px 0;
  }
  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
    border-right-color: #40a9ff;
  }
  .ant-radio-button-wrapper.ant-radio-button-wrapper-rtl.ant-radio-button-wrapper:last-child {
    border-radius: 2px 0 0 2px;
  }
  .ant-radio-button-wrapper.ant-radio-button-wrapper-rtl.ant-radio-button-wrapper-disabled:first-child {
    border-right-color: #d9d9d9;
  }

  .ant-picker-panel {
    display: inline-block;
    text-align: center;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    outline: none;
  }
  .ant-picker-panel-focused {
    border-color: #1890ff;
  }
  .ant-picker-decade-panel,
  .ant-picker-year-panel,
  .ant-picker-quarter-panel,
  .ant-picker-month-panel,
  .ant-picker-week-panel,
  .ant-picker-date-panel,
  .ant-picker-time-panel {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 280px;
  }
  .ant-picker-header {
    display: -ms-flexbox;
    display: flex;
    padding: 0 8px;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-picker-header > * {
    -ms-flex: none;
    flex: none;
  }
  .ant-picker-header button {
    padding: 0;
    color: rgba(0, 0, 0, 0.25);
    line-height: 40px;
    background: transparent;
    border: 0;
    cursor: pointer;
    -webkit-transition: color 0.3s;
    transition: color 0.3s;
  }
  .ant-picker-header > button {
    min-width: 1.6em;
    font-size: 14px;
  }
  .ant-picker-header > button:hover {
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-picker-header-view {
    -ms-flex: auto;
    flex: auto;
    font-weight: 500;
    line-height: 40px;
  }
  .ant-picker-header-view button {
    color: inherit;
    font-weight: inherit;
  }
  .ant-picker-header-view button:not(:first-child) {
    margin-left: 8px;
  }
  .ant-picker-header-view button:hover {
    color: #1890ff;
  }
  .ant-picker-prev-icon,
  .ant-picker-next-icon,
  .ant-picker-super-prev-icon,
  .ant-picker-super-next-icon {
    position: relative;
    display: inline-block;
    width: 7px;
    height: 7px;
  }
  .ant-picker-prev-icon::before,
  .ant-picker-next-icon::before,
  .ant-picker-super-prev-icon::before,
  .ant-picker-super-next-icon::before {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 7px;
    height: 7px;
    border: 0 solid currentColor;
    border-width: 1.5px 0 0 1.5px;
    content: '';
  }
  .ant-picker-super-prev-icon::after,
  .ant-picker-super-next-icon::after {
    position: absolute;
    top: 4px;
    left: 4px;
    display: inline-block;
    width: 7px;
    height: 7px;
    border: 0 solid currentColor;
    border-width: 1.5px 0 0 1.5px;
    content: '';
  }
  .ant-picker-prev-icon,
  .ant-picker-super-prev-icon {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .ant-picker-next-icon,
  .ant-picker-super-next-icon {
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
  }
  .ant-picker-content {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }
  .ant-picker-content th,
  .ant-picker-content td {
    position: relative;
    min-width: 24px;
    font-weight: 400;
  }
  .ant-picker-content th {
    height: 30px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 30px;
  }
  .ant-picker-cell {
    padding: 3px 0;
    color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }
  .ant-picker-cell-in-view {
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-picker-cell-disabled {
    cursor: not-allowed;
  }
  .ant-picker-cell::before {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    z-index: 1;
    height: 24px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    content: '';
  }
  .ant-picker-cell .ant-picker-cell-inner {
    position: relative;
    z-index: 2;
    display: inline-block;
    min-width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    -webkit-transition: background 0.3s, border 0.3s;
    transition: background 0.3s, border 0.3s;
  }
  .ant-picker-cell:hover:not(.ant-picker-cell-in-view) .ant-picker-cell-inner,
  .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end)
    .ant-picker-cell-inner {
    background: #f5f5f5;
  }
  .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    border: 1px solid #1890ff;
    border-radius: 2px;
    content: '';
  }
  .ant-picker-cell-in-view.ant-picker-cell-in-range {
    position: relative;
  }
  .ant-picker-cell-in-view.ant-picker-cell-in-range::before {
    background: #e6f7ff;
  }
  .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
    color: #fff;
    background: #1890ff;
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single)::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single)::before {
    background: #e6f7ff;
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-start::before {
    left: 50%;
  }
  .ant-picker-panel-rtl .ant-picker-cell-in-view.ant-picker-cell-range-start::before {
    right: 50%;
    left: 0;
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-end::before {
    right: 50%;
  }
  .ant-picker-panel-rtl .ant-picker-cell-in-view.ant-picker-cell-range-end::before {
    right: 0;
    left: 50%;
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start:not(.ant-picker-cell-in-range):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end:not(.ant-picker-cell-in-range):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start.ant-picker-cell-range-start-single::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end.ant-picker-cell-range-end-single::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover:not(.ant-picker-cell-in-range)::after {
    position: absolute;
    top: 50%;
    z-index: 0;
    height: 24px;
    border-top: 1px dashed #7ec1ff;
    border-bottom: 1px dashed #7ec1ff;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    content: '';
  }
  .ant-picker-cell-range-hover-start::after,
  .ant-picker-cell-range-hover-end::after,
  .ant-picker-cell-range-hover::after {
    right: 0;
    left: 2px;
  }
  .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-start.ant-picker-cell-range-hover::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-end.ant-picker-cell-range-hover::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single).ant-picker-cell-range-hover-start::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single).ant-picker-cell-range-hover-end::before,
  .ant-picker-panel
    > :not(.ant-picker-date-panel)
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start::before,
  .ant-picker-panel
    > :not(.ant-picker-date-panel)
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-end::before {
    background: #cbe6ff;
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):not(.ant-picker-cell-range-end)
    .ant-picker-cell-inner {
    border-radius: 2px 0 0 2px;
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):not(.ant-picker-cell-range-start)
    .ant-picker-cell-inner {
    border-radius: 0 2px 2px 0;
  }
  .ant-picker-date-panel
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start
    .ant-picker-cell-inner::after,
  .ant-picker-date-panel
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-end
    .ant-picker-cell-inner::after {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: -1;
    background: #cbe6ff;
    content: '';
  }
  .ant-picker-date-panel
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start
    .ant-picker-cell-inner::after {
    right: -7px;
    left: 0;
  }
  .ant-picker-panel-rtl
    .ant-picker-date-panel
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start
    .ant-picker-cell-inner::after {
    right: 0;
    left: -7px;
  }
  .ant-picker-date-panel
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-end
    .ant-picker-cell-inner::after {
    right: 0;
    left: -7px;
  }
  .ant-picker-panel-rtl
    .ant-picker-date-panel
    .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-end
    .ant-picker-cell-inner::after {
    right: -7px;
    left: 0;
  }
  .ant-picker-cell-range-hover.ant-picker-cell-range-start::after {
    right: 50%;
  }
  .ant-picker-panel-rtl .ant-picker-cell-range-hover.ant-picker-cell-range-start::after {
    right: 0;
    left: 50%;
  }
  .ant-picker-cell-range-hover.ant-picker-cell-range-end::after {
    left: 50%;
  }
  .ant-picker-panel-rtl .ant-picker-cell-range-hover.ant-picker-cell-range-end::after {
    right: 50%;
    left: 0;
  }
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover:first-child::after,
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover-end:first-child::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-edge-start:not(.ant-picker-cell-range-hover-edge-start-near-range)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start::after {
    left: 6px;
    border-left: 1px dashed #7ec1ff;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .ant-picker-panel-rtl
    tr
    > .ant-picker-cell-in-view.ant-picker-cell-range-hover:first-child::after,
  .ant-picker-panel-rtl
    tr
    > .ant-picker-cell-in-view.ant-picker-cell-range-hover-end:first-child::after,
  .ant-picker-panel-rtl
    .ant-picker-cell-in-view.ant-picker-cell-range-hover-edge-start:not(.ant-picker-cell-range-hover-edge-start-near-range)::after,
  .ant-picker-panel-rtl .ant-picker-cell-in-view.ant-picker-cell-range-hover-start::after {
    right: 6px;
    left: 0;
    border-right: 1px dashed #7ec1ff;
    border-left: none;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover:last-child::after,
  tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover-start:last-child::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-edge-end:not(.ant-picker-cell-range-hover-edge-end-near-range)::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end::after {
    right: 6px;
    border-right: 1px dashed #7ec1ff;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .ant-picker-panel-rtl tr > .ant-picker-cell-in-view.ant-picker-cell-range-hover:last-child::after,
  .ant-picker-panel-rtl
    tr
    > .ant-picker-cell-in-view.ant-picker-cell-range-hover-start:last-child::after,
  .ant-picker-panel-rtl
    .ant-picker-cell-in-view.ant-picker-cell-range-hover-edge-end:not(.ant-picker-cell-range-hover-edge-end-near-range)::after,
  .ant-picker-panel-rtl .ant-picker-cell-in-view.ant-picker-cell-range-hover-end::after {
    right: 0;
    left: 6px;
    border-right: none;
    border-left: 1px dashed #7ec1ff;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .ant-picker-cell-disabled {
    pointer-events: none;
  }
  .ant-picker-cell-disabled .ant-picker-cell-inner {
    color: rgba(0, 0, 0, 0.25);
    background: transparent;
  }
  .ant-picker-cell-disabled::before {
    background: #f5f5f5;
  }
  .ant-picker-cell-disabled.ant-picker-cell-today .ant-picker-cell-inner::before {
    border-color: rgba(0, 0, 0, 0.25);
  }
  .ant-picker-decade-panel .ant-picker-content,
  .ant-picker-year-panel .ant-picker-content,
  .ant-picker-quarter-panel .ant-picker-content,
  .ant-picker-month-panel .ant-picker-content {
    height: 265px;
  }
  .ant-picker-decade-panel .ant-picker-cell-inner,
  .ant-picker-year-panel .ant-picker-cell-inner,
  .ant-picker-quarter-panel .ant-picker-cell-inner,
  .ant-picker-month-panel .ant-picker-cell-inner {
    padding: 0 8px;
  }
  .ant-picker-decade-panel .ant-picker-cell-disabled .ant-picker-cell-inner,
  .ant-picker-year-panel .ant-picker-cell-disabled .ant-picker-cell-inner,
  .ant-picker-quarter-panel .ant-picker-cell-disabled .ant-picker-cell-inner,
  .ant-picker-month-panel .ant-picker-cell-disabled .ant-picker-cell-inner {
    background: #f5f5f5;
  }
  .ant-picker-quarter-panel .ant-picker-content {
    height: 56px;
  }
  .ant-picker-footer {
    line-height: 38px;
    text-align: center;
    border-bottom: 1px solid transparent;
  }
  .ant-picker-panel .ant-picker-footer {
    border-top: 1px solid #f0f0f0;
  }
  .ant-picker-footer-extra {
    padding: 0 12px;
    line-height: 38px;
    text-align: left;
  }
  .ant-picker-footer-extra:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-picker-now {
    text-align: left;
  }
  .ant-picker-today-btn {
    color: #1890ff;
  }
  .ant-picker-today-btn:hover {
    color: #40a9ff;
  }
  .ant-picker-today-btn:active {
    color: #096dd9;
  }
  .ant-picker-decade-panel .ant-picker-cell-inner {
    padding: 0 4px;
  }
  .ant-picker-decade-panel .ant-picker-cell::before {
    display: none;
  }
  .ant-picker-year-panel .ant-picker-body,
  .ant-picker-quarter-panel .ant-picker-body,
  .ant-picker-month-panel .ant-picker-body {
    padding: 0 8px;
  }
  .ant-picker-year-panel .ant-picker-cell-inner,
  .ant-picker-quarter-panel .ant-picker-cell-inner,
  .ant-picker-month-panel .ant-picker-cell-inner {
    width: 60px;
  }
  .ant-picker-year-panel .ant-picker-cell-range-hover-start::after,
  .ant-picker-quarter-panel .ant-picker-cell-range-hover-start::after,
  .ant-picker-month-panel .ant-picker-cell-range-hover-start::after {
    left: 14px;
    border-left: 1px dashed #7ec1ff;
    border-radius: 2px 0 0 2px;
  }
  .ant-picker-panel-rtl .ant-picker-year-panel .ant-picker-cell-range-hover-start::after,
  .ant-picker-panel-rtl .ant-picker-quarter-panel .ant-picker-cell-range-hover-start::after,
  .ant-picker-panel-rtl .ant-picker-month-panel .ant-picker-cell-range-hover-start::after {
    right: 14px;
    border-right: 1px dashed #7ec1ff;
    border-radius: 0 2px 2px 0;
  }
  .ant-picker-year-panel .ant-picker-cell-range-hover-end::after,
  .ant-picker-quarter-panel .ant-picker-cell-range-hover-end::after,
  .ant-picker-month-panel .ant-picker-cell-range-hover-end::after {
    right: 14px;
    border-right: 1px dashed #7ec1ff;
    border-radius: 0 2px 2px 0;
  }
  .ant-picker-panel-rtl .ant-picker-year-panel .ant-picker-cell-range-hover-end::after,
  .ant-picker-panel-rtl .ant-picker-quarter-panel .ant-picker-cell-range-hover-end::after,
  .ant-picker-panel-rtl .ant-picker-month-panel .ant-picker-cell-range-hover-end::after {
    left: 14px;
    border-left: 1px dashed #7ec1ff;
    border-radius: 2px 0 0 2px;
  }
  .ant-picker-week-panel .ant-picker-body {
    padding: 8px 12px;
  }
  .ant-picker-week-panel .ant-picker-cell:hover .ant-picker-cell-inner,
  .ant-picker-week-panel .ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner {
    background: transparent !important;
  }
  .ant-picker-week-panel-row td {
    -webkit-transition: background 0.3s;
    transition: background 0.3s;
  }
  .ant-picker-week-panel-row:hover td {
    background: #f5f5f5;
  }
  .ant-picker-week-panel-row-selected td,
  .ant-picker-week-panel-row-selected:hover td {
    background: #1890ff;
  }
  .ant-picker-week-panel-row-selected td.ant-picker-cell-week,
  .ant-picker-week-panel-row-selected:hover td.ant-picker-cell-week {
    color: rgba(255, 255, 255, 0.5);
  }
  .ant-picker-week-panel-row-selected td.ant-picker-cell-today .ant-picker-cell-inner::before,
  .ant-picker-week-panel-row-selected:hover
    td.ant-picker-cell-today
    .ant-picker-cell-inner::before {
    border-color: #fff;
  }
  .ant-picker-week-panel-row-selected td .ant-picker-cell-inner,
  .ant-picker-week-panel-row-selected:hover td .ant-picker-cell-inner {
    color: #fff;
  }
  .ant-picker-date-panel .ant-picker-body {
    padding: 8px 12px;
  }
  .ant-picker-date-panel .ant-picker-content {
    width: 252px;
  }
  .ant-picker-date-panel .ant-picker-content th {
    width: 36px;
  }
  .ant-picker-datetime-panel {
    display: -ms-flexbox;
    display: flex;
  }
  .ant-picker-datetime-panel .ant-picker-time-panel {
    border-left: 1px solid #f0f0f0;
  }
  .ant-picker-datetime-panel .ant-picker-date-panel,
  .ant-picker-datetime-panel .ant-picker-time-panel {
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
  }
  .ant-picker-datetime-panel-active .ant-picker-date-panel,
  .ant-picker-datetime-panel-active .ant-picker-time-panel {
    opacity: 0.3;
  }
  .ant-picker-datetime-panel-active .ant-picker-date-panel-active,
  .ant-picker-datetime-panel-active .ant-picker-time-panel-active {
    opacity: 1;
  }
  .ant-picker-time-panel {
    width: auto;
    min-width: auto;
  }
  .ant-picker-time-panel .ant-picker-content {
    display: -ms-flexbox;
    display: flex;
    -ms-flex: auto;
    flex: auto;
    height: 224px;
  }
  .ant-picker-time-panel-column {
    -ms-flex: 1 0 auto;
    flex: 1 0 auto;
    width: 56px;
    margin: 0;
    padding: 0 0 194px 0;
    overflow-y: hidden;
    text-align: left;
    list-style: none;
    -webkit-transition: background 0.3s;
    transition: background 0.3s;
  }
  .ant-picker-time-panel-column:not(:first-child) {
    border-left: 1px solid #f0f0f0;
  }
  .ant-picker-time-panel-column-active {
    background: rgba(230, 247, 255, 0.2);
  }
  .ant-picker-time-panel-column:hover {
    overflow-y: auto;
  }
  .ant-picker-time-panel-column > li {
    margin: 0;
    padding: 0;
  }
  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner {
    display: block;
    width: 100%;
    height: 28px;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    line-height: 28px;
    text-align: center;
    border-radius: 0;
    cursor: pointer;
    -webkit-transition: background 0.3s;
    transition: background 0.3s;
  }
  .ant-picker-time-panel-column
    > li.ant-picker-time-panel-cell
    .ant-picker-time-panel-cell-inner:hover {
    background: #f5f5f5;
  }
  .ant-picker-time-panel-column
    > li.ant-picker-time-panel-cell-selected
    .ant-picker-time-panel-cell-inner {
    background: #e6f7ff;
  }
  .ant-picker-time-panel-column
    > li.ant-picker-time-panel-cell-disabled
    .ant-picker-time-panel-cell-inner {
    color: rgba(0, 0, 0, 0.25);
    background: transparent;
    cursor: not-allowed;
  }
  _:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-month-panel .ant-picker-cell,
  :root .ant-picker-range-wrapper .ant-picker-month-panel .ant-picker-cell,
  _:-ms-fullscreen .ant-picker-range-wrapper .ant-picker-year-panel .ant-picker-cell,
  :root .ant-picker-range-wrapper .ant-picker-year-panel .ant-picker-cell {
    padding: 21px 0;
  }
  .ant-picker {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum', 'tnum';
    padding: 4px 11px 4px;
    position: relative;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-align: center;
    align-items: center;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    -webkit-transition: border 0.3s, -webkit-box-shadow 0.3s;
    transition: border 0.3s, -webkit-box-shadow 0.3s;
    transition: border 0.3s, box-shadow 0.3s;
    transition: border 0.3s, box-shadow 0.3s, -webkit-box-shadow 0.3s;
  }
  .ant-picker:hover,
  .ant-picker-focused {
    border-color: #40a9ff;
    border-right-width: 1px !important;
  }
  .ant-picker-focused {
    border-color: #40a9ff;
    border-right-width: 1px !important;
    outline: 0;
    -webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  .ant-picker.ant-picker-disabled {
    background: #f5f5f5;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  .ant-picker.ant-picker-borderless {
    background-color: transparent !important;
    border-color: transparent !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
  .ant-picker-input {
    position: relative;
    display: -ms-inline-flexbox;
    display: inline-flex;
    width: 100%;
  }
  .ant-picker-input > input {
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 1.5715;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    -ms-flex: auto;
    flex: auto;
    min-width: 1px;
    height: auto;
    padding: 0;
    background: transparent;
    border: 0;
  }
  .ant-picker-input > input::-moz-placeholder {
    opacity: 1;
  }
  .ant-picker-input > input::-webkit-input-placeholder {
    color: #bfbfbf;
  }
  .ant-picker-input > input:-ms-input-placeholder {
    color: #bfbfbf;
  }
  .ant-picker-input > input::-ms-input-placeholder {
    color: #bfbfbf;
  }
  .ant-picker-input > input::placeholder {
    color: #bfbfbf;
  }
  .ant-picker-input > input:placeholder-shown {
    text-overflow: ellipsis;
  }
  .ant-picker-input > input:hover {
    border-color: #40a9ff;
    border-right-width: 1px !important;
  }
  .ant-picker-input > input:focus,
  .ant-picker-input > input-focused {
    border-color: #40a9ff;
    border-right-width: 1px !important;
    outline: 0;
    -webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  .ant-picker-input > input-disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 1;
  }
  .ant-picker-input > input-disabled:hover {
    border-color: #d9d9d9;
    border-right-width: 1px !important;
  }
  .ant-picker-input > input[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 1;
  }
  .ant-picker-input > input[disabled]:hover {
    border-color: #d9d9d9;
    border-right-width: 1px !important;
  }
  textarea.ant-picker-input > input {
    max-width: 100%;
    height: auto;
    min-height: 32px;
    line-height: 1.5715;
    vertical-align: bottom;
    -webkit-transition: all 0.3s, height 0s;
    transition: all 0.3s, height 0s;
  }
  .ant-picker-input > input-lg {
    padding: 6.5px 11px;
    font-size: 16px;
  }
  .ant-picker-input > input-sm {
    padding: 0px 7px;
  }
  .ant-picker-input > input:focus {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .ant-picker-input > input[disabled] {
    background: transparent;
  }
  .ant-picker-input:hover .ant-picker-clear {
    opacity: 1;
  }
  .ant-picker-large {
    padding: 6.5px 11px 6.5px;
  }
  .ant-picker-large .ant-picker-input > input {
    font-size: 16px;
  }
  .ant-picker-small {
    padding: 0px 7px 0px;
  }
  .ant-picker-suffix {
    -ms-flex-item-align: center;
    align-self: center;
    margin-left: 4px;
    color: rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }
  .ant-picker-clear {
    position: absolute;
    top: 50%;
    right: 0;
    color: rgba(0, 0, 0, 0.25);
    background: #fff;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    cursor: pointer;
    opacity: 0;
    -webkit-transition: opacity 0.3s, color 0.3s;
    transition: opacity 0.3s, color 0.3s;
  }
  .ant-picker-clear:hover {
    color: rgba(0, 0, 0, 0.45);
  }
  .ant-picker-separator {
    position: relative;
    display: inline-block;
    width: 1em;
    height: 16px;
    vertical-align: top;
    cursor: default;
  }
  .ant-picker-separator::before,
  .ant-picker-separator::after {
    position: absolute;
    border-top: 1px solid #979797;
    content: '';
  }
  .ant-picker-separator::before {
    top: 50%;
    left: 0.1em;
    width: 0.8em;
  }
  .ant-picker-separator::after {
    top: 50%;
    right: 0.11em;
    width: 0.8em;
    width: 0.3em;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
  }
  .ant-picker-disabled .ant-picker-range-separator .ant-picker-separator {
    cursor: not-allowed;
  }
  .ant-picker-range {
    position: relative;
    display: -ms-inline-flexbox;
    display: inline-flex;
  }
  .ant-picker-range .ant-picker-clear {
    right: 11px;
  }
  .ant-picker-range:hover .ant-picker-clear {
    opacity: 1;
  }
  .ant-picker-range .ant-picker-active-bar {
    bottom: -1px;
    height: 2px;
    margin-left: 11px;
    background: #1890ff;
    opacity: 0;
    -webkit-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
    pointer-events: none;
  }
  .ant-picker-range.ant-picker-focused .ant-picker-active-bar {
    opacity: 1;
  }
  .ant-picker-range-separator {
    -ms-flex-align: center;
    align-items: center;
    padding: 0 8px;
    line-height: 1;
  }
  .ant-picker-dropdown {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum', 'tnum';
    position: absolute;
    z-index: 1050;
  }
  .ant-picker-dropdown-hidden {
    display: none;
  }
  .ant-picker-dropdown-placement-bottomLeft .ant-picker-range-arrow {
    top: 1.66666667px;
    display: block;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .ant-picker-dropdown-placement-topLeft .ant-picker-range-arrow {
    bottom: 1.66666667px;
    display: block;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
  }
  .ant-picker-dropdown-range {
    padding: 6.66666667px 0;
  }
  .ant-picker-dropdown-range-hidden {
    display: none;
  }
  .ant-picker-dropdown .ant-picker-panel > .ant-picker-time-panel {
    padding-top: 4px;
  }
  .ant-picker-ranges {
    margin-bottom: 0;
    padding: 4px 12px;
    overflow: hidden;
    line-height: 34px;
    text-align: left;
    list-style: none;
  }
  .ant-picker-ranges > li {
    display: inline-block;
  }
  .ant-picker-ranges .ant-picker-preset span {
    cursor: pointer;
  }
  .ant-picker-ranges .ant-picker-ok {
    float: right;
    margin-left: 8px;
  }
  .ant-picker-range-wrapper {
    display: -ms-flexbox;
    display: flex;
  }
  .ant-picker-range-arrow {
    position: absolute;
    z-index: 1;
    display: none;
    width: 10px;
    height: 10px;
    margin-left: 16.5px;
    -webkit-box-shadow: 2px -2px 6px rgba(0, 0, 0, 0.06);
    box-shadow: 2px -2px 6px rgba(0, 0, 0, 0.06);
    -webkit-transition: left 0.3s ease-out;
    transition: left 0.3s ease-out;
  }
  .ant-picker-range-arrow::after {
    position: absolute;
    top: 1px;
    right: 1px;
    width: 10px;
    height: 10px;
    border: 5px solid #f0f0f0;
    border-color: #fff #fff transparent transparent;
    content: '';
  }
  .ant-picker-panel-container {
    overflow: hidden;
    vertical-align: top;
    background: #fff;
    border-radius: 2px;
    -webkit-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    -webkit-transition: margin 0.3s;
    transition: margin 0.3s;
  }
  .ant-picker-panel-container .ant-picker-panels {
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
  }
  .ant-picker-panel-container .ant-picker-panel {
    vertical-align: top;
    background: transparent;
    border-width: 0 0 1px 0;
    border-radius: 0;
  }
  .ant-picker-panel-container .ant-picker-panel-focused {
    border-color: #f0f0f0;
  }
  .ant-picker-rtl {
    direction: rtl;
  }
  .ant-picker-rtl .ant-picker-suffix {
    margin-right: 4px;
    margin-left: 0;
  }
  .ant-picker-rtl .ant-picker-clear {
    right: auto;
    left: 0;
  }
  .ant-picker-rtl .ant-picker-separator {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    -webkit-transform-origin: 50% 60%;
    transform-origin: 50% 60%;
  }
  .ant-picker-rtl.ant-picker-range .ant-picker-clear {
    right: auto;
    left: 11px;
  }
  .ant-picker-dropdown-rtl .ant-picker-ranges {
    text-align: right;
  }
  .ant-picker-dropdown-rtl .ant-picker-ranges .ant-picker-ok {
    float: left;
    margin-right: 8px;
    margin-left: 0;
  }
  .ant-picker-panel-rtl {
    direction: rtl;
  }
  .ant-picker-panel-rtl .ant-picker-prev-icon,
  .ant-picker-panel-rtl .ant-picker-super-prev-icon {
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
  }
  .ant-picker-panel-rtl .ant-picker-next-icon,
  .ant-picker-panel-rtl .ant-picker-super-next-icon {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .ant-picker-panel-rtl .ant-picker-time-panel {
    direction: ltr;
  }
`;
export default antPicker;
