import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useShallowSelector, useDidUpdateEffect } from 'lib/utils';
import { AppActions, AuthActions, BaseActions } from 'store/actionCreators';
import useInput from 'lib/hooks/useInput';
// import storage, { keys } from 'lib/storage';
import SignIn from 'components/auth/SignIn';
import T from 'components/common/text/T';
import { isLogInSelector } from 'store/modules/auth';
// TEMP:

export default function SignInContainer(props) {
  const {
    resentLogin,
    signInSuccess,
    signInFailure,
    signInResult,
    language,
    isLogIn,
  } = useShallowSelector(state => ({
    resentLogin: state.auth.resentLogin,
    signInSuccess: state.auth.signIn.success,
    signInFailure: state.auth.signIn.failure,
    signInResult: state.auth.signIn.data?.result,
    language: state.base.language,
    isLogIn: isLogInSelector(state),
  }));
  const email = useInput('');
  const password = useInput('');
  const autoLogin = useInput(true);
  const history = useHistory();
  const { location } = history;

  // init
  useEffect(() => {
    return () => {};
  }, []);

  const queryParse = queryString.parse(location.search);
  const { from } = location.state || { from: { pathname: '/' } };
  // NOTE: ErrorContainer 에서 returnPath 넘겨줬을 경우, PrivateRoute에서 from을 넘겨줬을경우
  const returnPath =
    queryParse.returnPath || from.search ? from.pathname + from.search : from.pathname;
  // console.log('location', location);
  // console.log(returnPath, 'returnPath');

  const handleChangeLanguage = () => {
    let languageType = '';
    if (language === 'KR') languageType = 'EN';
    if (language === 'EN') languageType = 'KR';
    BaseActions.change_language(languageType);
  };

  const handleSubmit = () => {
    // console.log(email.value, 'email.value');
    // console.log(password.value, 'password.value');
    // console.log(autoLogin.value, 'autoLogin.value');
    // AuthActions.sign_in({ token: 'token', user: 'user' });
    const submitData = {
      email: email.value,
      password: password.value,
      autoLogin: autoLogin.value,
    };
    // console.log(submitData, 'submitData');
    AuthActions.sign_in_request(submitData);
    // TEMP:
    // storage.set(keys.user, userInfo);
    // setSessionCookie(keys.sign_in_token, accessToken);
    // if (autoLogin.value) setCookie(keys.remember_user_token, accessToken, { 'max-age': 3600 * 6 });
    // AuthActions.set_is_authenticated(false);
  };

  // useEffect(() => {
  //   console.log(signInFailure, 'signInFailure');
  // }, [signInFailure]);

  // signInSuccess 되면 isLogin이 true, login상태일 경우 login페이지 접근 방지, signOutSuccess시점때문에 signInSuccess 넣어줌
  useEffect(() => {
    if (signInSuccess && isLogIn) {
      // console.log('isLogIn', isLogIn);
      // console.log(returnPath, 'returnPath');
      return history.replace(returnPath);
    }
  }, [!!signInSuccess, isLogIn]);

  // 현재 signInResult 없음
  // useDidUpdateEffect(() => {
  //   if (signInFailure) {
  //     // result, emailResult 오류 핸들링 함수
  //     const resultStatusModal = (resultStatus, emailResultStatus) => {
  //       let resultModalTitle = <T>global.alert</T>;
  //       let resultModalContent = <T>modal.error</T>;
  //       // console.log(resultStatus, 'resultStatus');
  //       // console.log(emailResultStatus, 'emailResultStatus');

  //       if (resultStatus === 0) {
  //       }
  //       if (resultStatus === 2 || resultStatus === 3) {
  //         resultModalTitle = <T>signin.errorResultTitle</T>;
  //         resultModalContent = <T>signin.errorResultContent</T>;
  //       }
  //       // if (resultStatus === 3) {
  //       //   resultModalContent = 'Bad request.';
  //       // }

  //       AppActions.add_popup({
  //         isOpen: true,
  //         title: resultModalTitle,
  //         isTitleDefault: true,
  //         content: resultModalContent,
  //         isContentDefault: true,
  //       });
  //     };

  //     if (signInResult) return resultStatusModal(signInResult);
  //   }
  // }, [signInFailure === true, signInResult]);

  return (
    <SignIn
      email={email}
      password={password}
      autoLogin={autoLogin}
      resentLoginList={resentLogin}
      onChangeLanguage={handleChangeLanguage}
      onSubmit={handleSubmit}
    />
  );
}
