import React, { useEffect } from 'react';
import { useShallowSelector } from 'lib/utils';
import { AppActions } from 'store/actionCreators';
import styled, { keyframes } from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel';
// import CachedIcon from '@material-ui/icons/Cached';
import LoopIcon from '@material-ui/icons/Loop';
import EscapeConvert from 'components/common/convert/EscapeConvert';
import { color } from 'styles/utils';
import { complete_check, icon_alarm } from 'components/base/images';
import moment from 'moment';
import MuiButton from 'components/common/button/MuiButton';
import PaperPlaneIcon from 'components/base/icons/PaperPlaneIcon';
import cx from 'classnames';
import { notificationsModalEventType, pageUrl } from 'lib/mapper';
import { useHistory } from 'react-router';

/**
 * 사용법
 * AppActions.show_toast({config});
 * config = {
 *  eventType: 'defalut' - default, client, designer (show 기준, client보여줄지, designer에게 보여줄지 따라서 바뀜)
 *  type: 'default' - default, success, error, warning, info, dark
 *  duration: 5000 - 실행 초(1000ms)
 *  content:
 *   '' - 문자
 *   () => {} - 함수(컴포넌트)
 * }
 */
function ToastsContainer(props) {
  const { toasts } = useShallowSelector(state => ({
    toasts: state.app.toasts,
  }));
  const history = useHistory();

  // const ToastContent = () => {
  //   return (
  //     <>
  //       토스트 등장!!
  //       <br />
  //       Toast Show!!
  //     </>
  //   );
  // };

  useEffect(() => {
    // AppActions.show_toast({ message: '복사 완료 Copy successed' });
    // AppActions.show_toast({ message: () => <ToastContent /> });
  }, []);

  if (!toasts.length) return null;
  return (
    <Styled.ToastsContainer data-component-name="ToastsContainer">
      {toasts.map((item, index) => {
        const { id } = item;
        let {
          // project 알림
          eventTypeIdx = null,
          userCode = '',
          params = {},
          eventType = 'default',
          okText = '',
          //
          isAutoRemove = true,
          type = 'info',
          position = 'bottom-right',
          delay,
          animation = 'fadeInOutSlideRight',
          message = '',
        } = item.config;
        let duration = delay / 1000;
        // string, function message
        let Message = () => {};

        if (message) Message = message;
        if (message && typeof message === 'string')
          Message = () => <EscapeConvert content={message} />;

        if (isAutoRemove === false) animation = 'fadeInSlideRight';

        const typeIcon = {
          success: <CheckCircleIcon />,
          error: <CancelIcon />,
          info: <InfoIcon />,
          warning: <ErrorIcon />,
          loading: <LoopIcon />,
        };
        const isMatchClientEventType = eventType === notificationsModalEventType.client;
        const isMatchDesignerEventType = eventType === notificationsModalEventType.designer;

        if (isMatchClientEventType || isMatchDesignerEventType) {
          console.log('eventTypeIdx', eventTypeIdx);
          const { designer = '', projectCode = '', projectId = '' } = params;

          return (
            <div
              key={index}
              className="socketToasts toasts-common"
              data-animation={animation}
              style={{
                animationDuration: `${duration}s`,
              }}
            >
              <div className="socketToasts__header">
                {moment().format('YYYY-MM-DD HH:mm')}
                <div className="socketToasts__alarm_box">
                  {eventTypeIdx === 1 && <PaperPlaneIcon width={35} />}
                  {eventTypeIdx !== 1 && (
                    <figure className="socketToasts__alarm_figure">
                      <img src={icon_alarm} alt="alarm" width={30} />
                    </figure>
                  )}
                </div>
                <CloseIcon
                  className="socketToasts__close_icon"
                  onClick={() => AppActions.remove_toast({ id })}
                />
              </div>
              <div className="socketToasts__body">
                <div className="socketToasts__content">
                  {eventTypeIdx !== 1 && (
                    <div className="socketToasts__check">
                      <img src={complete_check} alt="check" />
                    </div>
                  )}
                  <div className={cx('socketToasts__message_box', { invite: eventTypeIdx === 1 })}>
                    <div
                      className="socketToasts__message_id"
                      title={isMatchClientEventType ? projectId : designer}
                    >
                      {isMatchClientEventType ? `Project: ${projectId}` : `Designer: ${designer}`}
                    </div>
                    <div className="socketToasts__message_text">
                      <Message />
                    </div>
                  </div>
                </div>
                <MuiButton
                  config={{
                    startIcon: <PaperPlaneIcon color="#fff" width={14} />,
                    iconMarginAlign: 10,
                  }}
                  disableElevation
                  variant="contained"
                  color="primary"
                  className="socketToasts__action_btn sm"
                  onClick={() => {
                    if (!!projectCode) {
                      // history.push(`${pageUrl.project.detail}?projectCode=${projectCode}`);
                      console.log('url', `/project/detail/${projectCode}`);
                      history.push(`/project/detail/${projectCode}`);
                    }
                    AppActions.remove_toast({ id });
                  }}
                >
                  {okText}
                </MuiButton>
              </div>
            </div>
          );
        }
        return (
          <div
            key={index}
            className="toasts toasts-common"
            data-type={type}
            data-position={position}
            data-animation={animation}
            style={{
              animationDuration: `${duration}s`,
            }}
          >
            <CloseIcon
              className="toasts__close_icon"
              onClick={() => AppActions.remove_toast({ id })}
            />
            {typeIcon[type] && <span className="toast__type_icon">{typeIcon[type]}</span>}
            <div className="toast__message">
              <Message />
            </div>
          </div>
        );
      })}
      {/* <div className="toasts" data-type={'default'} data-position={'bottom-right'}>
        <CloseIcon className="toasts__close_icon" />
        <ToastContent />
      </div> */}
    </Styled.ToastsContainer>
  );
}

