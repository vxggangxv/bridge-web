import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import ResetPasswordContainer from 'containers/auth/ResetPasswordContainer';

export default function ResetPassword(props) {
  return (
    <AppTemplate title={'Auth'} defaultMainContainer={false} flexCenterTemplate={true}>
      <ResetPasswordContainer />
    </AppTemplate>
  );
}
