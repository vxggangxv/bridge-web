import { Checkbox, FormControl, Grid, MenuItem, Select, TextField } from '@material-ui/core';
import cx from 'classnames';
import { create_computer } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomFormHelperText from 'components/common/text/CustomFormHelperText';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import { pageUrl, toolList } from 'lib/mapper';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import queryString from 'query-string';
import React, { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { ProjectActions } from 'store/actionCreators';
import styled from 'styled-components';
import { color, paper, paperSubtitle, robotoFont } from 'styles/utils';
import moment from 'moment';
import 'moment-timezone';

export default React.memo(function CreateProjectInformation({
  supportCountryList,
  projectTitle,
  caseId,
  patient,
  dueDate,
  senderMemo,
  manager,
  preferedProgram,
  language,
  checkSharePatient,
  isSubmit,
}) {
  // console.log('---------------- render CreateProjectInformation');
  const { deleteProjectSuccess } = useShallowSelector(state => ({
    deleteProjectSuccess: state.project.deleteProject.success,
  }));
  const { search } = useLocation();
  const history = useHistory();
  const queryParse = queryString.parse(search);
  const projectCode = queryParse?.projectCode;

  // SECTION: method
  const handleDeleteProject = () => {
    ProjectActions.delete_project_request({
      projectCode,
    });
  };

  useDidUpdateEffect(() => {
    if (deleteProjectSuccess) {
      history.push(`${pageUrl.project.list}`);
    }
    // if (deleteProjectFailure) {
    //   history.goBack();
    // }
    // }, [!!deleteProjectSuccess, !!deleteProjectFailure]);
  }, [!!deleteProjectSuccess]);

  // TEST:
  // useEffect(() => {
  //   console.log(moment());
  //   console.log('America/New_York', moment.tz('America/New_York').format('DD HH:mm'));
  //   console.log('America/New_York', moment.tz('America/New_York').format('Z'));
  //   console.log('Asia/Seoul', moment.tz('Asia/Seoul').format('DD HH:mm'));
  //   console.log('Asia/Seoul', moment.tz('Asia/Seoul').format('Z'));
  //   console.log('get date', moment.tz('America/New_York').date());
  // }, []);

  // <MuiButton
  //   config={{
  //     width: 150,
  //   }}
  //   variant="contained"
  //   color="secondary"
  //   disableElevation
  //   className="md inset-shadow-default border-radius-round"
  //   startIcon={<PencilUnderlineIcon />}
  // >
  //   Modify
  // </MuiButton>

  return (
    <Styled.CreateProjectInformation className={`projectInformation__container `}>
      {projectCode && (
        <MuiButton
          variant="outlined"
          className="projectInformation__delete_btn"
          onClick={handleDeleteProject}
        >
          Delete
        </MuiButton>
      )}

      <div className="projectInformation__title_container">
        <div className="projectInformation__title_box">
          <img className="projectInformation__title_img" src={create_computer} alt="desktop" />
          <h1 className="projectInformation__title">
            <T>PROJECT_CREATE_PROJECT_TITLE</T>
          </h1>
          <h2 className="projectInformation__subtitle">
            <T>PROJECT_CREATE_PROJECT_SUBTITLE</T>
          </h2>
        </div>
      </div>
      <h2 className="projectInformation__content_title ">
        <T>PROJECT_REQUIRED</T>
      </h2>
      <div className="projectInformation__content_grid_wrapper">
        <Grid container alignItems="flex-start">
          <Grid item xs={6} className="projectInformation__grid_container col1">
            <Grid spacing={3} container style={{ overflowX: 'hidden' }}>
              <Grid item container alignItems="center" className="projectInformation__grid_item">
                <Grid item xs={3}>
                  <label className="form__label">
                    <T>PROJECT_ID</T>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <span className="form__text">{caseId}</span>
                  {/* <MuiWrapper className="form__input_box">
                    <TextField readOnly variant="outlined" fullWidth value={caseId} />
                  </MuiWrapper> */}
                </Grid>
              </Grid>

              <Grid item container alignItems="center" className="projectInformation__grid_item">
                <Grid item xs={3}>
                  <label className="form__label">
                    <T>PROJECT_NAME</T>
                    <CustomSpan fontColor={color.red}>*</CustomSpan>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <MuiWrapper className="form__input_box">
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={projectTitle.value}
                      onChange={projectTitle.onChange}
                      error={isSubmit ? !projectTitle.value : false}
                    />
                  </MuiWrapper>
                  <CustomFormHelperText
                    className={cx(`error`, {
                      active: isSubmit ? !projectTitle.value : false,
                    })}
                  >
                    <T>REGISTER_REQUIRED</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid>

              <Grid item container alignItems="center" className="projectInformation__grid_item">
                <Grid item xs={3}>
                  <label className="form__label">
                    <T>PROJECT_DUE_DATE</T>
                    <CustomSpan fontColor={color.red}>*</CustomSpan>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <div className="form__input_box">
                    <CustomDatePicker
                      disabledTime
                      disabledTimeType="project"
                      disabledDate
                      disabledDateType="project"
                      renderChangable
                      renderChangableType="project"
                      fullWidth
                      showTime
                      minuteStep={30}
                      // defaultValue={
                      //   moment.tz('Asia/Seoul').day() === 5
                      //     ? moment.tz('Asia/Seoul').add(3, 'd')
                      //     : moment.tz('Asia/Seoul').add(1, 'd')
                      // }
                      value={dueDate.value}
                      height={40}
                      onChange={dueDate.onChange}
                      className={cx({
                        error: isSubmit ? !dueDate.value : false,
                      })}
                      isClient={true}
                    />
                    <CustomFormHelperText
                      className={cx(`error`, {
                        active: isSubmit ? !dueDate.value : false,
                      })}
                    >
                      <T>REGISTER_REQUIRED</T>
                    </CustomFormHelperText>
                  </div>
                </Grid>
              </Grid>

              {/* <Grid item container alignItems="center" className="projectInformation__grid_item">
                <Grid item xs={3}>
                  <label  className="form__label">
                    <T>PROJECT_PATIENT</T>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <MuiWrapper className="form__input_box">
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={patient.value}
                      onChange={patient.onChange}
                      error={isSubmit ? !patient.value : false}
                    />
                  </MuiWrapper>
                  <CustomFormHelperText
                    className={cx(`error`, {
                      active: isSubmit ? !patient.value : false,
                    })}
                  >
                    <T>REGISTER_REQUIRED</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid> */}
              <Grid item container alignItems="center" className="projectInformation__grid_item">
                <Grid item xs={3}>
                  <label className="form__label">
                    <T>PROJECT_PREFERRED_CAD</T>
                    <CustomSpan fontColor={color.red}>*</CustomSpan>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  {useMemo(
                    () => (
                      <MuiWrapper className="form__input_box">
                        <FormControl
                          fullWidth
                          variant="outlined"
                          error={isSubmit ? !preferedProgram?.value : false}
                        >
                          <Select
                            MenuProps={{
                              anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                              },
                              getContentAnchorEl: null,
                              marginThreshold: 10,
                            }}
                            displayEmpty
                            // multiple
                            name="preferedProgram"
                            value={preferedProgram.value}
                            onChange={preferedProgram.onChange}
                            // renderValue={selected => {
                            //   if (selected.length === 0) return '';
                            //   const selectedLabelList = toolList.reduce((acc, curr) => {
                            //     if (selected.includes(curr.id)) return acc.concat(curr.label);
                            //     return acc;
                            //   }, []);

                            //   return selectedLabelList.join(', ');
                            // }}
                          >
                            {toolList?.length > 0 &&
                              toolList.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                  {/* <Checkbox
                                    color="primary"
                                    checked={preferedProgram.value.includes(item.id)}
                                  /> */}
                                  {item.label}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </MuiWrapper>
                    ),
                    [isSubmit, preferedProgram.value, toolList],
                  )}
                  <CustomFormHelperText
                    className={cx(`error`, {
                      active: isSubmit ? !preferedProgram.value : false,
                    })}
                  >
                    <T>REGISTER_REQUIRED</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid>

              <Grid item container alignItems="center" className="projectInformation__grid_item">
                <Grid item xs={3}>
                  <label className="form__label">
                    <T>PROJECT_MANAGER</T>
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <MuiWrapper className="form__input_box">
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={manager.value || ''}
                      onChange={manager.onChange}
                      // error={isSubmit ? !manager.value : false}
                    />
                  </MuiWrapper>
                  <CustomFormHelperText
                    className={cx(`error`, {
                      // active: isSubmit ? !manager.value : false,
                    })}
                  >
                    <T>REGISTER_REQUIRED</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid>

              <Grid item container alignItems="center" className="projectInformation__grid_item">
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  {/* <div className="form__share_check_box">
                    <FormControlLabel
                      control={
                        <MuiWrapper>
                          <Checkbox
                            checked={checkSharePatient.value}
                            color="primary"
                            onChange={checkSharePatient.onChange}
                          />
                        </MuiWrapper>
                      }
                      label={
                        <span>
                          <T>PROJECT_NOT_SHARE_PATIENT_NAME</T>
                        </span>
                      }
                      labelPlacement="end"
                    />
                  </div>
                  <div className="form__share_alert_box">
                    <T>PROJECT_NOT_SHARE_PATIENT_ALERT</T>
                  </div> */}
                  <div className="form__share_alert_box">
                    * <T>PROJECT_NOT_SHARE_PATIENT_NAME</T>
                  </div>
                </Grid>
              </Grid>

              {/* // */}
            </Grid>
          </Grid>

          <Grid item xs={6} container className="projectInformation__grid_container col2">
            <Grid spacing={3} container style={{ overflowX: 'hidden' }}>
              <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                <Grid item xs={2} className="grid__item_label">
                  <label className="form__label memo">
                    <T>PROJECT_MEMO</T>
                  </label>
                </Grid>
                <Grid item xs={10} className="grid__item_input">
                  <div className="form__input_box">
                    <MuiWrapper config={{ height: 'auto' }} className="form__textarea">
                      <TextField
                        id="senderMemo"
                        multiline
                        rows={12}
                        variant="outlined"
                        fullWidth
                        value={senderMemo.value}
                        onChange={senderMemo.onChange}
                      />
                    </MuiWrapper>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Styled.CreateProjectInformation>
  );
});

const Styled = {
  CreateProject: styled.div`
    padding-top: 100px;
    background-color: ${color.navy_blue};

    .test_box {
      position: absolute;
      top: -50px;
    }
    .project__timeline_box {
      padding-top: 50px;
    }
    .paper {
      position: relative;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px #000629;
      &:not(:first-of-type) {
        margin-top: 20px;
      }
    }
    .paper_subtitle {
      display: flex;
      align-items: center;
      font-size: 22px;
      margin-bottom: 40px;
      &:before {
        content: '';
        width: 50px;
        height: 4px;
        margin-right: 15px;
        background-color: ${color.blue};
      }
    }
    .grid__wrapper {
      padding: 0 50px;
    }
    .form__label {
      font-size: 15px;
      font-weight: 500;
      &.memo {
        position: relative;
        top: 12px;
      }
      &.indication {
        display: inline-block;
        /* width: 150px; */
      }
      &.flex-start-children {
        position: relative;
        top: 10px;
      }
    }
    .form__input_box {
      &.indication {
        width: 400px;
      }
    }
    .submit__box {
      margin-top: 80px;
      text-align: center;
      .button {
        min-width: 140px;
        &:not(:first-child) {
          margin-left: 5px;
        }
      }
    }
  `,
  CreateProjectInformation: styled.section`
    &.projectInformation__container {
      ${paper};
      padding: 25px 0px 40px;
      .projectInformation__delete_btn {
        position: absolute;
        top: 40px;
        right: 50px;
        width: 130px;
      }
      .projectInformation__title_container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 75px 0 60px;

        .projectInformation__title_img {
          /* margin-right: 40px; */
          position: absolute;
          left: -186px;
          bottom: -3px;
          width: 215px;
        }
        .projectInformation__title_box {
          position: relative;
          text-align: center;
          .projectInformation__title {
            position: relative;
            font-size: 36px;
            font-weight: 700;
            color: ${color.navy_blue};
            line-height: 1.5;
          }
          .projectInformation__subtitle {
            margin-top: 15px;
            font-size: 19px;
            color: ${color.gray_b5};
          }
        }
      }
      .projectInformation__content_title {
        ${paperSubtitle};
      }
      .projectInformation__content_grid_wrapper {
        padding: 0 50px;
      }
      .projectInformation__grid_container {
        /* width: calc(100% + 20px);
        margin: -10px; */

        .projectInformation__grid_item {
          position: relative;
          min-height: 40px;
          /* padding: 10px; */
          .form__input_box {
            .form__textarea {
              textarea {
                line-height: 1.5;
                height: 252px;
              }
            }
          }
          .customFormHelperText {
            position: absolute;
          }
        }
        &.col1 {
          padding-right: 35px;
          border-right: 1px dashed #ddd;
        }
        &.col2 {
          padding-left: 35px;
          /* margin-top: 26px; */
          .projectInformation__grid_item {
            .grid__item_label {
              /* width: calc(100% - 535px); */
            }
            .grid__item_input {
              /* width: 535px; */
            }
          }
        }
      }
      .form__share_check_box {
        margin-top: -10px;
      }
      .form__share_alert_box {
        /* padding-left: 32px; */
        /* font-size: 12px; */
        margin-top: -25px;
        font-size: 14px;
        color: ${color.red};
        line-height: 1.3;
        letter-spacing: -0.3px;
        white-space: nowrap;
      }
    }
  `,
};
