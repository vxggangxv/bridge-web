import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router-dom';
import AppTemplate from 'components/base/template/AppTemplate';
import { pageUrl } from 'lib/mapper';
import StoreContainer from 'containers/store/StoreContainer';
import StoreDetailContainer from 'containers/store/StoreDetailContainer';

export default function Store() {
  const { uid, oid } = useParams();
  return (
    <AppTemplate title={'Store'} mainTheme="dark">
      <Switch>
        {/* <Redirect exact path={pageUrl.store.index} to={pageUrl.store.store} /> */}
        <Route exact path={pageUrl.store.index} component={StoreContainer} />
        <Route exact path={pageUrl.store.detail} component={StoreDetailContainer} />
        {/* <Route path={`/@${uid}/store`} component={StoreContainer} /> */}

        {/* <Route path={pageUrl.order.invoice} component={InvoiceContainer} /> */}
        <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
      </Switch>
    </AppTemplate>
  );
}
