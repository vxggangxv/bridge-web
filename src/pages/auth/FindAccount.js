import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import FindAccountContainer from 'containers/auth/FindAccountContainer';

export default function FindAccount(props) {
  return (
    <AppTemplate title={'Auth'} defaultMainContainer={false} flexCenterTemplate={true}>
      <FindAccountContainer />
    </AppTemplate>
  );
}
