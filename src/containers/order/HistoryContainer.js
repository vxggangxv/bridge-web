import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { beforeDash, color } from 'styles/utils';
import useInput from 'lib/hooks/useInput';
import MuiButton from 'components/common/button/MuiButton';
import {
  Switch,
  Route,
  Redirect,
  Link,
  useLocation,
  NavLink,
  useHistory,
  useParams,
} from 'react-router-dom';

import { pageUrl } from 'lib/mapper';
import PointHistoryContainer from 'containers/user/PointHistoryContainer';

export default React.memo(function HistoryContainer() {
  return <History />;
});

export const History = React.memo(() => {
  const history = useHistory();
  return (
    <Styled.History data-component-name="History">
      <Switch>
        <Route exact path={pageUrl.user.history} component={PointHistoryContainer} />
        <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
      </Switch>
    </Styled.History>
  );
});

const Styled = {
  History: styled.div`
    background-color: ${color.white};
  `,
};
