import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignOut from './SignOut';
import ResetPassword from './ResetPassword';
import FindAccount from './FindAccount';
import { pageUrl } from 'lib/mapper';

export default function Auth() {
  // console.log(match, 'match');
  return (
    <Switch>
      <Redirect exact path={pageUrl.auth.index} to={pageUrl.auth.signIn} />
      <Route path={pageUrl.auth.signOut} component={SignOut} />
      {/* auth/join 으로 노출된 페이지 오류 */}
      <Redirect exact path={pageUrl.auth.signIn} to={pageUrl.home} />
      <Redirect exact path={pageUrl.auth.signUp} to={pageUrl.home} />
      {/* <Route path={pageUrl.auth.signIn} component={SignIn} />
      <Route path={pageUrl.auth.signUp} component={SignUp} />
      <Route path={pageUrl.auth.resetPassword} component={ResetPassword} />
      <Route path={pageUrl.auth.findId} component={FindAccount} /> */}
      <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
    </Switch>
  );
}
