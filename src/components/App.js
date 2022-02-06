import React, { useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import Core from 'containers/base/Core';
import { Route, Switch, Redirect, useLocation, useRouteMatch } from 'react-router-dom';
import GlobalAppStyle from 'styles/base';
import {
  Error,
  Home,
  Auth,
  Designer,
  Project,
  //
  About,
  User,
  Order,
  Store,
  Test,
  Howto,
  Payment,
  Legal,
} from 'pages';
// import FullScreenLoading from 'components/base/loading/FullScreenLoading';
import AppErrorBoundary from 'components/base/error/AppErrorBoundary';
import LRoute from 'components/base/route/LRoute';
import PrivateRoute from 'components/base/route/PrivateRoute';
import './App.scss';
import { pageUrl } from 'lib/mapper';
import Jun from 'pages/jun/Jun';
import Hds from 'pages/hds/Hds';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from 'styles/utils';
import { AppContext } from 'contexts/AppContext';
// import Payment from 'pages/payment/Payment';

export default function App() {
  const { pathname } = useLocation();
  const { theme } = useContext(AppContext);

  // const match = useRouteMatch();
  // useEffect(() => {
  //   console.log('match', match);
  // }, [match]);

  // 페이지 이동시 scroll top이동
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalAppStyle />
      <AppErrorBoundary>
        <Core />

        <Switch>
          <Redirect exact path={pageUrl.index} to={pageUrl.home} />
          <Route path="/error" component={Error} />
          <Route path={pageUrl.home} component={Home} />
          <LRoute path={pageUrl.auth.index} component={Auth} />
          {/* <Route path={pageUrl.auth.index} component={Auth} /> */}
          <Route path={pageUrl.designer.index} component={Designer} />
          {/* <Route path={pageUrl.project.index} component={Project} />
          <Route path={pageUrl.user.index} component={User} /> */}
          {/* <PrivateRoute path={pageUrl.project.index} component={Project} /> */}
          <Route path={pageUrl.project.index} component={Project} />
          <PrivateRoute path={pageUrl.user.index} component={User} />
          <PrivateRoute path={pageUrl.order.index} component={Order} />
          <PrivateRoute path={pageUrl.store.index} component={Store} />
          <Route path={pageUrl.howto.index} component={Howto} />
          <Route path={pageUrl.legal.index} component={Legal} />
          <PrivateRoute path="/about" component={About} />
          {/* <PrivateRoute path={pageUrl.payment.success} component={Payment} /> */}
          {/* <Route path="/about" component={About} /> */}
          <Route path={pageUrl.payment.index} component={Payment} />
          {/* <Route path={pageUrl.payment.cancel} component={Payment} />
          <Route path={pageUrl.payment.cashreceipt} component={Payment} />
          <Route path={pageUrl.payment.virtualaccount} component={Payment} /> */}
          <Route path="/test" component={Test} />
          <Route path="/jun" component={() => <Jun />} />
          <Route path="/hds" component={() => <Hds />} />
          <Route component={() => <Redirect to="/error/404" />} />
        </Switch>
      </AppErrorBoundary>
    </ThemeProvider>
  );
}
