import { FormControl, Grid, MenuItem, Select, TextField } from '@material-ui/core';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { pageUrl, toolList } from 'lib/mapper';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { color, paper, paperSubtitle } from 'styles/utils';
import { ProjectSocketContext } from 'contexts/ProjectSocketContext';
import cx from 'classnames';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { addCommas, inputNumber } from 'lib/library';
import moment from 'moment';
import { AppActions, DesignerActions, ProjectActions } from 'store/actionCreators';
import useDateInput from 'lib/hooks/useDateInput';
import useInput from 'lib/hooks/useInput';
import MuiButton from 'components/common/button/MuiButton';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import { useHistory, useParams } from 'react-router';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import StarScore from 'components/common/score/StarScore';
import { complete_check } from 'components/base/images';
import ProjectFinishModalContainer from './ProjectFinishModalContainer';
import PlainModal from 'components/common/modal/PlainModal';
import { useTranslation } from 'react-i18next';
import T from 'components/common/text/T';
import CustomTooltip from 'components/common/tooltip/CustomTooltip';

export default function ProjectApplyInfoContainer({ projectInfo }) {
  const {
    user,
    // projectData,
    applyProjectSuccess,
    cancelApplyProjectSuccess,
    rejectProjectSuccess,
    deleteProjectSuccess,
    deleteProjectFailure,
    evaluateProjectSuccess,
  } = useShallowSelector(state => ({
    user: state.user.user,
    // projectData: state.project.project.data,
    applyProjectSuccess: state.designer.applyProject.success,
    cancelApplyProjectSuccess: state.designer.cancelApplyProject.success,
    rejectProjectSuccess: state.designer.rejectProject.success,
    deleteProjectSuccess: state.project.deleteProject.success,
    deleteProjectFailure: state.project.deleteProject.failure,
    evaluateProjectSuccess: state.project.evaluateProject.success,
  }));
  const history = useHistory();
  const { t } = useTranslation();
  const { pcode: projectCode } = useParams();
  // const { projectCode } = useContext(ProjectSocketContext);
  const userCode = user?.userCode;
  const applyInfo = projectInfo?.applyInfo;
  const senderCode = projectInfo?.senderCode;
  const receiverCode = projectInfo?.receiverCode;
  const company = projectInfo?.company;
  const stage = projectInfo?.stage;
  const designerInfo = projectInfo?.designerInfo;
  const isRejectDesigner = stage === 1 && designerInfo === null;
  const isGiveUpDesigner = stage === 2 && designerInfo === null;
  //
  const point = useInput('');
  const deliveryDate = useDateInput(null);
  // const deliveryDateYear = moment(deliveryDate.value).year();
  // const deliveryDateMonth = moment(deliveryDate.value).month();
  // const deliveryDateDay = moment(deliveryDate.value).date();
  // const deliveryTime = useDateInput(null);
  // const deliveryTimeHour = moment(deliveryTime.value).hour();
  // const deliveryTimeMinute = moment(deliveryTime.value).minute();
  // const deliveryTimeSecond = moment(deliveryTime.value).second();
  // evaluate state
  const evaluateScore = useInput(0);
  // valid state
  const validWorkTimeStatus = useInput(null);

  // 하나로 대체
  // submit용 deliveryTime
  // const submitDeliveryTime = moment()
  //   .year(deliveryDateYear)
  //   .month(deliveryDateMonth)
  //   .date(deliveryDateDay)
  //   .hour(deliveryTimeHour)
  //   .minute(deliveryTimeMinute)
  //   .second(deliveryTimeSecond);
  const programType = useInput('');
  const [isApply, setIsApply] = useState(null);

  // 프로젝트 성공 및 applyInfo 적용(matching 되는 시점 client페이지 적용)
  useEffect(() => {
    if (!!applyInfo) {
      const dateValue = applyInfo.deliveryDate ? moment(moment.unix(applyInfo.deliveryDate)) : null;

      point.setValue(applyInfo.workPoint);
      deliveryDate.setValue(dateValue);
      programType.setValue(applyInfo.programConfigIdx);
      // deliveryTime.setValue(dateValue);
    } else {
      // applyInfo null일 경우 초기화
      // point.setValue('');
      // deliveryDate.setValue(null);
      // deliveryTime.setValue(null);
      // programType.setValue('');
    }
  }, [applyInfo]);

  // onChange
  // projectCode reset
  useDidUpdateEffect(() => {
    point.setValue('');
    deliveryDate.setValue(null);
    programType.setValue('');
  }, [projectCode]);

  // desinger apply
  const handleApply = () => {
    setIsApply(true);
    validWorkTimeStatus.setValue(null);
    // validation check
    const minWorkTime = 30;
    const minWorkDate = moment().add(minWorkTime, t('GLOBAL_FULLTEXT_MINUTES'));
    const isValidworkTime =
      deliveryDate?.value?.diff(minWorkDate, t('GLOBAL_FULLTEXT_MINUTES')) >= 0;

    const isFailureSubmit = [
      !projectCode,
      !point.value,
      !isValidworkTime,
      // !deliveryDate.value,
      // !deliveryTime.value,
      !programType.value,
    ].some(item => item === true);

    if (!isValidworkTime) {
      validWorkTimeStatus.setValue(false);
      AppActions.show_toast({ type: 'warning', message: t('ALARM_MIN_WORKING_TIME') });
      // AppActions.add_popup({
      //   isOpen: true,
      //   title: <T>global.alert</T>,
      //   // content: <T>modal.complete</T>,
      //   content: '최소 작업단위는 30분입니다.',
      //   isTitleDefault: true,
      //   isContentDefault: true,
      // });
    }

    if (isFailureSubmit) return;

    // request api
    const submitData = {
      projectCode,
      point: +point.value,
      // deliveryDate: submitDeliveryTime ? submitDeliveryTime.unix() : null,
      deliveryDate: deliveryDate.value ? deliveryDate.value.unix() : null,
      programTypeIdx: programType.value,
    };
    // console.log(submitData, 'submitData');
    DesignerActions.apply_project_request(submitData);
  };

  // 성공 이후 re fetch
  const handleCancelApply = () => {
    setIsApply(false);
    DesignerActions.cancel_apply_project_request({ projectCode });
  };

  const handleWorking = () => {
    // hasProjectCode();
    DesignerActions.working_project_request({ projectCode });
  };

  const handleAccept = () => {
    // hasProjectCode();
    DesignerActions.accept_project_request({ projectCode });
  };

  const handleReject = () => {
    // hasProjectCode();
    DesignerActions.reject_project_request({ projectCode });
    history.push(pageUrl.project.list);
  };

  const cancelConfirmPopup = ({ onClickEvent }) => {
    AppActions.add_popup({
      // dim: false,
      isOpen: true,
      type: 'confirm',
      title: 'Alert',
      content: <T>ALARM_RE_CREATE_NO_MATCH_DESIGNER</T>,
      isTitleDefault: true,
      isContentDefault: true,
      okText: 'Renew',
      cancelText: 'Remove',
      // okText: (
      //   <MuiButton variant="contained" color="primary">
      //     다시 만들기
      //   </MuiButton>
      // ),
      // cancelText: (
      //   <MuiButton variant="contained" color="primary">
      //     프로젝트 취소하기
      //   </MuiButton>
      // ),
      onClick() {
        history.push(`${pageUrl.project.create}?projectCode=${projectCode}`);
        onClickEvent();
      },
      onCancel() {
        handleDeleteProject();
        // ProjectActions.delete_project_request({
        //   projectCode,
        // });
      },
    });
  };

  // 사용X projectContainer이동
  // listen reject, giveUp Popup
  useEffect(() => {
    // console.log('isRejectDesigner', isRejectDesigner);
    console.log('isGiveUpDesigner', isGiveUpDesigner);
    // if (isRejectDesigner) {
    //   cancelConfirmPopup({});
    // }

    // if (isGiveUpDesigner) {
    //   AppActions.add_popup({
    //     dim: false,
    //     isOpen: true,
    //     type: 'confirm',
    //     content:
    //       '디자이너가 프로젝트를 포기하였습니다.\n 프로젝트를 다시 만들거나 삭제할 수 있습니다.',
    //     isTitleDefault: true,
    //     isContentDefault: true,
    //     okText: 'Renew',
    //     cancelText: 'Remove',
    //     onClick() {
    //       console.log('click 1');
    //       history.push(`${pageUrl.project.create}?projectCode=${projectCode}`);
    //       console.log('click 2');
    //     },
    //     onCancel() {
    //       handleDeleteProject();
    //       // ProjectActions.delete_project_request({
    //       //   projectCode,
    //       // });
    //     },
    //   });
    // }
  }, [isGiveUpDesigner]);

  const handleDone = () => {
    // hasProjectCode();
    DesignerActions.done_project_request({ projectCode });
  };

  const handleGiveUp = () => {
    // hasProjectCode();
    AppActions.add_popup({
      isOpen: true,
      type: 'confirm',
      title: t('ALARM_IS_PROJECT_GIVE_UP'),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        DesignerActions.give_up_project_request({ projectCode });
        history.push(pageUrl.project.list);
      },
    });
    // DesignerActions.give_up_project_request({ projectCode });
    // history.push(pageUrl.project.list);
  };

  const handleRework = () => {
    // hasProjectCode();
    DesignerActions.rework_project_request({ projectCode });
  };

  // useEffect(() => {
  //   AppActions.add_popup({
  //     isOpen: true,
  //     type: 'confirm',
  //     // title: <T>global.alert</T>,
  //     // content: <T>modal.complete</T>,
  //     // isTitleDefault: true,
  //     // isContentDefault: true,
  //     title: 'Do you  want Confirm  designers work?',
  //     content: <ConfirmWorkModalContent checkPreferredDesigner={checkPreferredDesigner} />,
  //     isTitleDefault: true,
  //     isContentDefault: true,
  //     // align: ['button.center'],
  //     onClick() {
  //       console.log('ok click');
  //     },
  //   });
  // }, []);

  const checkPreferredDesigner = useCheckOneInput(true);
  const ConfirmWorkModalContent = ({
    checkPreferredDesigner: checkPreferredDesignerProp,
    point,
  }) => {
    const checkPreferredDesigner = useCheckOneInput(checkPreferredDesignerProp);

    const handleCheckPreferredDesigner = e => {
      checkPreferredDesigner.onChange(e);
      checkPreferredDesignerProp.onChange(e);
    };

    return (
      <Styled.ConfirmWorkModalContent>
        <div className="confirmWork__notice">
          {/* {1Would you like to pay {point} points to the designer?} */}
          {t('PROJECT_PAYMENT_PAY', { designer: 'designer', point })}
          <br />
          <T>PROJECT_PAYMENT_PAY_ALERT</T>
          <br />
        </div>
        {/* <div className="confirmWork__check">
          <FormControlLabel
            control={
              <MuiWrapper className="sm">
                <Checkbox
                  size="small"
                  checked={checkPreferredDesigner.value}
                  color="primary"
                  onChange={handleCheckPreferredDesigner}
                />
              </MuiWrapper>
            }
            label={
              <span>
                Add as Preferred Designer
              </span>
            }
            labelPlacement="end"
          />
        </div> */}
      </Styled.ConfirmWorkModalContent>
    );
  };

  const handleConfirm = () => {
    // hasProjectCode();
    AppActions.add_popup({
      isOpen: true,
      type: 'confirm',
      // title: 'Do you  want Confirm  designers work?',
      title: t('ALARM_CONFIRM_DESIGNER_WORK'),
      content: (
        <ConfirmWorkModalContent
          checkPreferredDesigner={checkPreferredDesigner}
          point={point.value}
        />
      ),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        DesignerActions.confirm_project_request({ projectCode });
      },
    });
  };

  const handleChangeDesigner = () => {
    // hasProjectCode();
    if (!receiverCode)
      return AppActions.show_toast({
        type: 'error',
        message: t('ALARM_BAD_REQUEST', { msg: 'Required receiverCode' }),
      });
    AppActions.add_popup({
      // dim: false,
      isOpen: true,
      type: 'confirm',
      title: 'Alert',
      // content:
      //   'You can recreate or delete the project.\n When you choose, you will automatically change the designer.',
      content: <T>ALARM_RECREATE_PROEJCT</T>,
      isTitleDefault: true,
      isContentDefault: true,
      okText: 'Renew',
      cancelText: 'Remove',
      onClick() {
        history.push(`${pageUrl.project.create}?projectCode=${projectCode}`);
        DesignerActions.change_designer_request({
          projectCode,
          designerCode: receiverCode,
        });
      },
      onCancel() {
        handleDeleteProject();
      },
    });

    // cancelConfirmPopup({
    //   onClickEvent: () => {
    //     DesignerActions.change_designer_request({
    //       projectCode,
    //       designerCode: receiverCode,
    //     });
    //   },
    // });
  };

  const handleDeleteProject = () => {
    // request api
    ProjectActions.delete_project_request({
      projectCode,
    });
  };

  useDidUpdateEffect(() => {
    if (deleteProjectSuccess) {
      history.push(`${pageUrl.project.list}`);
    }
    if (deleteProjectFailure) {
      history.goBack();
    }
  }, [!!deleteProjectSuccess, !!deleteProjectFailure]);
  // useDidUpdateEffect(() => {
  //   if (deleteProjectFailure) {
  //     history.go(0);
  //   }
  // }, [!!deleteProjectFailure]);

  const EvaluateModalContent = ({ score }) => {
    return (
      <Styled.EvaluateModalContent>
        <div className="evaluate__notice">
          <T>PROJECT_PAYMENT_CLIENT_EVALUATE</T>
          <br />
          {projectInfo?.projectId}
        </div>
        <div className="evaluate__star_box">
          <StarScore score={score} size={40} isEdit hideText align="center" />
        </div>
      </Styled.EvaluateModalContent>
    );
  };
  const [isOkEvalute, setIsOkEvalute] = useState(null);
  const handleEvaluate = () => {
    // request api
    AppActions.add_popup({
      isOpen: true,
      type: 'confirm',
      title: '',
      content: <EvaluateModalContent score={evaluateScore} />,
      align: ['button.center'],
      onClick() {
        setIsOkEvalute(true);
      },
    });
  };
  useDidUpdateEffect(() => {
    if (isOkEvalute) {
      ProjectActions.evaluate_project_request({
        projectCode,
        rating: evaluateScore.value,
      });
      setIsOkEvalute(false);
    }
  }, [isOkEvalute]);

  const { handleJoinProject, handleLeaveChat } = useContext(ProjectSocketContext);

  // SECTION: response api
  // re fetch Project
  useDidUpdateEffect(() => {
    if (evaluateProjectSuccess || cancelApplyProjectSuccess || applyProjectSuccess) {
      console.log('evaluateProjectSuccess', evaluateProjectSuccess);
      console.log('cancelApplyProjectSuccess', cancelApplyProjectSuccess);
      console.log('applyProjectSuccess', applyProjectSuccess);
      ProjectActions.fetch_project_request({ projectCode });
      // apply success 경우 projectJoin, fetch이후 ProjectSocketContext 에서 성공시점기준으로 projectJoin실행
      if (cancelApplyProjectSuccess || applyProjectSuccess) {
        // 변경 Context에서 호출
        if (cancelApplyProjectSuccess) {
          handleLeaveChat();
        }
        if (applyProjectSuccess) {
          console.log('applyProjectSuccess');
          handleJoinProject({ isApply: true });
          // project socket designer 알림 오지 않음
          DesignerActions.fetch_attend_designers_request({ projectCode });
        }
      }
    }
  }, [!!evaluateProjectSuccess, !!cancelApplyProjectSuccess, !!applyProjectSuccess]);

  return (
    <ProjectApplyInfo
      point={point}
      deliveryDate={deliveryDate}
      validWorkTimeStatus={validWorkTimeStatus}
      programType={programType}
      isApply={isApply}
      onApply={handleApply}
      onCancelApply={handleCancelApply}
      onAccept={handleAccept}
      onReject={handleReject}
      onDone={handleDone}
      onGiveUp={handleGiveUp}
      onConfirm={handleConfirm}
      onRework={handleRework}
      onChangeDesigner={handleChangeDesigner}
      onDeleteProject={handleDeleteProject}
      onEvaluate={handleEvaluate}
    />
  );
}

