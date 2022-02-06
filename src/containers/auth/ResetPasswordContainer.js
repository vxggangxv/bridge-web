import useInput from 'lib/hooks/useInput';
import { regEmail, regPassword, timer as Timer } from 'lib/library';
import React, { useEffect, useState } from 'react';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { AppActions, AuthActions } from 'store/actionCreators';
import ResetPassword from 'components/auth/ResetPassword';
import T from 'components/common/text/T';
import { pageUrl } from 'lib/mapper';
import { useHistory } from 'react-router-dom';

export default function ResetPasswordContainer(props) {
  const history = useHistory();
  const {
    checkResetEmailSuccess,
    checkResetEmailFailure,
    checkResetCodeSuccess,
    checkResetCodeFailure,
    resetPasswordSuccess,
  } = useShallowSelector(state => ({
    checkResetEmailSuccess: state.auth.checkResetEmail.success,
    checkResetEmailFailure: state.auth.checkResetEmail.failure,
    checkResetCodeSuccess: state.auth.checkResetCode.success,
    checkResetCodeFailure: state.auth.checkResetCode.failure,
    resetPasswordSuccess: state.auth.resetPassword.success,
  }));
  const email = useInput('');
  const code = useInput('');
  const password = useInput('');
  const confirmPassword = useInput('');

  // 사용X valid, saga failure에 따른 에러 설정(e.g. modal)
  // const [isErrorEmail, setIsErrorEmail] = useState(false);
  // const [emailErrorMessage, setEmailErrorMessage] = useState('');
  // onSendEmailVerification 이후 timer 설정
  const [timer, setTimer] = useState('');
  const [isShowTimer, setIsShowTimer] = useState(false);
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [checkEmailStatus, setCheckEmailStatus] = useState(null);
  const [checkCodeStatus, setCheckCodeStatus] = useState(null);

  // init
  useEffect(() => {
    return () => {
      endTimer();
    };
  }, []);

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
    Timer(timerStartData);
    setIsShowTimer(true);
  };

  const endTimer = () => {
    Timer(timerEndData);
    setIsShowTimer(false);
  };

  const handleCheckEmail = () => {
    setCheckEmailStatus(null);
    setIsSendEmail(true);
    endTimer();

    const isValidEmailValue = regEmail(email.value);

    if (!isValidEmailValue) return AuthActions.check_reset_email_failure();

    if (isValidEmailValue) {
      // request api
      setSendEmail(email.value);
      AuthActions.check_reset_email_request({ email: email.value });
      // setIsSuccessEmailSend(true);
    }
  };

  const handleCheckCode = () => {
    setCheckCodeStatus(null);
    // request api
    AuthActions.check_reset_code_request({ email: email.value, random: code.value });
  };

  const handleSubmit = () => {
    // presenter component에서 submit 이후 required값 체크되도록
    setIsSubmit(true);

    const isMatchEmailValue = email.value === sendEmail;
    const isSuccessEmailValue = checkEmailStatus;
    const isSuccessCodeValue = checkCodeStatus;
    const isValidPasswordValue = regPassword(password.value);
    const isCheckPasswordValue = password.value === confirmPassword.value;

    // 유효성 검사
    let isValidSubmitValue = [
      !isMatchEmailValue,
      !isSuccessEmailValue,
      !isSuccessCodeValue,
      !isValidPasswordValue,
      !isCheckPasswordValue,
    ];

    // sendEmail, input email check
    if (!isMatchEmailValue) AppActions.show_toast({ type: 'error', message: 'Please Check Email' });

    if (!isSuccessEmailValue) AuthActions.check_reset_email_failure();

    if (isSuccessEmailValue && !isSuccessCodeValue) AuthActions.check_code_failure();

    // DEBUG: api apply
    console.log(isValidSubmitValue, 'isValidSubmitValue');
    const isFailureSubmit = isValidSubmitValue.some(item => item === true);
    // console.log(isFailureSubmit);
    if (isFailureSubmit) return false;

    let submitData = {
      email: email.value?.trim(),
      newPass: password.value?.trim(),
    };

    console.log(submitData, 'submitData');
    AuthActions.reset_password_request(submitData);
  };

  // saga api response check
  useDidUpdateEffect(() => {
    if (checkResetEmailSuccess) {
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

    if (checkResetEmailFailure) setCheckEmailStatus(false);

    if (checkResetCodeSuccess) {
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

    if (checkResetCodeFailure) setCheckCodeStatus(false);

    if (resetPasswordSuccess) {
      AppActions.add_popup({
        isOpen: true,
        title: <T>GLOBAL_SUCCESS</T>,
        content: <T>MODAL_COMPLETE</T>,
        isTitleDefault: true,
        isContentDefault: true,
        onExited() {
          history.push(pageUrl.auth.signIn);
        },
      });
    }
  }, [
    checkResetEmailSuccess === true,
    checkResetEmailFailure === true,
    checkResetCodeSuccess === true,
    checkResetCodeFailure === true,
    resetPasswordSuccess === true,
  ]);

  return (
    <ResetPassword
      email={email}
      code={code}
      password={password}
      confirmPassword={confirmPassword}
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
