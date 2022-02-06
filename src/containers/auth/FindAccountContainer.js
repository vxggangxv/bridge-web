import useInput from 'lib/hooks/useInput';
import { regNumber, timer as Timer } from 'lib/library';
import React, { useEffect, useState } from 'react';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { AppActions, AuthActions, UtilActions } from 'store/actionCreators';
import FindAccount from 'components/auth/FindAccount';
import AccountInfo from 'components/auth/AccountInfo';
import T from 'components/common/text/T';
import { pageUrl } from 'lib/mapper';
import { useHistory } from 'react-router-dom';

function FindAccountContainer(props) {
  const history = useHistory();
  const {
    countryList,
    checkResetEmailSuccess,
    checkResetEmailFailure,
    checkCodeSuccess,
    checkCodeFailure,
  } = useShallowSelector(state => ({
    countryList: state.util.countries.data?.countryList,
    checkResetEmailSuccess: state.auth.checkResetEmail.success,
    checkResetEmailFailure: state.auth.checkResetEmail.failure,
    checkCodeSuccess: state.auth.checkCode.success,
    checkCodeFailure: state.auth.checkCode.failure,
  }));
  const phoneCodeItems = countryList?.reduce(
    (arr, curr) =>
      arr.concat({
        id: curr.id,
        name: curr.name,
        code: curr.phonecode,
      }),
    [],
  );
  const phone = useInput('');
  // onChange - setValue 에 사용
  const phoneCode = useInput('');
  const code = useInput('');

  // 사용X valid, saga failure에 따른 에러 설정(e.g. modal)
  // const [isErrorEmail, setIsErrorEmail] = useState(false);
  // const [emailErrorMessage, setEmailErrorMessage] = useState('');
  // onSendEmailVerification 이후 timer 설정
  const [timer, setTimer] = useState('');
  const [isShowTimer, setIsShowTimer] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSendPhone, setIsSendPhone] = useState(false);
  const [checkPhoneStatus, setCheckPhoneStatus] = useState(null);
  const [checkCodeStatus, setCheckCodeStatus] = useState(null);
  // TODO: api 연동
  const [isSuccess, setIsSuccess] = useState(false);

  // init
  useEffect(() => {
    UtilActions.fetch_countries_request();
    return () => {
      endTimer();
    };
  }, []);

  // init phoneCode
  useDidUpdateEffect(() => {
    const countryPhoneCode = phoneCodeItems[0].code;
    phoneCode.setValue(countryPhoneCode);
  }, [phoneCodeItems?.length > 0]);

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

  const handleCheckPhone = () => {
    setIsSendPhone(true);
    // TODO: api 연동
    // AuthActions.check_reset_email_init();
    AuthActions.check_code_init();
    endTimer();

    const isValidPhoneValue = regNumber(phone.value);

    if (!isValidPhoneValue) return;

    if (isValidPhoneValue) {
      // request api
      // AuthActions.check_reset_email_request({ email: email.value });
    }
  };

  const handleCheckCode = () => {
    // request api
    // AuthActions.check_code_request({ email: email.value, random: code.value });
  };

  const handleSubmit = () => {
    // presenter component에서 submit 이후 required값 체크되도록
    setIsSubmit(true);

    // 유효성 검사
    let isValidSubmitValue = [!checkResetEmailSuccess, !checkCodeSuccess];

    console.log(isValidSubmitValue, 'isValidSubmitValue');
    const isFailureSubmit = isValidSubmitValue.some(item => item === true);

    if (!checkResetEmailSuccess) {
      // setIsErrorCode(true);
      // TODO: check phone failure()
      // init처리 필요
      // AuthActions.check_reset_email_failure();
    }

    if (!checkCodeSuccess) {
      // setIsErrorCode(true);
      // init처리 필요
      AuthActions.check_code_failure();
    }

    // console.log(isFailureSubmit);
    // if (isFailureSubmit) return false;

    let submitData = {
      phone: phone.value?.trim(),
      phoneCode: phoneCodeItems?.find(item => item.code === phoneCode.value)?.id,
    };

    console.log(submitData, 'submitData');
    // AuthActions.reset_password_request(submitData);
  };

  // saga api response check
  useDidUpdateEffect(() => {
    if (checkResetEmailSuccess) {
      startTimer();
      AppActions.add_popup({
        isOpen: true,
        title: <T>MODAL_SUCCESS_SENDCODE_TITLE</T>,
        content: <T>MODAL_SUCCESS_SENDCODE_CONTENT</T>,
        isTitleDefault: true,
        isContentDefault: true,
      });

      return;
    }

    if (checkResetEmailFailure) setCheckPhoneStatus(false);

    if (checkCodeSuccess) {
      endTimer();
      AppActions.add_popup({
        isOpen: true,
        title: <T>GLOBAL_SUCCESS</T>,
        content: <T>MODAL_SUCCESS_VERIFYCODE</T>,
        isTitleDefault: true,
        isContentDefault: true,
      });

      return;
    }

    if (checkCodeFailure) setCheckCodeStatus(false);
  }, [
    checkResetEmailSuccess === true,
    checkResetEmailFailure === true,
    checkCodeSuccess === true,
    checkCodeFailure === true,
  ]);

  return isSuccess ? (
    <AccountInfo />
  ) : (
    <FindAccount
      phoneCodeItems={phoneCodeItems}
      phone={phone}
      phoneCode={phoneCode}
      code={code}
      timer={timer}
      isShowTimer={isShowTimer}
      isSendPhone={isSendPhone}
      checkPhoneStatus={checkPhoneStatus}
      checkCodeStatus={checkCodeStatus}
      isSubmit={isSubmit}
      onCheckPhone={handleCheckPhone}
      onCheckCode={handleCheckCode}
      onSubmit={handleSubmit}
    />
  );
}

export default FindAccountContainer;
