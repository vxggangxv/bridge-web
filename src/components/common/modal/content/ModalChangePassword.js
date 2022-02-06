import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { AUTH_PASSWORD_CHANGE_SAGAS } from 'store/actions';
import { color, font, buttonBlue, beforeDash } from 'styles/utils';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibleEyes from 'components/common/icon/VisibleEyes';
import { regPassword } from 'lib/library';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomFormHelperText from 'components/common/text/CustomFormHelperText';
import useInput from 'lib/hooks/useInput';
import MuiButton from 'components/common/button/MuiButton';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { AppActions, AuthActions } from 'store/actionCreators';

export default function ModalChangePassword({ onClose }) {
  const { userEmail, changePasswordSuccess, changePasswordFailure } = useShallowSelector(state => ({
    userEmail: state.user.user?.email,
    changePasswordSuccess: state.auth.changePassword.success,
    changePasswordFailure: state.auth.changePassword.failure,
  }));
  const password = useInput('');
  const newPassword = useInput('');
  const confirmPassword = useInput('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = () => {
    setIsSubmit(true);

    const isValidPasswordValue = !!newPassword.value;
    const isValidNewPasswordValue = regPassword(newPassword.value);
    const isCheckPasswordValue = newPassword.value === confirmPassword.value;

    const isValidSubmitValue = [
      !isValidPasswordValue,
      !isValidNewPasswordValue,
      !isCheckPasswordValue,
    ];

    const isFailureSubmit = isValidSubmitValue.some(item => item === true);
    if (isFailureSubmit) return false;

    const submitData = {
      oldPass: password.value,
      newPass: newPassword.value,
      email: userEmail,
    };

    console.log(submitData, 'submitData');
    AuthActions.change_password_request(submitData);
  };

  useDidUpdateEffect(() => {
    if (changePasswordSuccess) {
      AppActions.add_popup({
        isOpen: true,
        title: <T>GLOBAL_ALERT</T>,
        content: <T>GLOBAL_COMPLETED</T>,
        isTitleDefault: true,
        isContentDefault: true,
        onExited() {
          onClose();
        },
      });
    }

    if (changePasswordFailure) {
      AppActions.add_popup({
        isOpen: true,
        title: <T>GLOBAL_ALERT</T>,
        content: <T>REGISTER_COFIRM_PASSWORD</T>,
        isTitleDefault: true,
        isContentDefault: true,
      });
    }
  }, [changePasswordSuccess === true, changePasswordFailure === true]);

  return (
    <>
      <Styled.ChangePassword>
        <h2 className="modal__title">
          <T>USER_INFO_PASSWORD_RESET</T>
        </h2>

        <Grid container className="input__container">
          <Grid item xs={12}>
            <label htmlFor="password" className="input__label">
              <span>
                <T>GLOBAL_PASSWORD_OLD</T>
              </span>
            </label>
          </Grid>
          <Grid item xs={12}>
            <MuiWrapper className="input__box">
              <TextField
                id="password"
                name="password"
                variant="outlined"
                fullWidth
                autoComplete="off"
                inputProps={{
                  maxLength: 20,
                }}
                error={isSubmit ? !password.value : false}
                value={password.value}
                onChange={password.onChange}
                type={isShowPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        className={cx({ active: isShowPassword })}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      >
                        <VisibleEyes show={isShowPassword} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MuiWrapper>

            <CustomFormHelperText
              className={cx(`error`, {
                active: isSubmit ? !password.value : false,
              })}
            >
              <T>REGISTER_REQUIRED</T>
            </CustomFormHelperText>
          </Grid>

          <Grid item xs={12}>
            <label htmlFor="changePassword" className="input__label">
              <span>
                <T>GLOBAL_PASSWORD_NEW</T>
              </span>
            </label>
          </Grid>
          <Grid item xs={12}>
            <MuiWrapper>
              <TextField
                id="newPassword"
                name="newPassword"
                variant="outlined"
                fullWidth
                autoComplete="off"
                inputProps={{
                  maxLength: 20,
                }}
                error={isSubmit ? !regPassword(newPassword.value) : false}
                value={newPassword.value}
                onChange={newPassword.onChange}
                type={isShowNewPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        className={cx({ active: isShowNewPassword })}
                        onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                      >
                        <VisibleEyes show={isShowNewPassword} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MuiWrapper>

            <CustomFormHelperText
              className={cx(`error`, {
                active: isSubmit ? !regPassword(newPassword.value) : false,
              })}
            >
              <T>REGISTER_PASSWORD</T>
            </CustomFormHelperText>
          </Grid>

          <Grid item xs={12}>
            <label htmlFor="confirmPassword" className="input__label">
              <span>
                <T>GLOBAL_CONFIRM_PASSWORD</T>
              </span>
            </label>
          </Grid>
          <Grid item xs={12}>
            <MuiWrapper>
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                variant="outlined"
                fullWidth
                autoComplete="off"
                inputProps={{
                  maxLength: 20,
                }}
                error={isSubmit ? !(newPassword.value === confirmPassword.value) : false}
                value={confirmPassword.value}
                onChange={confirmPassword.onChange}
                type={isShowConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        className={cx({ active: isShowConfirmPassword })}
                        onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                      >
                        <VisibleEyes show={isShowConfirmPassword} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MuiWrapper>

            <CustomFormHelperText
              className={cx(`error`, {
                active: isSubmit ? !(newPassword.value === confirmPassword.value) : false,
              })}
            >
              <T>REGISTER_COFIRM_PASSWORD</T>
            </CustomFormHelperText>
          </Grid>
        </Grid>

        <div className="changePassword__btn_box">
          <MuiButton
            disableElevation
            variant="outlined"
            color="primary"
            className="sm"
            onClick={onClose}
          >
            <T>GLOBAL_CANCEL</T>
          </MuiButton>
          <MuiButton
            disableElevation
            variant="contained"
            color="primary"
            className="sm"
            onClick={handleSubmit}
          >
            <T>GLOBAL_RESET</T>
          </MuiButton>
        </div>
      </Styled.ChangePassword>
    </>
  );
}

const Styled = {
  ChangePassword: styled.div`
    /* padding: 40px 90px 35px; */
    padding: 40px 0 35px;
    .modal__title {
      margin-bottom: 35px;
      ${font(18, '#333')};
      text-align: center;
      font-weight: 700;
      letter-spacing: -0.3px;
      ${beforeDash({})};
      /* .userQna__header_title {
      } */
    }
    .input__placeholder input::placeholder,
    .input__placeholder::placeholder {
      font-size: 14px;
      color: #bbb;
    }
    .input__container {
      padding: 0 90px;
    }
    .input__label {
      position: relative;
      display: block;
      ${font(14, color.gray_font)};
      line-height: 1.5;
      .input__label_icon.necessary {
        font-family: sans-serif;
        font-weight: 700;
        color: ${color.red};
      }
    }
    .input__box {
      position: relative;
      .input__icon_success {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 15px;
        transform: rotate(-45deg);
        margin-top: -6px;
        display: block;
        width: 13px;
        height: 8px;
        border: 2px solid transparent;
        border-left-color: ${color.blue};
        border-bottom-color: ${color.blue};
      }
    }
    .changePassword__btn_box {
      margin-top: 20px;
      text-align: center;
      .button {
        min-width: 150px;
        &:not(:first-child) {
          margin-left: 5px;
        }
      }
    }
    .changePassword__btn {
      ${buttonBlue};
      padding: 0;
      font-size: 16px;
      width: 100px;
      height: 30px;
      border-radius: 5px;
      /* font-weight: 700; */
      &:not(:first-child) {
        margin-left: 5px;
      }
      &.cancel {
        background-color: #fff;
        border: 1px solid ${color.blue};
        color: ${color.blue};
      }
    }
  `,
};
