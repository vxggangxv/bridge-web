import React, { useContext, useEffect, useMemo } from 'react';
import { DesignerActions, ProjectActions } from 'store/actionCreators';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { StyledInShadowButtonOuter } from 'components/common/styled/Button';
import T from 'components/common/text/T';
import { color } from 'styles/utils';
import MuiButton from 'components/common/button/MuiButton';
import { useTranslation } from 'react-i18next';
import { CloseIconButton } from 'components/common/button/CloseIconButton';
import { Grid, TextField } from '@material-ui/core';
import ProjectUploadContainer from 'containers/project/ProjectUploadContainer';
import moment from 'moment';
import CustomText from 'components/common/text/CustomText';
import useInput from 'lib/hooks/useInput';
import UnitSlider from 'components/common/slider/UnitSlider';
import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomSpan from 'components/common/text/CustomSpan';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { ProjectContext } from 'contexts/project/ProjectContext';

function RemakeProjectModal({
  stage,
  userType,
  type,
  projectCode,
  projectId,
  remakeInfo,
  onCancel,
}) {
  const { remakeInfoData, remakeInfoSuccess, remakeProjectSuccess, doneProjectSuccess } =
    useShallowSelector(state => ({
      remakeInfoData: state.project.remakeProject.data?.remakeInfo,
      remakeInfoSuccess: state.project.remakeProject.success,
      remakeProjectSuccess: state.designer.remakeProject.success,
      doneProjectSuccess: state.designer.doneProject.success,
    }));
  const remakeMemo = useInput('');
  const gapWithCement = useInput(0.08); // 0.00 ~ 0.20 mm
  const minimalTickness = useInput(0.6); // 0.40 ~ 1.00 mm
  const millingToolDiameter = useInput(1.2); // 0.0 ~ 1.50 mm
  const adjustContact = useInput(0); // -1.00 ~ 1.00 mm
  const adjustBite = useInput(0.1); // -0.50 ~ 2.50 mm
  const { t } = useTranslation();
  const isEditType = type === 'edit';
  // const isViewType = type === 'view';
  // const isSender = userType === 'sender';
  // const isReceiver = userType === 'receiver';
  const isEditFromSender = isEditType && userType === 'sender';
  const isEditFromReceiver = type === 'view' && userType === 'receiver';
  const okText = useMemo(() => {
    let returnValue = t('GLOBAL_OK');
    if (isEditFromSender) returnValue = t('GLOBAL_SEND');
    if (isEditFromReceiver) {
      returnValue = t('PROJECT_DONE');
    }
    return returnValue;
  }, [userType]);
  // sender일 경우 edit일 떄와 view구분을 위한 값

  const { onCheckExistingUploadUserFile, onUploadLocalFile } = useContext(ProjectContext);

  const handleRemakeProject = () => {
    // TODO: remake modal
    const submitData = {
      projectCode,
      memo: remakeMemo.value,
      gapWithCement: gapWithCement.value,
      minimalTickness: minimalTickness.value,
      millingToolDiameter: millingToolDiameter.value,
      adjustContact: adjustContact.value,
      adjustBite: adjustBite.value,
    };

    DesignerActions.remake_project_request(submitData);
  };

  const handleDone = () => {
    // hasProjectCode();
    DesignerActions.done_project_request({ projectCode, remakeIdx: remakeInfo?.remakeIdx });
  };

  const handleSubmit = () => {
    console.log('handleSubmit remake');
    if (isEditFromSender) return onCheckExistingUploadUserFile(handleRemakeProject);
    if (isEditFromReceiver) return onCheckExistingUploadUserFile(handleDone);
    // if가 아닐경우 (admin) 확인 클릭 -> 닫기
    onCancel();
  };

  // DidUpdate
  useEffect(() => {
    // console.log(moment(1638172245547).format('YYYY MM DD'));
    // console.log(moment.unix(1638172245).format('YYYY MM DD'));

    // console.log('type------------', type);
    if (type === 'view') {
      // ProjectActions.fetch_remake_project_clear();
      ProjectActions.fetch_remake_project_request({
        projectCode,
        remakeIdx: remakeInfo?.remakeIdx,
      });
    }
  }, []);

  useDidUpdateEffect(() => {
    if (remakeInfoSuccess) {
      remakeMemo.setValue(remakeInfoData?.memo || '');
      gapWithCement.setValue(remakeInfoData?.gapWithCement);
      minimalTickness.setValue(remakeInfoData?.minimalTickness);
      millingToolDiameter.setValue(remakeInfoData?.millingToolDiameter);
      adjustContact.setValue(remakeInfoData?.adjustContact);
      adjustBite.setValue(remakeInfoData?.adjustBite);
    }
  }, [!!remakeInfoSuccess]);

  useDidUpdateEffect(() => {
    if (remakeProjectSuccess || doneProjectSuccess) {
      onCancel();
      if (remakeProjectSuccess) {
        onUploadLocalFile();
      }
    }
  }, [!!remakeProjectSuccess, !!doneProjectSuccess]);

  // DidUnMount, 이전 데이터 노출 X, edit 에서 초기값을 받기 위해
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <StyledRemakeProjectModal data-component-name="RemakeProjectModal">
      <div className="modal__body">
        <div className="modal__content default">
          <div className="modal__content_card">
            <Grid container justify="space-between">
              <Grid item xs={6}>
                <ProjectUploadContainer
                  viewType="modal"
                  isEdit={isEditType || isEditFromReceiver}
                  hasUpload={isEditFromReceiver}
                />
              </Grid>
              <Grid item xs={6} className="remakeProjectModal__form_container">
                <CustomText fontSize={22} fontColor={color.navy_blue}>
                  {projectId}
                </CustomText>
                <CustomText fontSize={19} marginTop={30}>
                  [ <T>PROJECT_REQUEST_REDESIGN</T> ]
                </CustomText>
                <Grid container justify="space-between" className="remakeProjectModal__form_box">
                  <Grid item xs={6}>
                    <div className="form_label">Gap width of cement (0.00 ~ 0.20mm)</div>
                    <UnitSlider
                      ariaLabelledby="gapWithCement-slider"
                      disabled={!isEditType}
                      data={gapWithCement}
                      min={0}
                      max={0.2}
                      step={0.001}
                      digit={6}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="form_label">Minimal thickness (0.40 ~ 1.00mm)</div>
                    <UnitSlider
                      ariaLabelledby="minimalTickness-slider"
                      disabled={!isEditType}
                      data={minimalTickness}
                      min={0.4}
                      max={1}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="form_label">Adjust contact (-1.00 ~ 1.00mm)</div>
                    <UnitSlider
                      ariaLabelledby="adjustContact-slider"
                      disabled={!isEditType}
                      data={adjustContact}
                      min={-1}
                      max={1}
                    />{' '}
                  </Grid>
                  <Grid item xs={6}>
                    <div className="form_label">Adjust bite (-0.50 ~ 2.50mm)</div>
                    <UnitSlider
                      ariaLabelledby="adjustBite-slider"
                      disabled={!isEditType}
                      data={adjustBite}
                      min={-0.5}
                      max={2.5}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="form_label">Milling tool diameter (0.00 ~ 1.50mm)</div>
                    <UnitSlider
                      ariaLabelledby="millingToolDiameter-slider"
                      disabled={!isEditType}
                      data={millingToolDiameter}
                      min={0}
                      max={1.5}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <div className="form_label">
                      <T>PROJECT_MEMO</T>
                    </div>
                    <div className="form__input_box">
                      <MuiWrapper config={{ height: '275px' }}>
                        <TextField
                          id="remakeMemo"
                          multiline
                          rows={15}
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            readOnly: !isEditType,
                          }}
                          value={remakeMemo.value}
                          onChange={remakeMemo.onChange}
                        />
                      </MuiWrapper>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <div className="modal__footer">
        <div className="modal__btn_box default">
          <StyledInShadowButtonOuter
            width={320}
            height={60}
            marginTop={-40}
            bgColor={color.navy_blue}
          >
            <MuiButton
              config={{
                width: '300px',
                color: color.blue,
              }}
              disabled={isEditFromReceiver && stage > 2}
              disableElevation
              variant="contained"
              onClick={handleSubmit}
              className="md border-radius-round projectInformation__review_btn"
            >
              {okText}
              <CloseIconButton onCancel={onCancel} />
            </MuiButton>
          </StyledInShadowButtonOuter>
        </div>
      </div>
    </StyledRemakeProjectModal>
  );
}

RemakeProjectModal.propTypes = {
  stage: PropTypes.number.isRequired,
  userType: PropTypes.string.isRequired,
  type: PropTypes.string,
  projectCode: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  remakeInfo: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default React.memo(RemakeProjectModal);

const StyledRemakeProjectModal = styled.div`
  width: 1800px;
  .modal__body {
    .modal__content.default {
      .modal__content_card {
        padding-bottom: 75px;
      }
    }
  }
  .modal__footer {
  }

  .remakeProjectModal__form_container {
    padding-left: 65px;
    .remakeProjectModal__form_box {
      margin-top: 30px;
      padding-left: 25px;
      row-gap: 20px;
      .MuiGrid-grid-xs-6 {
        flex-basis: calc(50% - 25px);
      }
    }
  }
  .form_label {
    font-size: 15px;
  }
  .form__input_box {
    margin-top: 15px;
  }
`;
