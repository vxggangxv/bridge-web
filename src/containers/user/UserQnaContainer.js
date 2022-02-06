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
import UserQnaListContainer from './UserQnaListContainer';
import UserQnaCreateContainer from './UserQnaCreateContainer';
import UserQnaDetailContainer from './UserQnaDetailContainer';

export default React.memo(function UserQnaContainer() {
  return <UserQna />;
});

export const UserQna = React.memo(() => {
  const history = useHistory();
  return (
    <Styled.UserQna data-component-name="UserQna">
      <Switch>
        <Route exact path={pageUrl.user.qna} component={UserQnaListContainer} />
        <Route path={pageUrl.user.qnaCreate} component={UserQnaCreateContainer} />
        <Route path={pageUrl.user.qnaEdit} component={UserQnaCreateContainer} />
        <Route path={pageUrl.user.qnaDetail} component={UserQnaDetailContainer} />
        <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
      </Switch>
    </Styled.UserQna>
  );
});

const Styled = {
  UserQna: styled.div`
    background-color: ${color.white};
  `,
};
