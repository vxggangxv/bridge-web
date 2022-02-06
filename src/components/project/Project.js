import { Grid } from '@material-ui/core';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { StyledInShadowButtonOuter } from 'components/common/styled/Button';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import ProjectContactContainer from 'containers/project/ProjectContactContainer';
import ProjectUploadContainer from 'containers/project/ProjectUploadContainer';
import { AppContext } from 'contexts/AppContext';
import { ProjectSocketContext } from 'contexts/ProjectSocketContext';
import { projectEmptyMatchingStatus } from 'lib/mapper';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { color, paper, paperSubtitle } from 'styles/utils';
import ProjectIndication from './ProjectIndication';
import ProjectInformation from './ProjectInformation';
import ProjectProgressStage from './ProjectProgressStage';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { AppActions, DesignerActions, ProjectActions } from 'store/actionCreators';
import ConfirmProjectModal from './ConfirmProjectModal';
import Color from 'color';
import PlainModal from 'components/common/modal/PlainModal';
import RemakeProjectModal from './RemakeProjectModal';
import AppModal from 'components/common/modal/AppModal';
import { useTranslation } from 'react-i18next';
import { ProjectContext } from 'contexts/project/ProjectContext';

export default React.memo(function Project({ indicationFormat, indicationInfo, projectInfo }) {
  const { t } = useTranslation();
  const {
    stage,
    projectCode,
    dueDate,
    programName,
    point,
    userType, // sender, receiver, manager?
    remakeInfo,
    timeline,
  } = projectInfo;
  const [remakeModalOpen, setRemakeModalOpen] = useState(false);
  const [remakeModalType, setRemakeModalType] = useState('');
  const isSender = useMemo(() => userType === 'sender', [userType]);
  const isReceiver = useMemo(() => userType === 'receiver', [userType]);
  const isAdmin = useMemo(() => userType === 'admin', [userType]);
  // const { userCode, attendDesignerList } = useShallowSelector(state => ({
  //   userCode: state.user.user?.userCode,
  //   attendDesignerList: state.designer.attendDesigners.data?.attendDesigner,
  // }));

  // Context state
  const { isProjectClient } = useContext(AppContext);
  const { hasNewProjectUploadFile } = useContext(ProjectContext);

  const handleCompleteReview = () => {
    // TODO: request api
    ProjectActions.complete_review_request({ projectCode });
  };

  const handleDone = () => {
    // hasProjectCode();
    DesignerActions.done_project_request({ projectCode, remakeIdx: remakeInfo?.remakeIdx });
  };

  const handleOpenRemakeModal = data => {
    const { open, type } = data;
    // data: open, type
    setRemakeModalOpen(open);
    setRemakeModalType(type);
  };

  const handleConfirm = () => {
    // TODO: confirm modal

    ProjectActions.fetch_confirm_project_request({ projectCode });
    AppActions.add_popup({
      isOpen: true,
      title: <T>PROJECT_FINISH_PROJECT</T>,
      content: <ConfirmProjectModal />,
      contentCardStyle: { padding: 0 },
      isCloseIcon: true,
      align: ['title.center'],
      onClick() {
        ProjectActions.confirm_project_request({ projectCode });
      },
    });
  };

  // TEMP:
  useEffect(() => {
    // handleConfirm();
  }, []);

  return (
    <Styled.Project
      data-component-name="Project"
      className={cx('notranslate', { project_client: isProjectClient })}
    >
      {useMemo(
        () => (
          <PlainModal
            isOpen={remakeModalOpen}
            // isOpen={true}
            onClick={() => setRemakeModalOpen(false)}
            width={1800}
            // timeout={0}
          >
            <AppModal
              title={t('PROJECT_REMAKE_ORDER')}
              contentCardStyle={{
                paddingBottom: 0,
              }}
              isContentDefault={false}
              content={
                <RemakeProjectModal
                  {...projectInfo}
                  type={remakeModalType}
                  onCancel={() => setRemakeModalOpen(false)}
                />
              }
              onCancel={() => setRemakeModalOpen(false)}
              isCloseIcon={true}
              hideButton={true}
              align={['title.center']}
            />
          </PlainModal>
        ),
        [remakeModalOpen, projectInfo, remakeModalType],
      )}

      <h1 className="sr-only">Project : {projectInfo.title}</h1>

      <div className="project__container">
        <Grid item className="project__content_container">
          <div className="project__grid_item process">
            <ProjectProgressStage
              stage={stage}
              timeline={timeline}
              point={point}
              dueDate={dueDate}
              programName={programName}
              remakeInfo={remakeInfo}
              onOpenRemakeModal={handleOpenRemakeModal}
            />
          </div>

          <div className="project__grid_item main">
            <section className="project__teeth_container">
              <h1 className="sr-only">Teeth Information, Indication</h1>
              <ProjectInformation {...projectInfo} />
              <ProjectIndication
                indicationFormat={indicationFormat}
                indicationInfo={indicationInfo}
                projectInfo={projectInfo}
              />
              <h2 className="project__upload_content_title">
                {/* <T>GLOBAL_CLOUD</T> */}
                Data/Design
                {isSender && stage !== 4 && (
                  <span className="project_upload_content_download_alarm">
                    <T>PROJECT_DOWNLOAD_ALARM</T>
                  </span>
                )}
              </h2>

              <div className="project__upload_content_wrapper">
                <ProjectUploadContainer hasViewer={true} hasUpload={true} />
              </div>
            </section>
          </div>

          <div className="project__submit_box">
            {isSender && stage > 1 && (
              <StyledInShadowButtonOuter
                width={440}
                height={60}
                marginTop={-30}
                bgColor={isSender && color.navy_blue}
              >
                <div className="projectInformation__btn_box">
                  <MuiButton
                    config={{
                      width: 220,
                      color: 'white',
                      fontColor: color.blue,
                    }}
                    disabled={stage < 3}
                    disableElevation
                    variant="contained"
                    className="md border-radius-round inset-shadow-default projectInformation__reject_btn"
                    onClick={() => handleOpenRemakeModal({ open: true, type: 'edit' })}
                  >
                    <T>PROJECT_REMAKE_ORDER</T>
                  </MuiButton>
                  <MuiButton
                    config={{
                      width: 220,
                    }}
                    disabled={stage !== 3}
                    disableElevation
                    variant="contained"
                    className="md border-radius-round inset-shadow-default projectInformation__accept_btn"
                    onClick={handleConfirm}
                    // onClick={() => setIsUnfoldCard(draft => !draft)}
                    // endIcon={<ExpandMoreIcon style={{ fontSize: '34px' }} />}
                  >
                    <span
                      className="btn-shadow-inset"
                      style={{
                        backgroundColor: color.navy_blue,
                      }}
                    ></span>
                    <T>PROJECT_CONFIRM_AND_PAY</T>
                  </MuiButton>
                </div>
              </StyledInShadowButtonOuter>
            )}
            {((isReceiver && stage > 1) || isAdmin) && (
              <StyledInShadowButtonOuter
                width={390}
                height={60}
                marginTop={-30}
                // bgColor={isAdmin ? color.navy_blue : 'white'}
              >
                <MuiButton
                  config={{
                    width: '370px',
                    color: color.blue,
                  }}
                  disabled={
                    (isReceiver && (stage !== 2 || !hasNewProjectUploadFile)) ||
                    (isAdmin && stage > 1)
                  }
                  disableElevation
                  variant="contained"
                  onClick={isReceiver ? handleDone : handleCompleteReview}
                  className="md border-radius-round projectInformation__review_btn"
                >
                  {isReceiver ? <T>PROJECT_DONE</T> : <T>PROJECT_COMPLETED_REVIEW</T>}
                </MuiButton>
              </StyledInShadowButtonOuter>
            )}
          </div>
        </Grid>

        <Grid item className="project__contact_container aside">
          <ProjectContactContainer />
        </Grid>
      </div>
      {/* <IntervalGrid width={1280} padding={10} className={cx('project__interval_grid_container')}>
      </IntervalGrid> */}

      {/* <div className="project__history_container">
        <ProjectHistoryList
          projectHistoryList={projectHistoryList}
          projectHistoryPagingData={projectHistoryPagingData}
          projectHistoryPage={projectHistoryPage}
        />
      </div> */}
    </Styled.Project>
  );
});

