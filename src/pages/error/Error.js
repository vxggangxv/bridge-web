import React from 'react';
import { Switch, Route } from 'react-router';
import { pageUrl } from 'lib/mapper';
import NotFound from 'components/base/error/NotFound';
import ServerError from 'components/base/error/ServerError';

function Error(props) {
  return (
    <>
      <Switch>
        <Route path={`${pageUrl.error.server}`} component={ServerError} />
        <Route path={`${pageUrl.error.notFound}`} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default Error;
