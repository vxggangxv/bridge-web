import React, { useEffect } from 'react';
// import { AppActions, BaseActions } from 'store/actionCreators';
import FullScreenLoading from 'components/base/loading/FullScreenLoading';
import ErrorContainer from 'containers/base/ErrorContainer';
import { useShallowSelector } from 'lib/utils';
import storage, { keys } from 'lib/storage';
import PopupContainer from 'containers/common/popup/PopupContainer';
import PopupsContainer from 'containers/common/popup/PopupsContainer';
import T from 'components/common/text/T';
import I18nLanguage from 'components/base/language/I18nLanguage';
import ToastsContainer from 'containers/base/ToastsContainer';
import UploadProgress from 'components/base/progress/UploadProgress';
import { pageUrl } from 'lib/mapper';
import { useHistory } from 'react-router-dom';

// NOTE: 초기 landing, error, notifications, popup 등록
// DEBUG: 차후 성능적인 문제 발생시 apiCalling분리
function Core() {
  const { user, accessToken, landing, apiCalling, toasts, popups, test } = useShallowSelector(
    state => ({
      user: state.user.user,
      accessToken: state.auth.accessToken,
      landing: state.app.landing,
      apiCalling: state.app.apiCalling,
      toasts: state.app.toasts,
      popups: state.app.popups,
    }),
  );
  const history = useHistory();

  // NOTE: 초기화 함수
  // user가 없는 경우 == login이 안된경우, autn_sign_out() 실행
  const initialize = async () => {
    // if (!user && ) {
    //   history.push(pageUrl.auth.signOut);
    // }
    // AppActions.exit_landing();
  };

  useEffect(() => {
    initialize();
  }, []);

  // TEMP:
  // useEffect(() => {
  //   console.log(accessToken, 'accessToken');
  // }, [accessToken]);

  // useEffect(() => {
  //   console.log(apiCalling, 'apiCalling');
  //   console.log(landing, 'landing');
  //   console.log(toasts, 'toasts');
  //   // BaseActions.response_status(400);
  //   console.log(popups, 'popups');
  // }, [apiCalling, landing, toasts, popups]);

  // useEffect(() => {
  //   console.log(selector, 'selector');
  // }, [selector]);

  useEffect(() => {
    // AppActions.add_popup({
    //   isOpen: true,
    //   title: 'Title',
    //   content: 'Cotnent',
    // });
    // AppActions.add_popup({
    //   isOpen: true,
    //   title: 'Title1',
    //   content: 'Cotnent1',
    //   hideBackdrop: true,
    // });
    // AppActions.add_popup({
    //   isOpen: true,
    //   title: 'Title2',
    //   content: 'Cotnent2',
    //   hideBackdrop: true,
    // });
  }, []);

  const isVisibleLoading = [apiCalling].some(item => item === true);

  return (
    <>
      <FullScreenLoading visible={isVisibleLoading} type="linear" />
      {/* reponse error status 관리 */}
      <ErrorContainer />
      {/* 하위 호환용 차후 전체 변경 고려 */}
      {/* <PopupContainer /> */}
      <PopupsContainer />
      {/* 토스트 알림 */}
      <ToastsContainer />
      {/* <NotifyToast /> */}
      {/* 파일 업로드 진행 바 */}
      <UploadProgress />
      <I18nLanguage />
    </>
  );
}

// export default Core;

export default Core;