const Styled = {
  Project: styled.section`
    &.project_client {
      background-color: ${color.navy_blue};
    }
    .project__timeline_box {
      padding-top: 50px;
    }
    .project__container {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      width: 1300px;
      padding: 0 10px;
      padding-top: 50px;
    }
    .project__content_container {
      position: relative;
      width: 940px;
    }
    .project__contact_container {
      width: 320px;
    }

    .project__teeth_container {
      ${paper};
      padding-bottom: 70px;
    }
    .section-title {
      display: flex;
      align-items: center;
      height: 34px;
      padding-left: 15px;
      background-color: ${color.blue_week};
      font-size: 16px;
      font-weight: 700;
    }
    .project__upload_content_title {
      margin-top: 70px;
      ${paperSubtitle};
      padding-bottom: 25px;
    }
    .project_upload_content_download_alarm {
      color: ${color.blue};
      margin-left: 20px;
      font-size: 14px;
      font-weight: 300;
    }
    .project__upload_content_wrapper {
      padding: 0 50px;
    }

    .projectInformation__btn_box {
      position: relative;
      display: flex;
      .projectInformation__reject_btn {
        position: relative;
        z-index: 2;
      }
      .projectInformation__accept_btn {
        margin-left: -10px;
        background: ${({ theme }) => theme.color.primary};
        background: ${({ theme }) => theme.gradient.primary};
        border: none !important;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        overflow: hidden;
        &:hover {
          background: ${`linear-gradient(
            90deg,
            ${Color('rgba(0, 166, 226, 1)').darken(0.12)} 0%,
            ${Color('rgba(8, 123, 238, 1)').darken(0.12)} 100%
          )`};
        }
        .btn-shadow-inset {
          position: absolute;
          top: -2px;
          left: -20px;
          width: 40px;
          height: 44px;
          border-radius: 20px;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
        }
      }
    }
  `,
};
