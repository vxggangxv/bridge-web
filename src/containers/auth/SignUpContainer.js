import useInput from 'lib/hooks/useInput';
import { regEmail, regPassword, regNumber, setFormData, timer as Timer } from 'lib/library';
import React, { useEffect, useState } from 'react';
import useDateInput from 'lib/hooks/useDateInput';
import useCheckInput from 'lib/hooks/useCheckInput';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { AppActions, UtilActions, AuthActions } from 'store/actionCreators';
import useFileInput from 'lib/hooks/useFileInput';
import SignUp from 'components/auth/SignUp';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import { pageUrl, requiredCountryListForLab } from 'lib/mapper';
import { useHistory } from 'react-router-dom';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';

export default function SignUpContainer(props) {
  const history = useHistory();
  const {
    supportCountryList,
    countryList,
    regionList,
    checkEmailSuccess,
    checkEmailFailure,
    checkCodeSuccess,
    checkCodeFailure,
    signUpSuccess,
    signUpFailure,
    signUpResult,
    signUpEmailResult,
  } = useShallowSelector(state => ({
    supportCountryList: state.util.supportCountries.data?.languageList,
    countryList: state.util.countries.data?.countryList,
    regionList: state.util.regions.data?.regionList,
    checkEmailSuccess: state.auth.checkEmail.success,
    checkEmailFailure: state.auth.checkEmail.failure,
    checkCodeSuccess: state.auth.checkCode.success,
    checkCodeFailure: state.auth.checkCode.failure,
    signUpSuccess: state.auth.signUp.success,
    signUpFailure: state.auth.signUp.failure,
    signUpResult: state.auth.signUp.data?.result,
    signUpEmailResult: state.auth.signUp.data?.emailResult,
  }));
  const visibility = useInput(0);
  const type = useCheckInput({
    clinic: true,
    lab: false,
    milling: false,
    designer: false,
  });
  const email = useInput('');
  const code = useInput('');
  const password = useInput('');
  const confirmPassword = useInput('');
  const language = useInput([]);
  const country = useInput('');
  const region = useInput('');
  const company = useInput('');
  const manager = useInput('');
  // const phoneCodeList = countryList?.reduce(
  //   (arr, curr) =>
  //     arr.concat({
  //       id: curr.id,
  //       name: curr.name,
  //       code: curr.phonecode,
  //     }),
  //   [],
  // );
  const phone = useInput('');
  // onChange - setValue 에 사용
  const phoneCode = useInput('');
  const businessFile = useFileInput({
    file: null,
    name: '',
  });
  const licenseFile = useFileInput({
    file: null,
    name: '',
  });
  const licenseDate = useDateInput(null);
  const { t } = useTranslation();

  // 사용X valid, saga failure에 따른 에러 설정(e.g. modal)
  // const [isErrorEmail, setIsErrorEmail] = useState(false);
  // const [emailErrorMessage, setEmailErrorMessage] = useState('');
  // onSendEmailVerification 이후 timer 설정
  const [timer, setTimer] = useState('');
  const [isShowTimer, setIsShowTimer] = useState(false);
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [sendEmail, setSendEmail] = useState(null);
  // init: null, success: true, failure: false
  const [checkEmailStatus, setCheckEmailStatus] = useState(null);
  const [checkCodeStatus, setCheckCodeStatus] = useState(null);
  const checkDesignerService = useCheckOneInput(false);
  const [isSubmit, setIsSubmit] = useState(false);

  // init
  useEffect(() => {
    UtilActions.fetch_support_countries_request();
    UtilActions.fetch_countries_request();
    return () => {
      endTimer();
    };
  }, []);

  // init - countryList 받은 후 country.value 설정
  useDidUpdateEffect(() => {
    if (countryList) country.setValue(countryList[0].id);
  }, [countryList]);

  // onChange - country.value에 따른 regionList, phoneCode 변경
  useDidUpdateEffect(() => {
    UtilActions.fetch_regions_request({ country: country.value });
    if (countryList) {
      const countryPhoneCode =
        countryList?.find(item => item.id === country.value)?.phonecode || '';
      phoneCode.setValue(countryPhoneCode);
    }
  }, [country.value]);

  // onChange - type.value?.desinger === true
  useDidUpdateEffect(() => {
    checkDesignerService.setValue(!!type.value?.designer);
  }, [type.value?.designer]);

  const timerStartData = {
    time: '05:00',
    interval: 1000,
    format: 'mm:ss',
    callback(val) {
      setTimer(val);
      // setValues(draft => {
      //   draft.timer.value = val;
      // });
    },
  };
  const timerEndData = {
    end(val) {
      clearInterval(val);
    },
  };

  const startTimer = () => {
    setIsShowTimer(true);
    Timer(timerStartData);
  };

  const endTimer = () => {
    setIsShowTimer(false);
    Timer(timerEndData);
  };

  const handleCheckEmail = () => {
    setCheckEmailStatus(null);
    setIsSendEmail(true);
    endTimer();
    // TEST: success test
    // startTimer();
    // setIsSuccessEmailSend(true);

    const isValidEmailValue = regEmail(email.value);

    if (!isValidEmailValue) return AuthActions.check_email_failure();

    if (isValidEmailValue) {
      // request api
      setSendEmail(email.value);
      AuthActions.check_email_request({ email: email.value });
      // setIsSuccessEmailSend(true);
    }
  };

  const handleCheckCode = () => {
    setCheckCodeStatus(null);
    // request api
    AuthActions.check_code_request({ email: email.value, random: code.value });
  };

  const handleSubmit = () => {
    // presenter component에서 submit 이후 required값 체크되도록
    setIsSubmit(true);

    // 필수 입력 및 정규식 유효성 확인
    const hasTypeValue = [
      type.value.clinic,
      type.value.lab,
      type.value.milling,
      type.value.designer,
    ].some(item => item === true);

    const isMatchEmailValue = sendEmail !== null ? email.value === sendEmail : true;
    const isSuccessEmailValue = checkEmailStatus;
    const isSuccessCodeValue = checkCodeStatus;
    const isValidPasswordValue = regPassword(password.value);
    const isCheckPasswordValue = password.value === confirmPassword.value;
    const hasLanguageValue = !!language.value?.length;
    const hasRegionValue = !!region.value;
    const hasCompanyValue = !!company.value?.trim();
    // const hasManagerValue = !!manager.value?.trim();
    const isValidPhoneValue = regNumber(phone.value);
    // const hasBusinessFileValue = !!businessFile.value.name;
    const hasLicenseFileValue = !!licenseFile.value.name;
    const hasLicenseDateValue = !!licenseDate.value;

    // 유효성 검사
    let isValidSubmitValue = [
      !isMatchEmailValue,
      !hasTypeValue,
      !isSuccessEmailValue,
      !isSuccessCodeValue,
      !isValidPasswordValue,
      !isCheckPasswordValue,
      !hasLanguageValue,
      !hasRegionValue,
      !hasCompanyValue,
      // !hasManagerValue,
      !isValidPhoneValue,
    ];

    // sendEmail, input email check
    if (!isMatchEmailValue) AppActions.show_toast({ type: 'error', message: 'Please Check Email' });

    if (!isSuccessEmailValue) AuthActions.check_email_failure();

    if (isSuccessEmailValue && !isSuccessCodeValue) AuthActions.check_code_failure();

    // 기공사일 경우
    if (type.value.lab && requiredCountryListForLab.indexOf(country.value) !== -1) {
      isValidSubmitValue = [...isValidSubmitValue, !hasLicenseFileValue, !hasLicenseDateValue];

      if (!hasLicenseFileValue) {
        console.log('licenseFile error');
      }

      if (!hasLicenseDateValue) {
        console.log('licenseDate error');
      }
    }

    // DEBUG: api apply
    console.log(isValidSubmitValue, 'isValidSubmitValue');
    const isFailureSubmit = isValidSubmitValue.some(item => item === true);
    console.log(isFailureSubmit);
    if (isFailureSubmit) return false;

    let submitData = {
      visibility: visibility.value,
      type_clinic: type.value.clinic ? 1 : 0,
      type_lab: type.value.lab ? 1 : 0,
      type_milling: type.value.milling ? 1 : 0,
      type_designer: type.value.designer ? 1 : 0,
      email: email.value?.trim(),
      code: code.value?.trim(),
      password: password.value?.trim(),
      confirmPassword: confirmPassword.value?.trim(),
      languageGroup: language.value.join('%'),
      // country: country.value,
      // region: region.value,
      states_id: region.value,
      company_name: company.value,
      // manager: manager.value,
      phone: phone.value?.trim(),
      // phonecode: phoneCodeList?.find(item => item.code === phoneCode.value)?.id,
      phonecode: countryList?.find(item => item.phonecode === phoneCode.value)?.id,
      businessImg: businessFile.value.file,
      licenseImg: licenseFile.value.file,
      licenseDate: licenseDate.value?.format('YYYY-MM-DD'),
    };

    console.log(submitData, 'submitData');
    // console.log(setFormData(submitData), 'setFormData(submitData)');
    AuthActions.sign_up_request(setFormData(submitData));
  };

  // saga api response check
  useDidUpdateEffect(() => {
    if (checkEmailSuccess) {
      setCheckEmailStatus(true);
      startTimer();
      AppActions.add_popup({
        isOpen: true,
        title: <T>MODAL_SUCCESS_SENDCODE_TITLE</T>,
        content: <T>MODAL_SUCCESS_SENDCODE_CONTENT</T>,
        isTitleDefault: true,
        isContentDefault: true,
      });
    }

    if (checkEmailFailure) setCheckEmailStatus(false);

    if (checkCodeSuccess) {
      setCheckCodeStatus(true);
      endTimer();
      AppActions.add_popup({
        isOpen: true,
        title: <T>GLOBAL_SUCCESS</T>,
        content: <T>MODAL_SUCCESS_VERIFYCODE</T>,
        isTitleDefault: true,
        isContentDefault: true,
      });
    }

    if (checkCodeFailure) setCheckCodeStatus(false);

    if (signUpSuccess) {
      AppActions.add_popup({
        isOpen: true,
        title: <T>GLOBAL_SUCCESS</T>,
        content: <T>MODAL_SUCCESS_SIGNEUP</T>,
        isTitleDefault: true,
        isContentDefault: true,
        onExited() {
          history.push(pageUrl.auth.signIn);
        },
      });
    }

    // 사용X
    // if (signUpFailure) {
    //   // result, emailResult 오류 핸들링 함수
    //   const resultStatusModal = (resultStatus, emailResultStatus) => {
    //     let resultModalTitle = <T>global.alert</T>;
    //     let resultModalContent = <T>modal.error</T>;
    //     // console.log(resultStatus, 'resultStatus');
    //     // console.log(emailResultStatus, 'emailResultStatus');

    //     if (resultStatus === 0) {
    //       if (emailResultStatus === 0) {
    //         resultModalContent = <T>modal.failSignUpEmailReault0</T>;
    //       }
    //       if (emailResultStatus === 2) {
    //         resultModalContent = <T>modal.failSignUpEmailReault2</T>;
    //       }
    //       if (emailResultStatus === 4) {
    //         resultModalContent = <T>modal.failSignUpEmailReault4</T>;
    //       }
    //       if (emailResultStatus === 5) {
    //         resultModalContent = <T>modal.failSignUpEmailReault5</T>;
    //       }
    //       if (emailResultStatus === 6) {
    //         resultModalContent = <T>modal.successSendCodeContent</T>;
    //       }
    //     }

    //     if (resultStatus === 2 || resultStatus === 3) {
    //       resultModalTitle = <T>signin.errorResultTitle</T>;
    //       resultModalContent = <T>signin.errorResultContent</T>;
    //     }

    //     AppActions.add_popup({
    //       isOpen: true,
    //       title: resultModalTitle,
    //       content: resultModalContent,
    //       isTitleDefault: true,
    //       isContentDefault: true,
    //     });
    //   };

    //   resultStatusModal(signUpResult, signUpEmailResult);
    // }
  }, [
    checkEmailSuccess === true,
    checkEmailFailure === true,
    checkCodeSuccess === true,
    checkCodeFailure === true,
    signUpSuccess === true,
    signUpFailure === true,
  ]);

  return (
    <SignUp
      visibility={visibility}
      type={type}
      checkDesignerService={checkDesignerService}
      email={email}
      code={code}
      password={password}
      confirmPassword={confirmPassword}
      supportCountryList={supportCountryList}
      language={language}
      country={country}
      countryList={countryList}
      region={region}
      regionList={regionList}
      company={company}
      manager={manager}
      // phoneCodeList={phoneCodeList}
      phone={phone}
      phoneCode={phoneCode}
      businessFile={businessFile}
      licenseFile={licenseFile}
      licenseDate={licenseDate}
      timer={timer}
      isShowTimer={isShowTimer}
      isSendEmail={isSendEmail}
      checkEmailStatus={checkEmailStatus}
      checkCodeStatus={checkCodeStatus}
      isSubmit={isSubmit}
      onCheckEmail={handleCheckEmail}
      onCheckCode={handleCheckCode}
      onSubmit={handleSubmit}
    />
  );
}
