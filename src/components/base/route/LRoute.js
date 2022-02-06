import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import FullScreenLoading from 'components/base/loading/FullScreenLoading';
import { pageUrl } from 'lib/mapper';
import { useShallowSelector } from 'lib/utils';
import { isLogInSelector } from 'store/modules/auth';

// <LRoute path="/auth" component={Auth} token/>
// Login이 되있을경우 다시 오면 홈으로 or token이 있을때 보이면 안되는 페이지
function LRoute({ component: Component, ...rest }) {
  const { isLogin } = useShallowSelector(state => ({
    isLogin: isLogInSelector(state),
  }));
  const { pathname } = useLocation();
  // login페이지는 returnPath때문에 signInContainer 에서 별도 관리,
  const isExceptPageList = [pageUrl.auth.signIn, pageUrl.auth.signOut];
  // console.log('pathname', pathname);
  const isExceptPage = isExceptPageList.includes(pathname);
  // console.log(isAuthenticated, 'isAuthenticated');
  // console.log(isExceptPage, 'isExceptPage');

  return (
    <Route
      {...rest}
      render={props => {
        if (isLogin) {
          return !isExceptPage ? <Redirect to={pageUrl.index} /> : <Component {...props} />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
}

export default LRoute;
