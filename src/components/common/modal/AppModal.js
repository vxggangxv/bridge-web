import React, { useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
// import uuid from 'react-uuid';
import _ from 'lodash';
import { buttonBlue, font, color } from 'styles/utils';
import { Link, useHistory } from 'react-router-dom';
import EscapeConvert from 'components/common/convert/EscapeConvert';
import { icon_modal_alert } from 'components/base/images';
import { useImmer } from 'use-immer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { StyledInShadowButtonOuter } from '../styled/Button';
import MuiButton from '../button/MuiButton';
import { CloseIconButton } from '../button/CloseIconButton';

// const modalUuid = uuid().split('-').join('');
const convertEscape = text => <EscapeConvert prev={'\n'} next={<br />} content={text} />;

const convertComponent = data => {
  if (typeof data === 'string') {
    return convertEscape(data);
  }

  // warning 방지
  const Data = data;
  return typeof data === 'function' ? <Data /> : data;
};

function AppModal(props) {
  const {
    type = '',
    title = '',
    headerCenterText = '',
    headerCenterTextStyle = {},
    content = '',
    contentCardStyle, // e.g. content_card padding
    isTitleDefault = true,
    isContentDefault = true,
    button = null,
    hideButton = false,
    reverseButton = false,
    onClick = () => {},
    onCancel = () => {},
    align = [],
    okText = 'OK',
    okLink = '',
    cancelLink = '',
    paddingNone = false,
    isCloseIcon = false,
  } = props;

  const history = useHistory();
  const modalRef = useRef(null);

  const alignConfig = {
    title: '',
    content: '',
    button: '',
  };

  align.map(i => {
    const splitItem = i.split('.');
    const headItem = _.head(splitItem);
    const lastItem = _.last(splitItem);
    alignConfig[headItem] = lastItem;
  });

  let Title = convertComponent(title);
  let Content = convertComponent(content);
  const isStringTypeTitle = typeof Title === 'string';
  const isStringTypeContent = typeof Content === 'string';

  return (
    <Styled.AppModal
      data-component-name="AppModal"
      ref={modalRef}
      className={cx({ modal__container_padding_none: paddingNone })}
      hideButton={hideButton}
    >
      <div className="modal__header">
        <div
          className={cx('modal__title', { default: isStringTypeTitle || isTitleDefault })}
          style={{ textAlign: alignConfig.title }}
        >
          {isStringTypeTitle ? (
            <>
              <h2>{Title}</h2>
              {headerCenterText && (
                <div className="modal__center_text" style={headerCenterTextStyle}>
                  <p title={headerCenterText}>{headerCenterText}</p>
                </div>
              )}
            </>
          ) : (
            <>{Title}</>
          )}
          {isCloseIcon && (
            <IconButton aria-label="close modal" className="modal__close_btn" onClick={onCancel}>
              <CloseIcon htmlColor="white" fontSize="inherit" className="modal__close_icon" />
            </IconButton>
          )}
        </div>
      </div>
      <div className="modal__body">
        <div
          className={cx('modal__content', {
            default: isStringTypeContent || isContentDefault,
          })}
          style={{ textAlign: alignConfig.content }}
        >
          {isContentDefault ? (
            <div className="modal__content_card" style={contentCardStyle}>
              {Content}
            </div>
          ) : (
            <>{Content}</>
          )}
        </div>
      </div>
      <div className="modal__footer" hidden={hideButton}>
        <div
          className={cx('modal__btn_box', { default: !button, reverse: reverseButton })}
          style={{
            textAlign: alignConfig.button || 'center',
          }}
        >
          {button ? (
            <>{button}</>
          ) : (
            <StyledInShadowButtonOuter
              // bottom={30}
              // left={'50%'}
              // marginLeft={-170}
              width={340}
              height={60}
              marginTop={-40}
              bgColor={color.navy_blue}
            >
              <MuiButton
                config={{
                  width: '320px',
                  color: color.blue,
                }}
                // disabled
                disableElevation
                variant="contained"
                onClick={() => {
                  onClick();
                  if (okLink) history.push(okLink);
                }}
                className="md border-radius-round"
              >
                {okText}
                <CloseIconButton onCancel={onCancel} />
              </MuiButton>
            </StyledInShadowButtonOuter>
          )}
        </div>
      </div>
    </Styled.AppModal>
  );
}
const Styled = {
  AppModal: styled.section`
    border-radius: 15px;
    background-color: ${color.navy_blue};
    &.modal__container_padding_none {
      padding: 0;
    }
    & {
      .modal__header {
        position: relative;
        .modal__title.default {
          font-size: 20px;
          color: white;
          padding: 18px 40px 7px 40px;
          text-align: left;
          h2 {
            font-weight: 700;
          }
        }
        .modal__center_text {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          margin-top: 5px;
          height: 40px;
          min-width: 320px;
          padding: 0 15px;
          border-radius: 20px;
          background-color: #4553a2;
          box-shadow: inset 0 3px 3px rgba(0, 0, 0, 0.16);
          font-size: 13px;
          font-weight: 500;
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .modal__close_btn {
          position: absolute;
          top: 50%;
          right: 25px;
          transform: translateY(-50%);
          margin-top: 5px;
          width: 30px;
          height: 30px;
          border: 1px solid white;
          border-radius: 50%;
          font-size: 22px;
        }
      }
      .modal__body {
        position: relative;
        .modal__content.default {
          padding: 10px;
          font-size: 15px;
          .modal__content_card {
            position: relative;
            padding: 35px;
            padding-bottom: ${({ hideButton }) => !hideButton && '70px'};
            background-color: white;
            border-radius: 15px;
            line-height: 1.1;
          }
        }
      }
      .modal__footer {
        position: relative;
        .modal__btn_box.default {
          margin-top: -10px;
          .modal__cancel_btn {
            position: absolute;
            top: 50%;
            right: 6px;
            transform: translateY(-50%);
            width: 30px;
            height: 30px;
            border: 1px solid white;
            border-radius: 50%;
            font-size: 16px;
          }
        }
      }
    }
  `,
};

export default React.memo(AppModal);

// <div className="modal__btn_group">
//   <div
//     className="cursor-pointer modal__btn ok"
//     onClick={() => {
//       onClick();
//       if (okLink) history.push(okLink);
//     }}
//   >
//     <Ok />
//     <IconButton
//       aria-label="cancel modal"
//       className="modal__cancel_btn"
//       onClick={e => {
//         e.stopPropagation();
//         onCancel();
//         if (cancelLink) history.push(cancelLink);
//       }}
//     >
//       <CloseIcon htmlColor="white" fontSize="inherit" className="modal__close_icon" />
//     </IconButton>
//   </div>
// </div>

// .modal__btn_box.default {
//   margin-top: -45px;
//   .modal__btn_group {
//     display: inline-block;
//     padding: 10px;
//     border-radius: 35px;
//     background-color: ${color.navy_blue};
//   }
//   .modal__btn {
//     position: relative;
//     min-width: 320px;
//     min-height: 56px;
//     padding: 18px 0;
//     background-color: ${color.navy_blue};
//     border: 2px solid white;
//     border-radius: 30px;
//     font-size: 16px;
//     color: white;
//     font-weight: 700;
//   }
//   .modal__cancel_btn {
//     position: absolute;
//     top: 50%;
//     right: 6px;
//     transform: translateY(-50%);
//     width: 40px;
//     height: 40px;
//     border: 1px solid white;
//     border-radius: 50%;
//   }
// }