export const ProjectApplyInfo = React.memo(
  ({
    point,
    deliveryDate,
    validWorkTimeStatus,
    programType,
    isApply,
    onApply,
    onCancelApply,
    onSelect,
    onAccept,
    onReject,
    onDone,
    onGiveUp,
    onConfirm,
    onRework,
    onChangeDesigner,
    onDeleteProject,
    onEvaluate,
  }) => {
    const { userCode, projectData, attendDesigner } = useShallowSelector(state => ({
      userCode: state.user.user?.userCode,
      projectData: state.project.project.data,
      attendDesigner: state.designer.attendDesigners.data?.attendDesigner[0],
    }));
    const history = useHistory();
    const projectInfo = projectData?.projectInfo;
    const applyInfo = projectInfo?.applyInfo;
    const clientInfo = projectInfo?.clientInfo;
    const designerInfo = projectInfo?.designerInfo;
    const stage = projectInfo?.stage;
    const senderCode = projectInfo?.senderCode;
    const isWaiting = stage === 0;
    const isClient = userCode === senderCode;
    const ratingData = projectData?.ratingData;
    const { t } = useTranslation();

    // SECTION: state
    // 1: designer done 한 후 client 에게 띄우기
    // 2: client complete 한 후 designer 에게 띄우기
    const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(false);

    return (
      <Styled.ProjectApplyInfo data-component-name="ProjectApplyInfo">
        {((stage === 3 && attendDesigner && isClient) ||
          (stage === 4 && !ratingData && !isClient)) && (
          <PlainModal
            isOpen={isOpenConfirmPopup}
            // isOpen={true}
            onClick={() => setIsOpenConfirmPopup(false)}
            content={
              <ProjectFinishModalContainer
                onClose={() => setIsOpenConfirmPopup(false)}
                item={attendDesigner}
                clientInfo={clientInfo}
                isClient={isClient}
              />
            }
            width={1200}
            isCloseIcon={false}
            borderRadius={10}
          />
        )}

        <h1 className="projectApplyInfo__content_title">
          <T>PROJECT_PAYMENT</T>
        </h1>

        <div className="projectApplyInfo__content_grid_wrapper">
          <Grid
            container
            spacing={3}
            alignItems="center"
            className="projectApplyInfo__submit_form_container"
          >
            <Grid item className="projectApplyInfo__submit_form_label">
              <T>GLOBAL_TOTAL_POINTS</T>
            </Grid>
            <Grid item className="projectApplyInfo__submit_form_input">
              <MuiWrapper>
                <TextField
                  disabled={!isWaiting}
                  variant="outlined"
                  fullWidth
                  value={addCommas(point.value && +point.value) || ''}
                  onChange={e => point.onChange({ value: inputNumber(e.target.value) })}
                  error={isApply ? !point.value : false}
                  // disabled
                />
              </MuiWrapper>
            </Grid>

            <Grid item className="projectApplyInfo__submit_form_label">
              <T>PROJECT_DELIVERY_TIME</T>
            </Grid>
            <Grid item className="projectApplyInfo__submit_form_input">
              <CustomDatePicker
                disabled={!isWaiting}
                disabledDate
                disabledTime
                showTime
                format="YYYY-MM-DD HH:mm"
                value={deliveryDate.value}
                fullWidth
                height={40}
                onChange={e => {
                  deliveryDate.onChange(e, value => {
                    if (value === null) {
                      validWorkTimeStatus.setValue(false);
                    } else {
                      validWorkTimeStatus.setValue(null);
                    }
                  });
                }}
                className={cx({
                  error: isApply ? validWorkTimeStatus.value === false : false,
                })}
              />
            </Grid>

            <Grid item className="projectApplyInfo__submit_form_label">
              <T>PROJECT_CAD_PROGRAM</T>
            </Grid>
            <Grid item className="projectApplyInfo__submit_form_input">
              <MuiWrapper className="form__input_box">
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={isApply ? !programType.value : false}
                >
                  <Select
                    disabled={!isWaiting}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                      marginThreshold: 10,
                    }}
                    displayEmpty
                    value={programType.value}
                    onChange={programType.onChange}
                  >
                    <MenuItem disabled value=""></MenuItem>
                    {toolList?.length > 0 &&
                      toolList.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </Grid>
          </Grid>
        </div>

        <div className="projectApplyInfo__submit_container">
          <div className="projectApplyInfo__submit_notice">
            {/* <ErrorOutlineOutlinedIcon htmlColor="inherit" /> */}
            {/* {isClient ? <T>PROJECT_CLIENT_NOTE_WORK_LIST_BELOW</T> : <T>PROJECT_DONE_INFO</T>} */}
            {isClient && (
              <>
                <ErrorOutlineOutlinedIcon htmlColor="inherit" />
                <T>PROJECT_CLIENT_NOTE_WORK_LIST_BELOW</T>
              </>
            )}

            {stage === 0 && !isClient && (
              <>
                <ErrorOutlineOutlinedIcon htmlColor="inherit" />
                <T>PROJECT_MATCHING_ALERT</T>
              </>
            )}
            {stage === 1 && !isClient && (
              <>
                <ErrorOutlineOutlinedIcon htmlColor="inherit" />
                <T>PROJECT_MATCHING_ALERT</T>
              </>
            )}
            {stage === 2 && !isClient && (
              <>
                <ErrorOutlineOutlinedIcon htmlColor="inherit" />
                <T>PROJECT_DONE_INFO</T>
              </>
            )}
          </div>
          <Grid container justify="space-between" className="projectApplyInfo__submit_grid_box">
            <Grid item xs={3} className="projectApplyInfo__submit_grid_item">
              <MuiButton
                disableElevation
                variant="outlined"
                color="primary"
                className="projectApplyInfo__submit_btn"
                onClick={() => history.push(pageUrl.project.list)}
              >
                <T>GLOBAL_PROJECT_LIST</T>
              </MuiButton>
            </Grid>

            <Grid
              item
              xs={9}
              container
              justify="flex-end"
              className="projectApplyInfo__submit_grid_item"
            >
              {/* waiting, client */}
              {stage === 0 && isClient && (
                <>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="projectApplyInfo__submit_btn"
                    onClick={onSelect}
                  >
                    <T>GLOBAL_SELECT</T>
                  </MuiButton>
                </>
              )}

              {/* waiting, designer */}
              {stage === 0 && !isClient && (
                <>
                  {!applyInfo ? (
                    <MuiButton
                      disableElevation
                      variant="contained"
                      color="primary"
                      className="projectApplyInfo__submit_btn"
                      onClick={onApply}
                    >
                      <T>GLOBAL_APPLY</T>
                    </MuiButton>
                  ) : (
                    <MuiButton
                      disableElevation
                      variant="contained"
                      color="primary"
                      className="projectApplyInfo__submit_btn"
                      onClick={onCancelApply}
                    >
                      <T>GLOBAL_CANCEL</T>
                    </MuiButton>
                  )}
                </>
              )}

              {/* matching, designer */}
              {/* {stage === 1 && !isClient && (
                <>
                  <MuiButton
                    disableElevation
                    variant="outlined"
                    color="secondary"
                    className="projectApplyInfo__submit_btn"
                    onClick={onReject}
                  >
                    Reject
                  </MuiButton>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="projectApplyInfo__submit_btn"
                    onClick={onAccept}
                  >
                    Accept
                  </MuiButton>
                </>
              )} */}

              {/* working, designer */}
              {stage === 2 && !isClient && (
                <>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="projectApplyInfo__submit_btn"
                    onClick={onDone}
                  >
                    <T>PROJECT_DONE</T>{' '}
                    {applyInfo?.reworkCount
                      ? `(${applyInfo?.reworkCount}/${applyInfo?.rework})`
                      : ``}
                  </MuiButton>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="projectApplyInfo__submit_btn"
                    onClick={onGiveUp}
                  >
                    <T>PROJECT_GIVE_UP</T>
                  </MuiButton>
                </>
              )}

              {/* working 중 delivery time 지남 */}
              {stage === 2 && isClient && !!applyInfo?.expired && (
                <MuiButton
                  disableElevation
                  variant="contained"
                  color="primary"
                  className="projectApplyInfo__submit_btn"
                  onClick={onChangeDesigner}
                >
                  <T>PROJECT_CHANGE_DESIGNER</T>
                </MuiButton>
              )}

              {/* done, client */}
              {stage === 3 && isClient && (
                <>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="projectApplyInfo__submit_btn"
                    // onClick={onConfirm}
                    onClick={() => setIsOpenConfirmPopup(true)}
                  >
                    <T>PROJECT_CONFIRM_AND_PAY</T>
                  </MuiButton>

                  <CustomTooltip
                    // open={true}
                    arrow={false}
                    placement="bottom-start"
                    title={t('PROJECT_REQUEST_REDESIGN_TOOLTIP')}
                    disableHoverListener={false}
                    interactive={false}
                    customStyle={{
                      color: `#303030`,
                      backgroundColor: `#ffffff`,
                      boxShadow: `0px 0px 6px rgb(0 0 0 / 16%)`,
                      borderRadius: `10px`,
                      // fontSize: `10px`,
                    }}
                  >
                    <MuiButton
                      disableElevation
                      disabled={applyInfo?.reworkCount == applyInfo?.rework ? true : false}
                      variant="contained"
                      color="primary"
                      className="projectApplyInfo__submit_btn"
                      onClick={onRework}
                    >
                      <T>PROJECT_REQUEST_REDESIGN</T>{' '}
                      {!!applyInfo?.reworkCount
                        ? `(${applyInfo?.reworkCount}/${applyInfo?.rework})`
                        : ``}
                    </MuiButton>
                  </CustomTooltip>
                  {(applyInfo?.reworkCount !== 0 || !!applyInfo?.expired) && (
                    <MuiButton
                      disableElevation
                      variant="contained"
                      color="primary"
                      className="projectApplyInfo__submit_btn"
                      onClick={onChangeDesigner}
                    >
                      <T>PROJECT_CHANGE_DESIGNER</T>
                    </MuiButton>
                  )}
                </>
              )}

              {stage === 4 && (
                <>
                  {!isClient && !ratingData && (
                    <MuiButton
                      disableElevation
                      variant="contained"
                      color="primary"
                      className="projectApplyInfo__submit_btn"
                      // onClick={onEvaluate}
                      onClick={() => setIsOpenConfirmPopup(true)}
                    >
                      <T>PROJECT_EVALUATE</T>
                    </MuiButton>
                  )}
                  {!!ratingData && (
                    <div className="projectContact__score_box">
                      <StarScore
                        max={5}
                        score={ratingData?.rating}
                        size={35}
                        gutter={5}
                        hideText
                        align="center"
                      />
                    </div>
                  )}
                  {/* {!!ratingData && (
                    <div className="projectContact__score_box">
                      <StarScore
                        max={5}
                        score={ratingData?.rating}
                        size={35}
                        gutter={5}
                        hideText
                        align="center"
                      />
                    </div>
                  )} */}
                </>
              )}
            </Grid>
          </Grid>
        </div>

        {/* matching, designer */}
        {/* done, designer */}
        {((stage === 1 && !isClient) || (stage === 3 && !isClient)) && (
          <section className="projectApplyInfo__staging_action_container">
            <div className="projectApplyInfo__staging_action_content">
              <figure className="projectApplyInfo__staging_action_figure">
                <img src={complete_check} alt="complete" />
              </figure>
              <div className="projectApplyInfo__staging_action_text">
                {stage === 1 && !isClient && (
                  <>
                    {/* <h2>You have been selected for the project.</h2>
                    <p>Click the [Accept] button on the right to start working.</p> */}
                    <h2>
                      <T>POPUP_MSG_SELECTED_PROJECT</T>
                    </h2>
                    <p>
                      <T>PROJECT_CLICK_BEGIN</T>
                    </p>
                  </>
                )}
                {stage === 3 && !isClient && (
                  <>
                    {/* <h2>Submission is complete.</h2>
                    <p>Please wait for the result.</p> */}
                    <h2>
                      <T>PROJECT_SUBMITTED</T>
                    </h2>
                    <p>
                      <T>PROJECT_SUBMITTED_WAIT_RESULT</T>
                    </p>
                  </>
                )}
              </div>
            </div>
            {stage === 1 && !isClient && (
              <div className="projectApplyInfo__staging_action_btn_box">
                <MuiButton
                  disableElevation
                  variant="outlined"
                  color="red"
                  className="projectApplyInfo__staging_action_btn"
                  onClick={onReject}
                >
                  <T>GLOBAL_REJECTED</T>
                </MuiButton>
                <MuiButton
                  disableElevation
                  variant="contained"
                  color="primary"
                  className="projectApplyInfo__staging_action_btn"
                  onClick={onAccept}
                >
                  <T>PROJECT_BEGIN</T>
                </MuiButton>
              </div>
            )}
          </section>
        )}
      </Styled.ProjectApplyInfo>
    );
  },
);

