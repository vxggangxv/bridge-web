import T from 'components/common/text/T';
import MainHome from 'components/home/MainHome';
import MainNotice from 'components/home/MainNotice';
import useInput from 'lib/hooks/useInput';
import { pageUrl } from 'lib/mapper';
import { useShallowSelector, useDidUpdateEffect } from 'lib/utils';
import queryString from 'query-string';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { AppActions, AuthActions, UserActions } from 'store/actionCreators';
import { isLogInSelector } from 'store/modules/auth';
import storage, { keys, setCookie, setSessionCookie } from 'lib/storage';

export default function MainHomeContainer(props) {
  const {
    isLogIn,
    loginUrl,
    userInfo,
    userInfoSuccess,
    fetchUserProfile,
    fetchUserProfileSuccess,
  } = useShallowSelector(state => ({
    isLogIn: isLogInSelector(state),
    userInfo: state.user.overview,
    userInfoSuccess: state.user.overview.success,
    fetchUserProfile: state.user.fetchProfileOauth2,
    fetchUserProfileSuccess: state.user.fetchProfileOauth2.success,
  }));

  // const userInfoData = userInfo?.data?.profile;
  const userInfoData = fetchUserProfile.data?.profile;

  const location = useLocation();
  const history = useHistory();
  const queryParse = queryString.parse(location.search);
  const accessToken = queryParse?.accessToken;
  const isExtraInfo = Number(queryParse?.isExtraInfo);
  const failure = queryParse?.failure;
  const { t } = useTranslation();
  const isOpenLegalPopup = useInput(false);

  const { pathname, search, state } = location;
  // const queryParse2 = queryString.parse(search);
  const from = state?.hasOwnProperty('from') ? state.from : { pathname };
  // NOTE: ErrorContainer 에서 returnPath 넘겨줬을 경우, PrivateRoute에서 from을 넘겨줬을경우
  const returnPath = queryParse?.returnPath || from.pathname;

  const handleGetStarted = () => {
    // const submitData = {
    //   return_url: window.location.protocol + '//' + window.location.host + '/home',
    //   failure_url: window.location.protocol + '//' + window.location.host + '/home',
    //   // return_url: 'http://15.164.27.98:28030/home',
    //   // failure_url: 'http://15.164.27.98:28030/home',
    // };
    // storage.set('returnPath', returnPath);
    // if (!isLogIn) return AuthActions.dof_oauth2_signin_request(submitData);
    history.push(pageUrl.project.create);
  };

  const loginFailurePopup = useCallback(() => {
    AppActions.add_popup({
      isOpen: true,
      type: 'alert',
      title: <T>GLOBAL_ALERT</T>,
      content: t('ALARM_LOGIN_FAILURE'),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        // window.history.replaceState('', '', window.location.href.split('?')[0]);
        // history.replace(location.pathname);
        return;
      },
    });
  }, []);

  // TEST:
  useEffect(() => {
    if (Object.keys(queryParse).length > 0) {
      //queryParse 존재 여부 확인
      console.log('login 시도');
      if (!!failure) {
        loginFailurePopup();
      } else if (!!accessToken) {
        // 토큰 있으면 로그인
        // console.log('Token 있음 _________ ', accessToken);
        // console.log('isExtraInfo ___________________________ ', isExtraInfo);
        if (!!isExtraInfo) {
          isOpenLegalPopup.setValue(true);
          // history.replace(location.pathname);
        } else {
          setCookie(keys.remember_user_token, accessToken, { 'max-age': 3600 * 6 });
          setSessionCookie(keys.sign_in_token, accessToken);
          AuthActions.set_access_token(accessToken);
          UserActions.fetch_profile_request();
          UserActions.fetch_overview_request();
          // history.replace(location.pathname);
        }
        // window.history.replaceState('', '', window.location.href.split('?')[0]);
        // history.replace(location.pathname);
      } else {
        // console.log('잘못된 쿼리스트링 => url replace');
        loginFailurePopup();
        // window.history.replaceState('', '', window.location.href.split('?')[0]);
      }
    }
  }, []);

  useDidUpdateEffect(() => {
    if (isLogIn) {
      const returnPath = storage.get('returnPath');
      storage.remove('returnPath');
      history.push(returnPath);
    }
  }, [isLogIn]);

  // user module에서 해주고 있어서 불필요
  // useDidUpdateEffect(() => {
  //   if (fetchUserProfileSuccess) {
  //     const { userCode, profileImg, company } = userInfoData;
  //     let userInfo = {
  //       userCode,
  //       profileImg,
  //       company,
  //       autoLogin: true,
  //     };
  //     storage.set(keys.user, userInfo);
  //     UserActions.set_user(userInfo);
  //   }
  // }, [fetchUserProfileSuccess === true]);

  return (
    <>
      <MainHome
        isOpenLegalPopup={isOpenLegalPopup}
        accessToken={accessToken}
        onGetStarted={handleGetStarted}
      />
      {/* <MainNotice /> */}
    </>
  );
}
