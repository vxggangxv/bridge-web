import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AppTemplate from 'components/base/template/AppTemplate';
import { pageUrl } from 'lib/mapper';
import ProjectListContainer from 'containers/project/ProjectListContainer';
import CreateProjectContainer from 'containers/project/CreateProjectContainer';
import PrivateRoute from 'components/base/route/PrivateRoute';
import ProjectContainer from 'containers/project/ProjectContainer';
import { ProjectProvider } from 'contexts/project/ProjectContext';

export default function Auth() {
  // console.log(match, 'match');
  return (
    <AppTemplate title={'Project'}>
      <ProjectProvider>
        <Switch>
          <Redirect exact path={pageUrl.project.index} to={pageUrl.project.list} />
          <Route path={pageUrl.project.list} component={ProjectListContainer} />
          <PrivateRoute path={pageUrl.project.create} component={CreateProjectContainer} />
          <PrivateRoute path={pageUrl.project.edit} component={CreateProjectContainer} />
          <PrivateRoute path={pageUrl.project.detail} component={ProjectContainer} />
          <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
        </Switch>
      </ProjectProvider>
    </AppTemplate>
  );
}