const Styled = {
  ProjectApplyInfo: styled.section`
    ${paper};
    .projectApplyInfo__content_title {
      ${paperSubtitle};
    }
    .projectApplyInfo__content_grid_wrapper {
      padding: 0 50px;
    }
    .projectApplyInfo__submit_form_container {
      font-weight: 700;
      font-size: 16px;
    }
    .projectApplyInfo__submit_form_label {
      width: 25%;
      letter-spacing: -0.3px;
    }
    .projectApplyInfo__submit_form_input {
      width: 75%;
    }
    .projectApplyInfo__submit_container {
      margin: 35px 50px 0;
      .projectApplyInfo__submit_notice {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: ${color.gray_week_font};
        svg {
          font-size: 18px;
          margin-right: 5px;
        }
      }
      .projectApplyInfo__submit_grid_box {
        margin-top: 15px;
        .projectApplyInfo__submit_grid_item {
          .button:not(:first-child) {
            margin-left: 10px;
          }
        }
        .projectApplyInfo__submit_btn {
          min-width: 130px;
          text-transform: none;
          margin-left: 10px;
        }
      }
    }
    .projectApplyInfo__staging_action_container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 40px 50px;
      background-color: rgba(255, 255, 255, 0.75);
      border-radius: 10px;
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      .projectApplyInfo__staging_action_content {
        width: 100%;
        text-align: center;
        .projectApplyInfo__staging_action_figure {
          padding: 40px 0;
        }
        .projectApplyInfo__staging_action_text {
          h2 {
            font-size: 25px;
          }
          p {
            margin-top: 20px;
          }
        }
      }
      .projectApplyInfo__staging_action_btn_box {
        display: flex;
        justify-content: space-between;
        margin-top: -40px;
        width: 100%;
        .projectApplyInfo__staging_action_btn {
          min-width: 130px;
        }
      }
    }
  `,
  // ConfirmWorkModalContent Popup
  ConfirmWorkModalContent: styled.div``,
  EvaluateModalContent: styled.div`
    .evaluate__notice {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      line-height: 1.5;
    }
    .evaluate__star_box {
      margin: 15px 0 25px;
    }
  `,
};
