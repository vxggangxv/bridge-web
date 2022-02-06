import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
// import { size, toArray } from 'lodash';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import styled from 'styled-components';
import { color } from 'styles/utils';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cx from 'classnames';
import { AppActions } from 'store/actionCreators';

export default React.memo(function UploadProgress(props) {
  const { fileProgress } = useShallowSelector(state => ({
    fileProgress: state.app.fileProgress,
  }));
  // console.log(fileProgress, 'fileProgress');
  const [isShow, setIsShow] = useState(null);
  const [slideAction, setSlideAction] = useState(null);
  const isDown = slideAction === 'down';
  const progressRef = useRef();

  // useEffect(() => {
  //   console.log(isDown, 'isDown');
  //   console.log(isHide, 'isHide');
  // }, [isDown, isHide]);
  useEffect(() => {
    if (progressRef.current) {
      setIsShow(true);
    }
  }, [progressRef.current]);

  const handleClose = () => {
    setIsShow(false);
    setTimeout(() => {
      AppActions.remove_upload_file_progress({ type: 'all' });
    }, 250);
  };

  // disappear when fileProgress all success
  useDidUpdateEffect(() => {
    if (fileProgress?.length > 0) {
      // 모두 완료되면 1.5초 뒤 사라짐
      if (fileProgress.every(item => item.status === 1)) {
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else if (fileProgress.some(item => item.status === 2)) {
        // 하나라도 에러일 경우 10초 뒤 사라짐
        setTimeout(() => {
          handleClose();
        }, 10000);
      }
    }
  }, [fileProgress]);

  return (
    !!fileProgress.length && (
      <Styled.UploadProgress
        data-component-name="UploadProgress"
        ref={progressRef}
        className={cx({ show: true })}
      >
        <div className="uploadProgress__header">
          <h2 className="uploadProgress__title">Uploading File</h2>
          <div className="uploadProgress__btn_box">
            {!isDown ? (
              <IconButton
                className="uploadProgress__btn slide-toggle"
                onClick={() => setSlideAction('down')}
              >
                <ExpandMoreIcon style={{ fontSize: '28px' }} />
              </IconButton>
            ) : (
              <IconButton
                className="uploadProgress__btn slide-toggle"
                onClick={() => setSlideAction('up')}
              >
                <ExpandLessIcon style={{ fontSize: '28px' }} />
              </IconButton>
            )}
            <IconButton className="uploadProgress__btn close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="uploadProgress__body">
          <ul className={cx('uploadProgress__list', { down: isDown })}>
            {fileProgress.map(item => (
              <li className="uploadProgress__item" key={item.id}>
                <div className="uploadProgress__item_content">
                  <div className="uploadProgress__bar">
                    <div style={{ width: `${item.progress}%` }} />
                  </div>
                  <p className="uploadProgress__item_name" title={item.file.name}>
                    {item.file.name}
                  </p>
                </div>
                <span className="uploadProgress__item_percentage">{item.progress}%</span>
              </li>
            ))}
            {/* <li className="uploadProgress__item">
            <div className="uploadProgress__item_content">
              <div className="uploadProgress__bar">
                <div style={{ width: `100%` }} />
              </div>
              <p className="uploadProgress__item_name">
                이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름이름
              </p>
            </div>
            <span className="uploadProgress__item_percentage">%</span>
          </li> */}
          </ul>
        </div>
      </Styled.UploadProgress>
    )
  );
});

const Styled = {
  UploadProgress: styled.div`
    z-index: 1400;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 360px;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    overflow: hidden;
    transition: all 0.25s;
    opacity: 0;
    visibility: hidden;
    &.show {
      opacity: 1;
      visibility: visible;
    }

    .uploadProgress__header {
      display: grid;
      height: 50px;
      background-color: #323232;
      padding: 0 20px;
      grid-template-columns: calc(100% - 100px) 100px;
      align-items: center;
      .uploadProgress__title {
        color: #fff;
      }
      .uploadProgress__btn_box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: -12px;
        .uploadProgress__btn {
          width: 32px;
          height: 32px;
          padding: 6px;
          color: #bbb;
          &:hover {
            background-color: rgba(255, 255, 255, 0.08);
            color: #fff;
          }
          &.slide-toggle {
            .uploadProgress__down_icon,
            .uploadProgress__up_icon {
              position: relative;
              font-size: 18px;
            }
            .uploadProgress__down_icon {
              transform: rotate(-90deg);
              top: -3px;
            }
            .uploadProgress__up_icon {
              transform: rotate(-90deg);
              top: 0px;
            }
          }
          &.close {
          }
        }
      }
    }

    .uploadProgress__body {
      background-color: #fff;
      .uploadProgress__list {
        max-height: 250px;
        overflow-y: auto;
        transition: max-height 0.25s;
        &.down {
          max-height: 0;
        }
        .uploadProgress__item {
          display: grid;
          grid-template-columns: calc(100% - 35px) 35px;
          height: 50px;

          padding: 13px 20px 0;
          &:not(:last-child) {
            border-bottom: 1px solid #ddd;
          }

          .uploadProgress__item_content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .uploadProgress__bar {
              width: 100%;
              height: 12px;
              background-color: lightgray;
              margin-bottom: 3px;
              border-radius: 20px;
            }
            .uploadProgress__bar > div {
              height: 12px;
              background-color: ${color.blue};
              border-radius: 20px;
              transition: width 1s;
            }
            .uploadProgress__item_name {
              width: 100%;
              height: 13px;
              text-align: left;
              font-size: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .uploadProgress__item_percentage {
            margin-left: 10px;
            font-size: 13px;
          }
        }
      }
    }
  `,
};
