import { Grid } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { color, paper } from 'styles/utils';
import useInput from 'lib/hooks/useInput';
import { ProjectSocketContext } from 'contexts/ProjectSocketContext';
import _ from 'lodash';
import { useLocation, useParams } from 'react-router-dom';
import { cutUrl } from 'lib/library';
import StarScore from 'components/common/score/StarScore';
import ImgCrop from 'components/common/images/ImgCrop';
import { icon_user_circle } from 'components/base/images';
import queryString from 'query-string';
import ProjectChatContainer from './ProjectChatContainer';
import ProjectHistoryListContainer from 'containers/project/ProjectHistoryListContainer';
import T from 'components/common/text/T';

// http://localhost:48052/private, http://localhost:48052/project
export default React.memo(({}) => {
  const { user, projectInfo, attendDesignerList } = useShallowSelector(state => ({
    user: state.user.user,
    projectInfo: state.project.project.data?.projectInfo,
    attendDesignerList: state.designer.attendDesigners.data?.attendDesigner,
  }));
  const { pcode } = useParams();
  const { pathname, search } = useLocation();
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  // const queryParse = queryString.parse(search);
  // const projectCode = queryParse?.projectCode;
  const projectCode = pcode;

  const talkBoxListRef = useRef();
  const message = useInput('');
  const page = useInput(1);
  // TODO: totalPeople로 대체
  const attendDesignerCount = attendDesignerList?.length;
  const userCode = user?.userCode;
  const receiverCode = projectInfo?.receiverCode;
  useEffect(() => {
    console.log('receiverCode', receiverCode);
  }, [receiverCode]);

  const senderCode = projectInfo?.senderCode;
  const stage = projectInfo?.stage;
  const isClient = userCode === senderCode;
  // matching 이후 디자이너 보여줌
  const showDesigner = isClient && stage > 1;
  // const isApplyDesigner =
  //   stage === 0
  //     ? attendDesignerList?.find(item => item.designerCode === userCode)
  //     : userCode === receiverCode;
  // // TEST:
  // useEffect(() => {
  //   console.log('isApplyDesigner', isApplyDesigner);
  // }, [isApplyDesigner]);
  // useEffect(() => {
  //   console.log('attendDesignerList', attendDesignerList);
  // }, [attendDesignerList]);

  return (
    <Styled.ProjectContactContainer data-component-name="ProjectContactContainer">
      {/* <ProjectOpponent
        showClient={isClient && stage !== 0}
        showDesigner={!isClient}
        projectInfo={projectInfo}
      /> */}
      {/* {(showDesigner || !isClient) && (
        <ProjectOpponent
          showClient={!isClient}
          showDesigner={showDesigner}
          projectInfo={projectInfo}
        />
      )} */}

      {/* {(isApplyDesigner || (isClient && attendDesignerItems.value?.length > 0)) && ( */}
      {/* {(isApplyDesigner || isClient) && (
        <div className="projectOpponent__card">
          <ProjectChatContainer attendDesignerCount={attendDesignerItems?.value.length} />
        </div>
        <ProjectChatContainer />
      )} */}
      <ProjectChatContainer />

      <ProjectHistoryListContainer />
    </Styled.ProjectContactContainer>
  );
});

export const ProjectOpponent = React.memo(({ showClient, showDesigner, projectInfo }) => {
  const opponentProfileImg =
    (showClient && projectInfo?.clientInfo?.profileImg) ||
    (showDesigner && projectInfo?.designerInfo?.profileImg);
  const opponentCompany =
    (showClient && projectInfo?.clientInfo?.company) ||
    (showDesigner && projectInfo?.designerInfo?.company) ||
    '-';
  const opponentRating =
    (showClient && projectInfo?.clientInfo?.rating) ||
    (showDesigner && projectInfo?.designerInfo?.rating) ||
    0;

  return (
    <Styled.ProjectOpponent>
      {(showClient || showDesigner) && (
        <div className="projectOpponent__client_card">
          <div className="projectOpponent__profile_thumbnail_box">
            <figure className="projectOpponent__profile_figure box-shadow-default radius-circle">
              {opponentProfileImg ? (
                <ImgCrop isCircle src={opponentProfileImg} alt="user" />
              ) : (
                <img src={icon_user_circle} art="user" />
              )}
            </figure>
            <div className="projectOpponent__profile_name">{opponentCompany}</div>
            <div className="projectOpponent__profile_score">
              <StarScore
                max={5}
                // score={3}
                score={opponentRating}
                size={15}
                gutter={3}
                hideText={true}
                className="designerList__profile_score"
              />
            </div>
          </div>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            spacing={2}
            className="projectOpponent__profile_info_box"
          >
            {showClient && (
              <>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>GLOBAL_LANGUAGE</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.clientInfo?.languageGroup || '-'}
                </Grid>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>PROJECT_CREATED_PROJECT</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.clientInfo?.createdProject || 0}
                </Grid>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>PROJECT_CHANGE_DESIGNER</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.clientInfo?.changeDesigner || 0}
                </Grid>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>DESIGNER_REWORK</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.clientInfo?.reworkCount || 0}
                </Grid>
              </>
            )}
            {showDesigner && (
              <>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>GLOBAL_LANGUAGE</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.designerInfo?.languageGroup || '-'}
                </Grid>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>GLOBAL_COMPLETED</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.designerInfo?.completeCount || 0}
                </Grid>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>GLOBAL_REJECTED</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.designerInfo?.changedCount || 0}
                </Grid>
                <Grid item xs={7} className="projectOpponent__profile_grid_item">
                  <T>DESIGNER_DROPPED</T>
                </Grid>
                <Grid item xs={5} className="projectOpponent__profile_grid_item">
                  {projectInfo?.designerInfo?.giveupCount || 0}
                </Grid>
              </>
            )}
          </Grid>
        </div>
      )}
    </Styled.ProjectOpponent>
  );
});

const Styled = {
  ProjectContactContainer: styled.div`
    position: relative;
    width: 320px;
  `,
  ProjectOpponent: styled.div`
    .projectOpponent__client_card {
      width: 100%;
      /* height: 385px; */
      height: 418px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #f9f9f9;
      border: 1px solid ${color.gray_border2};
      border-radius: 10px;
      .projectOpponent__profile_thumbnail_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
        text-align: center;
        .projectOpponent__profile_figure {
          width: 80px;
          height: 80px;
          img {
            width: 100%;
          }
        }
        .projectOpponent__profile_name {
          margin-top: 15px;
          letter-spacing: -0.3px;
          font-weight: 700;
        }
        .designerList__profile_score {
          margin-top: 10px;
        }
      }
      .projectOpponent__profile_info_box {
        /* margin-top: 35px; */
        .projectOpponent__profile_grid_item {
          margin-top: 5px;
        }
      }
    }
  `,
};
