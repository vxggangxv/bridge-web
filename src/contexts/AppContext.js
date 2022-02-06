import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { useLocation } from 'react-router-dom';
import { cutUrl } from 'lib/library';
import _ from 'lodash';
import { isLogInSelector } from 'store/modules/auth';
import { ProjectSocketProvider } from 'contexts/ProjectSocketContext';
import { PrivateSocketProvider } from 'contexts/PrivateSocketContext';
import { lightTheme, darkTheme } from 'styles/utils';

// const socket = io(BASE_SOCKET_PRIVATE_URL, {
//   autoConnect: false,
//   auth: { 'x-access-token': store.getState().auth.accessToken },
// });
// let socket;
// if (store.getState().auth.accessToken) {
//   console.log('실행!! private');
//   socket = io(BASE_SOCKET_PRIVATE_URL, {
//     autoConnect: false,
//     auth: { 'x-access-token': store.getState().auth.accessToken },
//   });
// }

export const AppContext = createContext();

export function AppProvider({ value, children }) {
  const { user, isLogin, signUpSuccess, signUpFailure, signOutSuccess, projectData } =
    useShallowSelector(state => ({
      user: state.user.user,
      isLogin: isLogInSelector(state),
      signUpSuccess: state.auth.signUp.success,
      signUpFailure: state.auth.signUp.failure,
      signOutSuccess: state.auth.signOut.success,
      projectData: state.project.project.data,
    }));
  const { pathname } = useLocation();
  const isProjectDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  const isAuthPage = `${cutUrl(pathname)}` === 'auth';
  const isMyPage = cutUrl(pathname).includes('@');
  const userCode = user?.userCode || 'userCode';
  const projectSenderCode = projectData?.projectInfo?.senderCode;

  // NOTE: check create project page and client
  const isProjectClient = useMemo(() => {
    return isProjectDetailPage && userCode === projectSenderCode;
  }, [pathname, isProjectDetailPage, projectSenderCode]);
  // state
  // const [isProjectClient, setIsProjectClient] = useState(null);
  const [appTheme, setAppTheme] = useState('light');
  const theme = appTheme === 'dark' ? darkTheme : lightTheme;

  // NOTE: check create project page and client
  // useEffect(() => {
  //   // console.log('pathname', pathname);
  //   setIsProjectClient(isProjectDetailPage && userCode === projectSenderCode);
  //   // console.log(
  //   //   'isProjectDetailPage && userCode === projectSenderCode',
  //   //   isProjectDetailPage && userCode === projectSenderCode,
  //   // );
  // }, [pathname, isProjectDetailPage, projectSenderCode]);

  return (
    <AppContext.Provider value={{ isProjectClient, theme, setAppTheme }}>
      <PrivateSocketProvider>
        <ProjectSocketProvider>{children}</ProjectSocketProvider>
      </PrivateSocketProvider>
    </AppContext.Provider>
  );
}

// export const useAppContextValue = () => {
//   const value = useContext(AppContext);
//   return value;
// };
