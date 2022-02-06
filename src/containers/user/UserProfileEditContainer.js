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

export default React.memo(function UserProfileEditContainer() {
  const { language, dofOauth2Profile, dofOauth2ProfileSuccess } = useShallowSelector(state => ({
    language: state.base.language,
    dofOauth2Profile: state.auth.dofOauth2Profile.data,
    dofOauth2ProfileSuccess: state.auth.dofOauth2Profile.success,
  }));

  const { uid } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const connectProfileUrl = dofOauth2Profile?.connectUrl;
  const iframeUrl = useInput('');
  const lastUrl = pathname.split('/').pop();

  useEffect(() => {
    // AuthActions.dof_oauth2_password_request();
    AuthActions.dof_oauth2_profile_request();
  }, []);

  useDidUpdateEffect(() => {
    if (lastUrl === 'edit' && connectProfileUrl) {
      iframeUrl.setValue(connectProfileUrl);
    }
  }, [connectProfileUrl]);

  const [contentHeight, setContentHeight] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(0);
  const [iframeCancel, setIframeCancel] = useState(false);
  const [isModifySuccess, setIsModifySuccess] = useState(false);

  const [isProgress, setIsProgress] = useState(true);

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
    if (!isProgress) {
      // console.log('isProgress ___ ', isProgress);
      setContentHeight(iframeHeight);
    }
  }, [iframeHeight, isProgress]);

  // useEffect(() => {
  //   document
  //     .getElementById('profileEditIframe')
  //     .contentWindow.postMessage({ language: language }, '*');
  // }, [language]);

  useEffect(() => {
    window.addEventListener('message', handlePostMessage);
    return () => {
      window.removeEventListener('message', handlePostMessage, false);
    };
  }, []);

  useDidUpdateEffect(() => {
    if (!!iframeCancel) {
      // history.push(`/@${uid}/profile`);
      history.goBack();
    }
    if (!!isModifySuccess) {
      // history.push(`/@${uid}/profile`);
      history.goBack();
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
        <h1 className="page-title">
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
      top: 250px;
      left: 0;
      width: 100%;
      text-align: center;
      visibility: ${({ isProgress }) => (!!isProgress ? 'visible' : 'hidden')};
    }
    .UserProfileEdit__container_wrapper {
      display: flex;
      justify-content: center;
      .UserProfileEdit__container {
        background-color: #ffffff;

        .UserProfileEdit__container_iframe {
          /* width: 900px; */
          width: 850px;
          margin: 0 auto;
          background-color: #ffffff;
          height: ${({ contentHeight }) => (!!contentHeight ? contentHeight + 'px' : '0px')};
          overflow: hidden;
          visibility: ${({ isProgress }) => (!!isProgress ? 'hidden' : 'visible')};
        }
      }
    }
  `,
};
