import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AppTemplate from 'components/base/template/AppTemplate';
import { pageUrl } from 'lib/mapper';
import UserContainer from 'containers/user/UserContainer';

export default function User() {
  return (
    <AppTemplate title={'User'}>
      <Switch>
        <Route path={pageUrl.user.index} component={UserContainer} />
      </Switch>
    </AppTemplate>
  );
}
