import { Grid } from '@material-ui/core';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import MuiButton from 'components/common/button/MuiButton';
import DateConverter from 'components/common/convert/DateConverter';
import EscapeConvert from 'components/common/convert/EscapeConvert';
import T from 'components/common/text/T';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { color, paperSubtitle } from 'styles/utils';

function ProjectInformation({
  projectId,
  projectTitle,
  dueDate,
  manager,
  senderMemo,
  programName,
  projectCode,
  stage,
  userType,
  // patient,
  // preferedProgram,
  // languageIsoGroup,
}) {
  const isReceiver = useMemo(() => userType === 'receiver', [userType]);
  // const isSender = useMemo(() => userType === 'sender', [userType]);
  // const isAdmin = useMemo(() => userType === 'admin', [userType]);
  const history = useHistory();

  return (
    <Styled.ProjectInformation
      data-component-name="ProjectInformation"
      className="projectInformation__container"
    >
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className="projectInformation__content_title_box"
      >
        <h2 className="projectInformation__content_title">{projectId}</h2>
        {!isReceiver && stage < 2 && (
          <MuiButton
            config={{
              width: 155,
              borderColor: color.gray_b5,
              bgColor: 'white',
            }}
            variant="outlined"
            className="sm"
            onClick={() => history.push(`/project/edit/${projectCode}`)}
            startIcon={<PencilUnderlineIcon color={color.gray_b5} width={15} />}
          >
            <T>GLOBAL_MODIFY</T>
          </MuiButton>
        )}
      </Grid>

      <div className="projectInformation__content_grid_wrapper">
        <Grid container alignItems="flex-start">
          <Grid item xs={6} className="projectInformation__grid_container col1">
            <Grid spacing={3} container style={{ overflowX: 'hidden' }}>
              <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                <Grid item xs={4}>
                  <span className="form__label">
                    <T>PROJECT_NAME</T>
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {projectTitle}
                </Grid>
              </Grid>
              <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                <Grid item xs={4}>
                  <span className="form__label">
                    <T>PROJECT_MANAGER</T>
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {manager}
                </Grid>
              </Grid>
              <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                <Grid item xs={4}>
                  <span className="form__label">
                    <T>PROJECT_PREFERRED_CAD</T>
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {programName}
                </Grid>
              </Grid>
              <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                <Grid item xs={4}>
                  <span className="form__label">
                    <T>PROJECT_DUE_DATE</T>
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {dueDate ? <DateConverter timestamp={dueDate} /> : '-'}
                </Grid>
              </Grid>
              {/* <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                <Grid item xs={6}>
                  
                  <T>PROJECT_PREFERRED_LANGUAGE</T>
                  
                </Grid>
                <Grid item xs={6}>
                  {languageIsoGroup}
                </Grid>
              </Grid> */}
            </Grid>
          </Grid>
          {/*  */}
          <Grid item xs={6} className="projectInformation__grid_container col2">
            <Grid spacing={3} container style={{ overflowX: 'hidden' }}>
              {/* <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                
                <T>PROJECT_MEMO</T>
                
              </Grid> */}
              <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                <div className="projectInformation__memo">
                  <EscapeConvert content={senderMemo} />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Styled.ProjectInformation>
  );
}

ProjectInformation.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectTitle: PropTypes.string.isRequired,
  dueDate: PropTypes.number.isRequired,
  manager: PropTypes.string,
  senderMemo: PropTypes.string,
  programName: PropTypes.string.isRequired,
  projectCode: PropTypes.string.isRequired,
  stage: PropTypes.number.isRequired,
};

export default React.memo(ProjectInformation);

const Styled = {
  ProjectInformation: styled.div`
    .projectInformation__content_title_box {
      padding-right: 50px;
      padding-bottom: 40px;
    }
    .projectInformation__content_title {
      ${paperSubtitle};
      padding-bottom: 0;
      font-size: 22px;
    }
    .projectInformation__content_grid_wrapper {
      padding: 0 50px;
    }
    .projectInformation__grid_container {
      &.col1 {
      }
      &.col2 {
      }
      .projectInformation__grid_item {
        font-size: 14px;
      }
    }
    .form__label {
      padding-left: 10px;
    }
    .projectInformation__memo {
      width: 100%;
      height: 130px;
      overflow-y: overlay;
      padding: 14px;
      border: 1px solid ${color.gray_b5};
      border-radius: 5px;
      line-height: 1.5;
    }
  `,
};
