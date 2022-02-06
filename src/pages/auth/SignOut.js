import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { useEffect } from 'react';
import { pageUrl } from 'lib/mapper';
import { AppActions, AuthActions, UserActions } from 'store/actionCreators';
// TEMP:
import storage, { deleteCookie, keys } from 'lib/storage';
import { signOut } from 'store/modules/auth';

export default function AuthSignOut(props) {
  const { signOutSuccess } = useShallowSelector(state => ({
    signOutSuccess: state.auth.signOut.success,
  }));

  useEffect(() => {
    signOut();
    AuthActions.sign_out_request();
    AppActions.remove_popups();
    AppActions.remove_toasts();
    //
    // TEMP: api 연동 후 reducer에서 관리
    // deleteCookie(keys.sign_in_token);
    // deleteCookie(keys.remember_user_token);
    // storage.remove(keys.user);
    // UserActions.set_user(null);
    // AuthActions.set_access_token(null);
    // // persist 삭제
    // storage.remove(`persist:${keys.persist}`);
    // sessionStorage.removeItem(`persist:${keys.persist}`);
    //
    // remove resent login
    // deleteCookie(keys.resent_login);
    // AuthActions.set_resent_login(null);
  }, []);

  return <Redirect to={pageUrl.home} />;
}
