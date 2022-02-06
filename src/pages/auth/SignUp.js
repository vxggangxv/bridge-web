import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import SignUpContainer from 'containers/auth/SignUpContainer';

export default function SignUp(props) {
  return (
    <AppTemplate title={'Auth'} defaultMainContainer={false}>
      <SignUpContainer />
    </AppTemplate>
  );
}
