import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import useInput from 'lib/hooks/useInput';
import styled from 'styled-components';
import { beforeDash } from 'styles/utils';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { AuthActions, AppActions } from 'store/actionCreators';
import T from 'components/common/text/T';
import { CircularProgress } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';

export default React.memo(function UserProfileEditContainer({ onCloseModal = () => {} }) {
  const { language, dofOauth2Password } = useShallowSelector(state => ({
    language: state.base.language,
    dofOauth2Password: state.auth.dofOauth2Password.data,
  }));
  const connectPasswordUrl = dofOauth2Password?.connectUrl;
  const iframeUrl = useInput('');

  const [contentHeight, setContentHeight] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(0);
  const [iframeCancel, setIframeCancel] = useState(false);
  const [isModifySuccess, setIsModifySuccess] = useState(false);

  const [isProgress, setIsProgress] = useState(true);

  // useDidUpdateEffect(() => {
  //   if (changePasswordSuccess) {
  //     AppActions.add_popup({
  //       isOpen: true,
  //       title: <T>GLOBAL_ALERT</T>,
  //       content: <T>GLOBAL_COMPLETED</T>,
  //       isTitleDefault: true,
  //       isContentDefault: true,
  //       onExited() {
  //         onClose();
  //       },
  //     });
  //   }

  //   if (changePasswordFailure) {
  //     AppActions.add_popup({
  //       isOpen: true,
  //       title: <T>GLOBAL_ALERT</T>,
  //       content: <T>REGISTER_COFIRM_PASSWORD</T>,
  //       isTitleDefault: true,
  //       isContentDefault: true,
  //     });
  //   }
  // }, [changePasswordSuccess === true, changePasswordFailure === true]);

  const handlePostMessage = event => {
    // console.info('[Bridge]handlePostMessage ________________ ', event);
    if (
      event.origin == 'https://auth.doflab.com' ||
      event.origin == 'https://my.doflab.com' ||
      event.origin == 'http://15.164.27.98:27015' ||
      event.origin == 'http://localhost:3001'
    ) {
      if (!!event.data.height) {
        // console.log("event.data.height ______ ", event.data.height);
        setIframeHeight(event.data.height);
      }
      if (!!event.data.cancel) {
        // console.log("event.data.height ______ ", event.data.height);
        setIframeCancel(event.data.cancel === 'true' ? true : false);
      }
      if (!!event.data.modify) {
        // console.log("event.data.height ______ ", event.data.height);
        setIsModifySuccess(event.data.modify === 'true' ? true : false);
      }
      if (!!event.data.childProgress) {
        setTimeout(() => {
          setIsProgress(event.data.childProgress === 'false' ? false : true);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    AuthActions.dof_oauth2_password_request();
    // AuthActions.dof_oauth2_profile_request();
  }, []);

  useDidUpdateEffect(() => {
    iframeUrl.setValue(connectPasswordUrl);
  }, [connectPasswordUrl]);

  useEffect(() => {
    if (!isProgress) {
      setContentHeight(iframeHeight);
    }
  }, [iframeHeight, isProgress]);

  useEffect(() => {
    window.addEventListener('message', handlePostMessage);
    return () => {
      window.removeEventListener('message', handlePostMessage, false);
    };
  }, []);

  useDidUpdateEffect(() => {
    if (!!iframeCancel) {
      onCloseModal();
    }
    if (!!isModifySuccess) {
      onCloseModal();
      AppActions.add_popup({
        isOpen: true,
        type: 'alert',
        title: <T>GLOBAL_ALERT</T>,
        content: <T>GLOBAL_COMPLETED</T>,
        isTitleDefault: true,
        isContentDefault: true,
        onExited() {
          return;
        },
      });
    }
  }, [iframeCancel === true, isModifySuccess === true]);

  const onLoad = () => {
    document
      .getElementById('profileEditIframe')
      .contentWindow.postMessage({ language: language }, '*');
  };

  return (
    <UserProfileEdit
      iframeUrl={iframeUrl}
      contentHeight={contentHeight}
      onLoad={onLoad}
      isProgress={isProgress}
    />
  );
});

export const UserProfileEdit = React.memo(
  ({ contentHeight, iframeUrl, isProgress, onLoad = () => {} }) => {
    return (
      <Styled.UserProfileEdit
        data-component-name="UserProfileEdit"
        contentHeight={contentHeight}
        isProgress={isProgress}
      >
        <h1 className="sr-only">
          <T>USER_MENU_INFORMATION</T>
        </h1>
        <div className="userProfileEdit__loading_progress">
          <MuiWrapper>
            <CircularProgress color="primary" />
          </MuiWrapper>
        </div>
        <div className="UserProfileEdit__container_wrapper">
          <div className="UserProfileEdit__container">
            {useMemo(() => {
              return (
                <iframe
                  id="profileEditIframe"
                  className="UserProfileEdit__container_iframe"
                  onLoad={() => onLoad()}
                  src={iframeUrl.value}
                  scrolling="no"
                ></iframe>
              );
            }, [iframeUrl.value])}
          </div>
        </div>
      </Styled.UserProfileEdit>
    );
  },
);

const Styled = {
  UserProfileEdit: styled.section`
    position: relative;
    .page-title {
      ${beforeDash({})};
    }

    .userProfileEdit__loading_progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      visibility: ${({ isProgress }) => (!!isProgress ? 'visible' : 'hidden')};
    }
    .UserProfileEdit__container_wrapper {
      display: flex;
      justify-content: center;
      .UserProfileEdit__container {

        .UserProfileEdit__container_iframe {
          width: 550px;
          margin: 0 auto;
          background-color: #ffffff;
          /* height: ${({ contentHeight }) => (!!contentHeight ? contentHeight + 'px' : '0px')}; */
          height: 385px;
          overflow: hidden;
          visibility: ${({ isProgress }) => (!!isProgress ? 'hidden' : 'visible')};
        }
      }
    }
  `,
};
