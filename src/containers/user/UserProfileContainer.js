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
import UserProfileViewContainer from 'containers/user/UserProfileViewContainer';
import UserProfileEditContainer from 'containers/user/UserProfileEditContainer';

export default React.memo(function UserProfileContainer() {
  return <UserProfile />;
});

export const UserProfile = React.memo(() => {
  const history = useHistory();
  return (
    <Styled.UserProfile data-component-name="UserQna">
      <Switch>
        <Route exact path={pageUrl.user.profile} component={UserProfileViewContainer} />
        <Route path={pageUrl.user.profileEdit} component={UserProfileEditContainer} />
        <Route path={pageUrl.user.changePassword} component={UserProfileEditContainer} />
        <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
      </Switch>
    </Styled.UserProfile>
  );
});

const Styled = {
  UserProfile: styled.div`
    background-color: ${color.white};
  `,
};
