import React, { useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
// import uuid from 'react-uuid';
import _ from 'lodash';
import { buttonBlue, font, color } from 'styles/utils';
import { Link } from 'react-router-dom';
import EscapeConvert from 'components/common/convert/EscapeConvert';
import { icon_modal_alert } from 'components/base/images';
import { useImmer } from 'use-immer';

// const modalUuid = uuid().split('-').join('');
const convertEscape = text => <EscapeConvert prev={'\n'} next={<br />} content={text} />;

const contentTypeCheck = (data, text = '') => {
  // const hasData = !!data;
  const conditionConfig = {
    value: '',
    isTypeString: false,
  };

  // NOTE: 데이터 없을 경우 에러 처리
  if (data) {
    conditionConfig.value = data;
  }

  // NOTE: string 처리
  if (data && typeof data === 'string') {
    conditionConfig.value = convertEscape(data);
    conditionConfig.isTypeString = true;
  }

  return conditionConfig;
};

const AppModalState = {
  loading: null,
};

function AppModal(props) {
  const {
    type = '',
    title = {},
    content = {},
    isTitleDefault = false,
    isContentDefault = false,
    button = {},
    hideButton = null,
    reverseButton = null,
    onClick = () => {},
    onCancel = () => {},
    align = [],
    okText = '',
    okLink = '',
    cancelText = '',
    cancelLink = '',
    paddingNone = null,
  } = props;

  const [values, setValues] = useImmer(AppModalState);
  const modalRef = useRef(null);
  const valuesLoading = values.loading;

  useLayoutEffect(() => {
    setValues(draft => {
      draft.loading = false;
    });
  }, []);

  const alignConfig = {
    title: '',
    content: '',
    button: '',
  };

  align.map(i => {
    const splitItem = i.split('.');
    const headItem = _.head(splitItem);
    const lastItem = _.last(splitItem);
    return (alignConfig[headItem] = lastItem);
  });

  const titleObj = contentTypeCheck(title);
  const contentObj = contentTypeCheck(content);
  const okObj = contentTypeCheck(okText);
  const cancelObj = contentTypeCheck(cancelText);

  const Title = () => titleObj.value;
  const Content = () => contentObj.value;
  const Button = () => button;
  const Ok = () => okObj.value;
  const Cancel = () => cancelObj.value;

  if (valuesLoading) return null;
  return (
    <Styled.AppModal
      data-component-name="AppModal"
      ref={modalRef}
      className={cx({ modal__container_padding_none: paddingNone })}
    >
      <div className="modal__header">
        <div
          className={cx('modal__title', { default: titleObj?.isTypeString || isTitleDefault })}
          style={{ textAlign: alignConfig.title }}
        >
          <Title />
        </div>
      </div>
      <div className="modal__body">
        <div
          className={cx('modal__content', {
            default: (contentObj?.isTypeString && !paddingNone) || isContentDefault,
          })}
          style={{ textAlign: alignConfig.content }}
        >
          <Content />
        </div>
      </div>
      <div className="modal__footer" hidden={hideButton}>
        <div
          className={cx('modal__btn_box', { default: !button, reverse: reverseButton })}
          style={{
            textAlign: alignConfig.button || 'right',
          }}
        >
          {button ? (
            <Button />
          ) : (
            <>
              {type === 'confirm' && (
                <>
                  {cancelLink ? (
                    <Link to={cancelLink}>
                      <button className="modal__btn cancel" onClick={onCancel}>
                        <Cancel />
                      </button>
                    </Link>
                  ) : (
                    <button className="modal__btn cancel" onClick={onCancel}>
                      <Cancel />
                    </button>
                  )}
                </>
              )}
              {okLink ? (
                <Link to={okLink}>
                  <button className="modal__btn ok" onClick={onClick}>
                    <Ok />
                  </button>
                </Link>
              ) : (
                <button className="modal__btn ok" onClick={onClick}>
                  <Ok />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Styled.AppModal>
  );
}
const Styled = {
  AppModal: styled.div`
    /* text-align: left; */
    padding: 40px 35px 30px 35px;
    &.modal__container_padding_none {
      padding: 0;
    }
    & {
      .modal__header {
        .modal__title.default {
          position: relative;
          ${font(18, color.black_font)};
          font-weight: bold;
          /* margin: 40px 35px 0px 40px; */
          padding-left: 30px;
          margin-bottom: 15px;
          text-align: left;
          &:before {
            content: '';
            position: absolute;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            margin-top: -1px;
            display: inline-block;
            width: 32px;
            height: 32px;
            background: url(${icon_modal_alert}) no-repeat 0 center;
          }
        }
      }
      .modal__body {
        .modal__content.default {
          /* margin: 0px 35px 0px 40px; */
          margin-bottom: 20px;
          padding-left: 32px;
          ${font(15, color.black_font)};
          text-align: left;
          line-height: 22px;
        }
      }
      .modal__footer {
        .modal__btn_box.default {
          /* margin: 0px 35px 30px 40px; */
          text-align: right;
          .modal__btn {
            ${buttonBlue};
            min-width: 80px;
            padding-left: 0;
            padding-right: 0;
            border-radius: 5px;
            font-weight: 700;
            &:not(:first-child) {
              margin-left: 5px;
            }
            &.cancel {
              background: white;
              border: 1px solid ${color.blue};
              color: ${color.blue};
            }
          }
          &.reverse {
            display: flex;
            flex-direction: row-reverse;
            .modal__btn {
              &:not(:first-child) {
                margin-left: 0px;
              }
              &:not(:last-child) {
                margin-left: 5px;
              }
            }
          }
        }
      }
    }
  `,
};

export default AppModal;
