import React from 'react';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import cx from 'classnames';
// import uuid from 'react-uuid';
import { color, floatClear } from 'styles/utils';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
// NOTE: 사용법
/**
 *  <CustomTooltip
      title={<CustomTooltipContent partnerInfo={partnerInfo}/>}
      placement="bottom-start"
      open={true}
      interactive
  >
    <span className="CreateCase_load tx">{ `${receiverName} ${hasManager}` }</span>
  </CustomTooltip>
 */
const defaultTheme = createMuiTheme();
const TextOnlyTooltip = withStyles({
  tooltip: {
    color: 'black',
    backgroundColor: 'transparent',
  },
})(Tooltip);

function CustomTooltip(props) {
  const {
    type,
    children = <></>,
    title,
    placement = 'right-start',
    customStyle,
    interactive,
    open,
    block,
    baseStyle,
    disableHoverListener,
    disableFocusListener,
    disableTouchListener,
    iconStyle,
    className = '',
  } = props;

  const typeIcon = { help: HelpIcon, alert: ErrorIcon };
  let Icon = typeIcon[type];
  // const uuid4 = uuid();
  return (
    <MuiThemeProvider theme={defaultTheme}>
      {/* <Styled.GlobalStyle id={uuid4} /> */}
      <Styled.CustomTooltip
        data-component-name="CustomTooltip"
        className={cx('customTooltip', { block: block }, className)}
      >
        <TextOnlyTooltip
          title={
            <Styled.TootipStyle baseStyle={baseStyle} _style={customStyle}>
              {title}
            </Styled.TootipStyle>
          }
          interactive={interactive}
          placement={placement}
          open={open}
          disableHoverListener={disableHoverListener}
          disableFocusListener={disableFocusListener}
          disableTouchListener={disableTouchListener}
        >
          <div className="tooltip__wapper" className={cx({ block: block })}>
            {children}
            {Icon && (
              <Styled.Icon iconStyle={iconStyle} className="tooltip__svg_wrapper">
                <Icon className="svg_icon" />
              </Styled.Icon>
            )}
          </div>
        </TextOnlyTooltip>
      </Styled.CustomTooltip>
    </MuiThemeProvider>
  );
}

export default CustomTooltip;

// const globalTooltipStyle = css`
//   .MuiTooltip-tooltip {
//     padding: 0;
//   }
// `;
const Styled = {
  // GlobalStyle: createGlobalStyle`
  //   [data-tooltip-id="${({ id }) => id}"]{
  //     ${globalTooltipStyle}
  //   }
  // `,
  CustomTooltip: styled.div`
    position: relative;
    display: inline-block;
    ${floatClear};

    &.block {
      width: 100%;
      ${floatClear};
    }
    .tooltip__wapper {
      display: inline-block;
      ${floatClear};
      &.block {
        width: 100%;
        ${floatClear};
      }
    }
  `,
  TootipStyle: styled.div`
    position: relative;
    display: inline-block;
    font-size: 12px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    ${({ baseStyle }) => baseStyle && `background: rgba(0,0,0,.7); border-radius: 5px`}
    ${({ _style }) => _style && _style};
  `,
  Icon: styled.span`
    display: inline-block;
    position: relative;
    color: ${color.gray_icon};
    /* background: ${color.gray_icon};
    color: white; */
    /* top: 5px; */
    cursor: pointer;
    font-size: 20px;
    border-radius: 100%;
    .svg_icon{
      ${({ iconStyle }) => iconStyle && iconStyle};
    }
    
  `,
};

// const theme = createMuiTheme({
//   overrides: {
//     MuiTooltip: {
//       tooltip: {
//         fontSize: "30px",
//         color: "yellow",
//         backgroundColor: "gray"
//       }
//     }
//   }
// });
// const BlueOnGreenTooltip = withStyles({
//   tooltip: {
//     color: "lightblue",
//     backgroundColor: "green"
//   }
// })(Tooltip);
