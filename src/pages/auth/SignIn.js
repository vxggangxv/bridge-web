import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import SignInContainer from 'containers/auth/SignInContainer';

export default function SignIn(props) {
  return (
    <AppTemplate title={'Auth'} defaultMainContainer={false} flexCenterTemplate={true}>
      <SignInContainer />
    </AppTemplate>
  );
}
