import CustomText from 'components/common/text/CustomText';
import T from 'components/common/text/T';
import CreateProject from 'components/project/CreateProject';
import { ProjectContext } from 'contexts/project/ProjectContext';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import useDateInput from 'lib/hooks/useDateInput';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import useImmerInput from 'lib/hooks/useImmerInput';
import useInput from 'lib/hooks/useInput';
import { makeCaseIdFn } from 'lib/library';
import { pageUrl } from 'lib/mapper';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import moment from 'moment';
import queryString from 'query-string';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AppActions, ProjectActions, UtilActions } from 'store/actionCreators';
import { color } from 'styles/utils';

export default function ProjectContainer(props) {
  const {
    // teethData,
    user,
    supportCountryList,
    caseInit,
    caseInitSuccess,
    indicationFormat,
    indicationFormatSuccess,
    indicationInfo,
    indicationInfoSuccess,
    projectData,
    editProjectData,
    editProjectSuccess,
    editProjectError,
    editProjectFailure,
    supportCountryListSuccess,
    fetchProjectSuccess,
  } = useShallowSelector(state => ({
    // teethData: state.util.teeth,
    user: state.user.user,
    supportCountryList: state.util.supportCountries.data?.languageList,
    caseInit: state.project.initProject.data?.caseInit,
    caseInitSuccess: state.project.initProject.success,
    indicationFormat: state.util.indicationFormat.data?.indicationFormat,
    indicationFormatSuccess: state.util.indicationFormat.success,
    indicationInfo: state.util.indicationInfo.data?.indicationInfo,
    indicationInfoSuccess: state.util.indicationInfo.success,
    projectData: state.project.project.data,
    editProjectData: state.project.editProject.data,
    editProjectSuccess: state.project.editProject.success,
    editProjectError: state.project.editProject.error,
    editProjectFailure: state.project.editProject.failure,
    supportCountryListSuccess: state.util.supportCountries.success,
    fetchProjectSuccess: state.project.project.success,
  }));
  const history = useHistory();
  // const { search } = useLocation();
  const { pcode: projectCodeParam } = useParams();
  // const location = useLocation();
  // console.log('params', params);
  // console.log('location', location);
  // const queryParse = queryString.parse(location.search);
  // const projectCodeParam = queryParse?.projectCode;
  // const [patientCode, setPatientCode] = useState('');
  const userCode = user?.userCode;
  const company = user?.company;
  // onChange state
  // information state
  const projectTitle = useInput('');
  const patient = useInput('');
  const dueDate = useDateInput(null);
  const senderMemo = useInput('');
  const manager = useInput(''); // manager
  const preferedProgram = useInput(0);
  // const preferedProgram = useInput([]);
  const language = useInput([]); // US: 233, KR: 116
  const checkSharePatient = useCheckOneInput(true); // checkSharePatient(e.target.checked)
  // indication state
  const toothShade = useInput('');
  const numbering = useInput(0);
  const { t } = useTranslation();

  // tooth = { number: null, index: null, hasDate: false }
  const tooth = useInput({
    number: null,
    hasDate: false,
    // index: null,
    // number: 18,
  }); // teeth 단수
  const teeth = useInput([]);
  const bridge = useInput([]);
  // teethContextActions 생성
  const teethContextActions = useImmerInput({
    copy: {
      active: false,
      hidden: false,
    },
    paste: {
      active: false,
      hidden: false,
    },
    delete: {
      active: false,
      hidden: false,
    },
  });
  const copyData = useInput({ number: null, hasDate: false });
  const indicationSeq = useInput(0);
  // {id, seq, color}
  const indication = useInput({
    id: 0,
    seq: 0,
    // color: '',
    color: color.blue,
  });
  const material = useInput(0);
  const implant = useInput(0);
  const checkSituScan = useCheckOneInput(false);
  const checkGingivaScan = useCheckOneInput(false);
  const gapWithCement = useInput(0.08); // 0.00 ~ 0.20 mm
  const minimalTickness = useInput(0.6); // 0.40 ~ 1.00 mm
  const millingToolDiameter = useInput(1.2); // 0.0 ~ 1.50 mm

  const isValidRequiredValue = useMemo(() => {
    const validValueList = [
      !!projectTitle.value,
      !!dueDate.value,
      // !!preferedProgram.value?.length,
      !!preferedProgram.value,
      !!teeth.value?.length,
    ];
    const isValid = validValueList.every(item => item === true);
    // console.log('isValid', isValid);
    return isValid;
  }, [projectTitle.value, dueDate.value, preferedProgram.value, teeth.value]);

  //
  let [isSubmit, setIsSubmit] = useState(null);
  // console.log('-------------createRender');
  const [projectCount, setProjectCount] = useState(0);
  const caseId = useMemo(() => {
    const returnValue = makeCaseIdFn({
      companyName: company,
      caseCount: projectCount,
      // patientCode,
      // caseIdValue: patient.value,
      caseIdValue: projectTitle.value,
    })(1);
    // checkSharePatient.value 제거
    console.log('work caseId', returnValue);
    return returnValue;
  }, [company, projectCount, projectTitle.value]);
  // project context
  const {
    projectCodeCt,
    localFileListCt,
    cloudFileListCt,
    onCheckExistingUploadUserFile,
    onUploadLocalFile,
  } = useContext(ProjectContext);
  // fetch project state
  const [stage, setStage] = useState(0);
  const [timeline, setTimeline] = useState({});
  // fetch project state, edit api required value
  const [teethTreatmentIdx, setTeethTreatmentIdx] = useState(null);
  const [projectCode, setProjectCode] = useState('');
  // fetch project data
  const projectInfo = projectData?.projectInfo;
  const projectFileList = projectData?.fileList;

  // tooth design
  const restorationPontic = useInput(0);
  const occlusalSurface = useInput(0);
  const ceramicMetal = useInput(0);
  //
  const pointPerTeeth = caseInit?.pointPerTeeth;

  // show total price on create btn
  const totalPrice = useMemo(() => {
    const validTeeth = teeth.value.filter(item => item.material !== 21);

    return validTeeth.length * pointPerTeeth || 0;
  }, [pointPerTeeth, teeth.value]);
  // const totalPrice = useMemo(() => {
  //   // 116: 6, 233: 10, etc: 8
  //   let unitPrice = 8;
  //   const countryId = user.country_id;
  //   if (countryId === 116) unitPrice = 6;
  //   if (countryId === 233) unitPrice = 10;
  //   return teeth.value?.length ? teeth.value?.length * unitPrice : 0;
  // }, [user.country_id, teeth.value]);

  // SECTION: init
  useEffect(() => {
    UtilActions.fetch_support_countries_request();
    // TODO: langauge 삭제
    UtilActions.fetch_teeth_indication_info_request();
    // { language: 'EN' }
    UtilActions.fetch_teeth_indication_format_request();
    ProjectActions.init_project_request({ userCode });

    // 클라우드 파일 리스트 초기화(CreatePage 진입시에는 무조건 초기화)
    cloudFileListCt.setValue([]);
    console.log('projectCodeParam', projectCodeParam);
    if (!!projectCodeParam) {
      // TODO: props or Context value 에서 reject 또는 done의 경우 ex. fromStage
      ProjectActions.fetch_project_request({
        projectCode: projectCodeParam,
      });
      projectCodeCt.setValue(projectCodeParam);
    }
  }, []);

  useDidUpdateEffect(() => {
    console.log('caseInit', caseInit);
    if (!caseInitSuccess) return;
    // setPatientCode(caseInit?.patientCode || '');
    setProjectCount(caseInit?.projectCount || 0);
  }, [!!caseInitSuccess]);

  useDidUpdateEffect(() => {
    if (!fetchProjectSuccess) return;
    console.log(projectInfo, 'projectInfo');
    console.log(projectFileList, 'projectFileList');

    // timeline
    setStage(projectInfo?.stage || 0);
    setTimeline(projectInfo?.timeline || {});
    // information
    // setPatientCode(projectInfo?.patientCode || '');
    setProjectCount(projectInfo?.applyCount || 0);
    projectTitle.setValue(projectInfo?.projectTitle || '');
    patient.setValue(projectInfo?.patient);
    dueDate.setValue(projectInfo?.dueDate ? moment.unix(projectInfo?.dueDate) : null);
    senderMemo.setValue(projectInfo?.senderMemo || '');
    manager.setValue(projectInfo?.manager || '');
    preferedProgram.setValue(projectInfo?.preferedProgramIdx || []);
    language.setValue(projectInfo?.preferedLanguage || []);
    // checkSharePatient.setValue(projectInfo?.patientShareCheck ? true : false);
    // indication
    toothShade.setValue(projectInfo?.indication?.toothShade || '');
    numbering.setValue(projectInfo?.indication?.notation || 0);
    teeth.setValue(projectInfo?.indication?.teeth || []);
    // console.log('projectInfo?.indication?.teeth-', projectInfo?.indication?.teeth);
    bridge.setValue(projectInfo?.indication?.bridgeList || []);
    //
    restorationPontic.setValue(projectInfo?.indication?.restorationPonticDesign);
    occlusalSurface.setValue(projectInfo?.indication?.occlusalSurfaceDesign);
    ceramicMetal.setValue(projectInfo?.indication?.ceramicMetalDesign);

    // edit api data
    setTeethTreatmentIdx(projectInfo?.indication?.teethTreatmentIdx);
    setProjectCode(projectInfo?.indication?.projectCode);

    cloudFileListCt.setValue(projectFileList);
  }, [!!fetchProjectSuccess]);

  // 치아 클릭용
  const handleToggleTooth = useCallback(
    number => {
      let currentTooth = teeth.value.find(item => item.number === number);
      console.log('currentTooth', currentTooth);
      if (!!currentTooth) {
        console.log('currentTooth set work');

        indicationSeq.setValue(currentTooth.preparationType);
        indication.setValue({
          // id: currentTooth.indicationIdx,
          // seq: currentTooth.reconstructionType,
          seq: currentTooth.indicationIdx,
          // TODO: temp
          color: currentTooth.color || color.blue,
        });
        material.setValue(currentTooth.material);
        implant.setValue(currentTooth.implantType);
        checkSituScan.setValue(!!currentTooth.situScan);
        checkGingivaScan.setValue(!!currentTooth.separateGingivaScan);
        gapWithCement.setValue(currentTooth.gapWithCement);
        minimalTickness.setValue(currentTooth.minimalTickness);
        millingToolDiameter.setValue(currentTooth.millingToolDiameter);
      } else {
        indicationSeq.setValue('');
        indication.setValue({});
        material.setValue(0);
        implant.setValue(0);
        checkSituScan.setValue(false);
        checkGingivaScan.setValue(false);
        // 초기화 필요시 추가
        // gapWithCement.setValue(0.08);
        // minimalTickness.setValue(0.6);
        // millingToolDiameter.setValue(1.2);
      }
    },
    [teeth.value, tooth.value],
  );

  // TEST:
  useEffect(() => {
    console.log('caseId', caseId);
  }, [caseId]);
  useEffect(() => {
    console.log('tooth.value', tooth.value);
  }, [tooth.value]);

  useEffect(() => {
    console.log('bridge.value', bridge.value);
  }, [bridge.value]);
  // useEffect(() => {
  //   console.log('preferedProgram.value', preferedProgram.value);
  // }, [preferedProgram.value]);

  //  TeethSvgV2에서 onChange
  const handleChangeToothValue = useCallback(data => {
    console.log('currentTooth data', data);

    indicationSeq.setValue(data.preparationType);
    indication.setValue({
      // id: data.indicationIdx,
      // seq: data.reconstructionType,
      seq: data.indicationIdx,
      color: data.color,
    });
    material.setValue(data.material);
    implant.setValue(data.implantType);
    checkSituScan.setValue(!!data.situScan);
    checkGingivaScan.setValue(!!data.separateGingivaScan);
    gapWithCement.setValue(data.gapWithCement);
    minimalTickness.setValue(data.minimalTickness);
    millingToolDiameter.setValue(data.millingToolDiameter);
  }, []);

  // teeth table click
  const handleClickTooth = number => {
    const currentTooth = teeth.value.find(item => item.number === number);
    // console.log('currentTooth', currentTooth);

    tooth.setValue(draft => ({ ...draft, number }));
    handleChangeToothValue(currentTooth);
  };

  // TEST:
  // useEffect(() => {
  //   console.log(indicationFormat, 'indicationFormat');
  // }, [indicationFormat]);
  // useEffect(() => {
  //   console.log(toothShade.value, 'toothShade.value');
  // }, [toothShade.value]);

  const uploadEmptyFile = useCallback(submitData => {
    AppActions.add_popup({
      isOpen: true,
      type: 'confirm',
      title: <T>GLOBAL_ALERT</T>,
      content: <T>ALARM_NOT_EXIST_UPLOAD_FILE</T>,
      isCloseIcon: true,
      onClick() {
        handleAgreement(submitData);
        // ProjectActions.edit_project_request(submitData);
      },
    });
  }, []);

  const handleAgreement = submitData => {
    AppActions.add_popup({
      isOpen: true,
      timeout: 0,
      isCloseIcon: true,
      title: 'Agreement',
      content: (
        <div style={{ textAlign: 'center' }}>
          <CustomText fontSize={21}>Agreement of Participation</CustomText>
          <CustomText fontSize={15} marginTop={20}>
            I confirmed that the project does not contain any personal information specified in the
            terms and conditions.
          </CustomText>
          <CustomText fontSize={13} fontColor={color.blue} marginTop={10}>
            <span style={{ textDecoration: 'underline' }}>
              <a
                href={window.location.protocol + '//' + window.location.host + '/legal/privacy'}
                target="_blank"
              >
                Privacy Policy
              </a>
            </span>{' '}
            |{' '}
            <span style={{ textDecoration: 'underline' }}>
              <a
                href={window.location.protocol + '//' + window.location.host + '/legal/terms'}
                target="_blank"
              >
                Terms of Service
              </a>
            </span>
          </CustomText>
        </div>
      ),
      onClick: () => {
        // request api
        ProjectActions.edit_project_request(submitData);
      },
    });
  };

  const handleCreateProject = () => {
    setIsSubmit(true);
    // validation check
    // isValidSubmitValue : projectTitle, patient, preferedProgram
    const isValidSubmitValue = [
      !!projectTitle.value,
      // !!patient.value,
      !!dueDate.value,
      // !!preferedProgram.value?.length,
      !!preferedProgram.value,
    ];
    const isFailureSubmit = isValidSubmitValue.some(item => !item);
    // console.log('isValidSubmitValue', isValidSubmitValue);
    // console.log('isFailureSubmit', isFailureSubmit);
    if (isFailureSubmit) return;

    // request api
    let submitData = {
      caseId, // date + company + initCode + initNumber or date + patient + initNumber
      projectTitle: projectTitle.value,
      // patient: patient.value,
      // patientCode,
      // patientShareCheck: checkSharePatient.value,
      dueDate: dueDate.value ? dueDate.value.unix() : null,
      stage: 0,
      senderMemo: senderMemo.value,
      manager: manager.value,
      preferedProgramIdx: [preferedProgram.value],
      // preferedLanguage: language.value,
      situScan: checkSituScan.value,
      separateGingivaScan: checkGingivaScan.value,
      indication: {
        teeth: teeth.value,
        bridge: bridge.value,
        toothShade: toothShade.value,
        notation: numbering.value,
        restorationPonticDesign: restorationPontic.value,
        ceramicMetalDesign: ceramicMetal.value,
        occlusalSurfaceDesign: occlusalSurface.value,
      },
    };

    if (!!projectCodeParam) {
      submitData = {
        ...submitData,
        teethTreatmentIdx,
        projectCode,
      };
    }

    console.log(submitData, 'submitData');
    if (localFileListCt.value.length <= 0) {
      // check empty -> agreement
      uploadEmptyFile(submitData);
    } else {
      handleAgreement(submitData);
    }
    // if (localFileListCt.value.length <= 0) {
    //   return uploadEmptyFile(submitData);
    // }
    // ProjectActions.edit_project_request(submitData);
  };

  useDidUpdateEffect(() => {
    // TODO: detail 이동
    if (editProjectSuccess) {
      console.log('editProjectSuccess');
      const projectCodeValue = editProjectData?.projectCode;
      // New 일 경우 필요
      if (!projectCodeParam) projectCodeCt.setValue(projectCodeValue);
      // Create 클릭시 localFile확인 후 upload여부 실행
      if (localFileListCt.value?.length > 0) {
        console.log('call onUploadLocalFile');
        // 파일이 있을 경우 중복 확인 후 이동, PorjectContext에서 history.push
        onCheckExistingUploadUserFile(() => onUploadLocalFile(projectCodeValue));
      } else {
        // 파일이 없을 경우 바로 이동
        console.log('not upload only page move');
        history.push(`/project/detail/${projectCodeValue}`);
      }
    }
  }, [editProjectSuccess === true]);
  // }, [fetchProjectSuccess === true, editProjectSuccess === true]);

  useDidUpdateEffect(() => {
    if (editProjectFailure) {
      if (editProjectError.message === 'NOT_ENOUGH_POINT') {
        AppActions.add_popup({
          isOpen: true,
          timeout: 0,
          title: <T>GLOBAL_ALERT</T>,
          content: <T>MODAL_NOT_ENOUGH_POINT</T>,
          isCloseIcon: true,
          onClick: () => history.push(pageUrl.store.index),
        });
      }
    }
  }, [editProjectFailure]);

  let fetchList = {
    supportCountryListSuccess,
    indicationFormatSuccess,
    indicationInfoSuccess,
    caseInitSuccess,
  };
  if (!!projectCodeParam) {
    fetchList = {
      ...fetchList,
      fetchProjectSuccess,
    };
  }
  const { isFetchSuccess } = useFetchLoading(fetchList);
  if (!isFetchSuccess) return null;
  return (
    <CreateProject
      // currentPage={currentPage}
      // information
      stage={stage}
      timeline={timeline}
      supportCountryList={supportCountryList}
      projectTitle={projectTitle}
      caseId={caseId}
      dueDate={dueDate}
      senderMemo={senderMemo}
      manager={manager}
      preferedProgram={preferedProgram}
      language={language}
      isSubmit={isSubmit}
      indicationFormat={indicationFormat}
      indicationInfo={indicationInfo}
      toothShade={toothShade}
      numbering={numbering}
      tooth={tooth}
      teeth={teeth}
      bridge={bridge}
      teethContextActions={teethContextActions}
      copyData={copyData}
      indicationSeq={indicationSeq}
      indication={indication}
      material={material}
      implant={implant}
      checkSituScan={checkSituScan}
      checkGingivaScan={checkGingivaScan}
      gapWithCement={gapWithCement}
      minimalTickness={minimalTickness}
      millingToolDiameter={millingToolDiameter}
      isValidRequiredValue={isValidRequiredValue}
      restorationPontic={restorationPontic}
      occlusalSurface={occlusalSurface}
      ceramicMetal={ceramicMetal}
      totalPrice={totalPrice}
      onCreateProject={handleCreateProject}
      onClickTooth={handleClickTooth}
      onToggleTooth={handleToggleTooth}
      onChangeToothValue={handleChangeToothValue}
    />
  );
}
