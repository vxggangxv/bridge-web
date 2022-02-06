import Project from 'components/project/Project';
import { ProjectContext } from 'contexts/project/ProjectContext';
import { ProjectSocketContext } from 'contexts/ProjectSocketContext';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import React, { useContext, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AppActions, DesignerActions, ProjectActions, UtilActions } from 'store/actionCreators';

export default function ProjectContainer(props) {
  const {
    userCode,
    indicationFormat,
    indicationFormatSuccess,
    indicationInfo,
    indicationInfoSuccess,
    projectData,
    fetchProjectSuccess,
    projectFiles,
    fetchProjectFilesSuccess,
    attendDesignerList,
    fetchAttendDesignersSuccess,
  } = useShallowSelector(state => ({
    userCode: state.user.user?.userCode,
    indicationFormat: state.util.indicationFormat.data?.indicationFormat,
    indicationFormatSuccess: state.util.indicationFormat.success,
    indicationInfo: state.util.indicationInfo.data?.indicationInfo,
    indicationInfoSuccess: state.util.indicationInfo.success,
    projectData: state.project.project.data,
    fetchProjectSuccess: state.project.project.success,
    projectFiles: state.project.projectFiles.data?.fileList,
    fetchProjectFilesSuccess: state.project.projectFiles.success,
    attendDesignerList: state.designer.attendDesigners.data?.attendDesigner,
    fetchAttendDesignersSuccess: state.designer.attendDesigners.success,
  }));
  const history = useHistory();
  const { pcode } = useParams();
  const { search, pathname } = useLocation();
  // const queryParse = queryString.parse(search);
  // const queryProjectCode = queryParse?.projectCode;
  const projectCode = pcode;
  // const currentPage = cutUrl(location.pathname, 1);
  const projectInfo = projectData?.projectInfo;
  const projectFileList = projectData?.fileList;
  const infoProjectCode = projectInfo?.projectCode;
  const senderCode = projectInfo?.senderCode;
  const remakeIdx = projectInfo?.remakeIdx || null; // designer입장, remake check 활성화 트리거
  const company = projectInfo?.clientInfo?.company;
  const stage = projectInfo?.stage; // wokring: 2, done, 3

  // ProjectContext state
  const { cloudFileListCt } = useContext(ProjectContext);
  const { socketState, handleJoinProject } = useContext(ProjectSocketContext);

  // SECTION: init
  useEffect(() => {
    UtilActions.fetch_teeth_indication_format_request();
    UtilActions.fetch_teeth_indication_info_request();
    ProjectActions.fetch_project_request({
      projectCode,
    });
    // }
    // DesignerActions.fetch_attend_designers_request({ projectCode });
    return () => {
      DesignerActions.fetch_attend_designers_clear();
      ProjectActions.fetch_project_clear();
    };
  }, []);

  // useEffect(() => {
  //   console.log(projectInfo, 'projectInfo');
  //   console.log(projectFileList, 'projectFileList');
  // }, [project]);
  // useEffect(() => {
  //   console.log('stage-', stage);
  // }, [stage]);

  // SECTION: onChange pathname - projectCode
  useDidUpdateEffect(() => {
    // console.log('onChange search', `${pathname}`);
    // history.push(`/project/detail/${projectCode}`);
    // history.go(0);
    // project detail페이지 안에 있을 경우 다른 project detail로 이동하게 될 경우를 캐치
    if (infoProjectCode !== projectCode) {
      console.log('change in project detail', infoProjectCode !== projectCode);
      ProjectActions.fetch_project_request({
        projectCode,
      });
      DesignerActions.fetch_attend_designers_request({ projectCode });
    }
  }, [infoProjectCode, projectCode]);

  // useEffect(() => {
  //   console.log('pathname', pathname);
  // }, [pathname]);

  // const fetchList = {
  //   indicationFormatSuccess,
  //   fetchProjectSuccess,
  //   fetchAttendDesignersSuccess,
  // };
  // const { isFetchSuccess } = useFetchLoading(fetchList);
  // if (!isFetchSuccess ) return null;
  if (!indicationFormat || !indicationInfo || !projectData) return null;
  return (
    <Project
      indicationFormat={indicationFormat}
      indicationInfo={indicationInfo}
      projectInfo={projectInfo}
      projectFileList={projectFileList}
    />
  );
}
