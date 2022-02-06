import React from 'react';
import MainHomeContainer from 'containers/home/MainHomeContainer';
import AppTemplate from 'components/base/template/AppTemplate';

export default function Home(props) {
  return (
    // <AppTemplate title={'Home'} defaultMainContainer={false} flexCenterTemplate={true}>
    <AppTemplate title={'Home'} isTemplateMain={false} footerHide={true}>
      <MainHomeContainer />
    </AppTemplate>
  );
}
