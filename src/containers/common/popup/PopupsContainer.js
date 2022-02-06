import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import { useShallowSelector } from 'lib/utils';
import React, { Fragment } from 'react';
import { AppActions } from 'store/actionCreators';

// basePopup.isOpen
// basePopup.type
// basePopup.key
// basePopup.dim
// basePopup.onClick
// basePopup.onCancel

/**
 *
 * @param {*} props
 */
function PopupContainer() {
  const { popups } = useShallowSelector(state => ({
    popups: state.app.popups,
  }));

  if (!popups.length) return null;
  return (
    <>
      {popups.map((item, index) => {
        // init props
        const { id } = item;
        const {
          isOpen = false,
          children = '',
          dim = true,
          onExited = () => {},
          width = 600,
          hideBackdrop = false,
          timeout = 250, // 연속 모달의 경우 0을 넣어줘야 깜빡임 효과 사라짐
          // AppModal props
          type = 'alert',
          title = 'Alert',
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
          // cancelText = 'CANCEL',
          cancelLink = '',
          paddingNone = false,
          isCloseIcon = false,
        } = item.config;

        return (
          <Fragment key={index}>
            <PlainModal
              isOpen={isOpen}
              onClick={() => AppActions.remove_popup_delay({ id, isOpen: false })}
              onExited={onExited}
              dim={dim}
              width={width}
              hideBackdrop={hideBackdrop}
              timeout={timeout}
            >
              <AppModal
                type={type}
                title={title}
                headerCenterText={headerCenterText}
                headerCenterTextStyle={headerCenterTextStyle}
                content={content}
                contentCardStyle={contentCardStyle}
                isTitleDefault={isTitleDefault}
                isContentDefault={isContentDefault}
                button={button}
                hideButton={hideButton}
                reverseButton={reverseButton}
                okText={okText || 'OK'}
                okLink={okLink}
                // cancelText={cancelText || 'Cancel'}
                cancelLink={cancelLink}
                align={align}
                paddingNone={paddingNone}
                isCloseIcon={isCloseIcon}
                onClick={() => {
                  AppActions.remove_popup_delay({ id, isOpen: false });
                  onClick();
                }}
                onCancel={() => {
                  AppActions.remove_popup_delay({ id, isOpen: false });
                  onCancel();
                }}
              />
            </PlainModal>
          </Fragment>
        );
      })}
    </>
  );
}

export default PopupContainer;