const fadeInSlideRight = keyframes`
  0% {
    opacity: 0;
    right: -400px;
  }

  5% {
    right: 0px;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }
  
  95% {
    right: 0px;
  }

  100% {
    /* opacity: 0; */
    right: -400px;
  }
`;

const fadeInOutSlideRight = keyframes`
  0% {
    opacity: 0;
    right: -400px;
  }

  5% {
    right: 0px;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }
  
  95% {
    right: 0px;
  }

  100% {
    opacity: 0;
    right: -400px;
  }
`;

const socketToastsBorderRadius = '15px';

const Styled = {
  ToastsContainer: styled.div`
    z-index: 1500;
    position: fixed;
    bottom: 50px;
    right: 40px;
    .toasts-common {
      &:not(:first-child) {
        margin-top: 15px;
      }
      &[data-animation='fadeInSlideRight'] {
        opacity: 0;
        right: -400px;
        animation-name: ${fadeInSlideRight};
        animation-fill-mode: forwards;
      }
      &[data-animation='fadeInOutSlideRight'] {
        opacity: 0;
        right: -400px;
        animation-name: ${fadeInOutSlideRight};
      }
    }
    .toasts {
      position: relative;
      display: flex;
      align-items: center;
      width: 250px;
      padding: 15px;
      padding-left: 10px;
      background-color: #fff;
      border-left: 3px solid gray;
      box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.15);
      border-radius: 3px;
      overflow: hidden;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.3;

      &[data-type='default'] {
        /* background-color: #fff;
         color: #888; */
        border-left-color: gray;
        color: #888;
      }
      &[data-type='success'] {
        /* background-color: #07c50e;
        color: #fff; */
        border-left-color: #6ac259;
        .toast__type_icon {
          color: #6ac259;
        }
      }
      &[data-type='error'] {
        /* background-color: #e85642;
        color: #fff; */
        border-left-color: #d80026;
        .toast__type_icon {
          color: #d80026;
        }
      }
      &[data-type='info'] {
        /* background-color: #41a3e2;
        color: #fff; */
        border-left-color: #016df0;
        .toast__type_icon {
          color: #016df0;
        }
      }
      &[data-type='warning'] {
        /* background-color: #f3ca12;
        color: #fff; */
        border-left-color: #ffda43;
        .toast__type_icon {
          color: #ffda43;
        }
      }
      &[data-type='loading'] {
        /* color: #fff; */
        border-left-color: #0389ff;
        .toast__type_icon {
          color: #0389ff;
        }
      }
      &[data-type='dark'] {
        background-color: #000;
        color: #fff;
      }
      .toast__type_icon {
        margin-right: 5px;
        &,
        svg {
          width: 20px;
          height: 20px;
        }
      }
      .toasts__close_icon {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
      .toast__message {
        word-break: break-all;
      }
    }
    .socketToasts {
      position: relative;
      width: 330px;
      background-color: #fff;
      box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.15);
      border-radius: ${socketToastsBorderRadius};
      /* border-top-left-radius: ${socketToastsBorderRadius};
      border-top-right-radius: ${socketToastsBorderRadius}; */
      //

      &:not(:first-child) {
        margin-top: 15px;
      }

      .socketToasts__header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 25px;
        height: 35px;
        border-top-left-radius: ${socketToastsBorderRadius};
        border-top-right-radius: ${socketToastsBorderRadius};
        background-color: ${color.blue};
        font-size: 12px;
        color: #fff;
        .socketToasts__close_icon {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
        .socketToasts__alarm__time {
          font-size: 12px;
        }
        .socketToasts__alarm_box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          background-color: #fff;
          border: 2px solid ${color.blue};
          border-radius: 50%;
          .socketToasts__alarm_figure {
            position: relative;
            &:after {
              content: '';
              position: absolute;
              top: 0px;
              right: 0px;
              display: block;
              width: 13px;
              height: 13px;
              border-radius: 10px;
              background-color: ${color.blue};
            }
          }
        }
      }

      .socketToasts__body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 25px;
        border: 2px solid ${color.blue};
        border-top: none;
        border-bottom-left-radius: ${socketToastsBorderRadius};
        border-bottom-right-radius: ${socketToastsBorderRadius};
        .socketToasts__content {
          display: flex;
          align-items: center;
          .socketToasts__check {
            margin-right: 10px;
            width: 50px;
            img {
              width: 100%;
            }
          }
          .socketToasts__message_box {
            &:not(.invite) {
              width: calc(100% - 50px);
            }
            .socketToasts__message_id {
              font-size: 12px;
              color: ${color.gray_font};
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .socketToasts__message_text {
              font-size: 15px;
              letter-spacing: -0.3px;
              line-height: 1.3;
            }
          }
        }

        .socketToasts__action_btn {
          /* width: calc(100% - 40px); */
          margin-top: 15px;
        }
      }
    }
  `,
};

export default ToastsContainer;
