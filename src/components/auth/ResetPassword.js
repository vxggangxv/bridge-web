import { regEmail, regPassword } from 'lib/library';
import React, { useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { color, font } from 'styles/utils';
import { useTranslation } from 'react-i18next';
import { pageUrl } from 'lib/mapper';
import VisibleEyes from 'components/common/icon/VisibleEyes';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { Link } from 'react-router-dom';
import { Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { useDidUpdateEffect } from 'lib/utils';
import CustomFormHelperText from 'components/common/text/CustomFormHelperText';

export default function ResetPassword({
  email,
  code,
  password,
  confirmPassword,
  timer,
  isShowTimer,
  isSendEmail,
  checkEmailStatus,
  checkCodeStatus,
  isSubmit,
  onCheckEmail,
  onCheckCode,
  onSubmit,
}) {
  const { t } = useTranslation();
  const isSubmitEmail = isSubmit || isSendEmail;
  const isErrorEmail = checkEmailStatus === false || (isSubmitEmail && !regEmail(email.value));
  // 패스워드 보여주기 여부
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  return (
    <Styled.ResetPassword data-component-name="SignUp">
      <h1 className="page__title">
        <T>USER_INFO_PASSWORD_RESET</T>
      </h1>

      <Grid container className="page__form_container">
        <Grid item xs={12}>
          <label htmlFor="email" className="input__label">
            <T>GLOBAL_EMAIL</T>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <MuiWrapper
                childrenContent={checkEmailStatus && <span className="input__icon_success"></span>}
              >
                <TextField
                  id="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  error={isErrorEmail}
                  value={email.value || ''}
                  onChange={email.onChange}
                  onKeyUp={e => e.key === 'Enter' && onCheckEmail()}
                />
              </MuiWrapper>
            </Grid>
            <Grid item xs={3}>
              <MuiButton
                disableElevation
                variant="contained"
                color="primary"
                fullWidth
                onClick={onCheckEmail}
              >
                <T>GLOBAL_SEND_CODE</T>
              </MuiButton>
            </Grid>
          </Grid>

          <CustomFormHelperText
            className={cx(`error`, {
              active: isErrorEmail,
            })}
          >
            <T>REGISTER_EMAIL</T>
          </CustomFormHelperText>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="verifiedCode" className="input__label">
            <T>GLOBAL_CODE</T>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <MuiWrapper
                childrenContent={
                  <>
                    {isShowTimer && <span className="verify__input_timer">{timer}</span>}
                    {checkCodeStatus && <span className="input__icon_success"></span>}
                  </>
                }
              >
                <TextField
                  disabled={!checkEmailStatus}
                  id="verifiedCode"
                  name="verifiedCode"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  error={checkCodeStatus === false}
                  value={code.value || ''}
                  onChange={code.onChange}
                  onKeyUp={e => e.key === 'Enter' && onCheckCode()}
                />
              </MuiWrapper>
            </Grid>
            <Grid item xs={3}>
              <MuiButton
                disabled={!code.value}
                disableElevation
                variant="contained"
                color="primary"
                fullWidth
                onClick={onCheckCode}
              >
                <T>GLOBAL_VERIFY</T>
              </MuiButton>
            </Grid>
          </Grid>

          <CustomFormHelperText
            className={cx(`error`, {
              active: checkCodeStatus === false,
            })}
          >
            <T>REGISTER_CODE</T>
          </CustomFormHelperText>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="password" className="input__label">
            <T>GLOBAL_PASSWORD</T>
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
              placeholder={t('PLACEHOLDER_PASSWORD')}
              inputProps={{
                maxLength: 20,
              }}
              error={isSubmit ? !regPassword(password.value) : false}
              value={password.value || ''}
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
              active: isSubmit ? !regPassword(password.value) : false,
            })}
          >
            <T>REGISTER_REQUIRED</T>
          </CustomFormHelperText>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="confirmPassword" className="input__label">
            <T>GLOBAL_CONFIRM_PASSWORD</T>
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
              error={isSubmit ? !(password.value === confirmPassword.value) : false}
              value={confirmPassword.value || ''}
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
              active: isSubmit ? !(password.value === confirmPassword.value) : false,
            })}
          >
            <T>REGISTER_COFIRM_PASSWORD</T>
          </CustomFormHelperText>
        </Grid>

        {/* 
        <Grid item xs={12}>
          <label htmlFor="phone" className="input__label">
            <T>global.label.phone</T>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </Grid> 
        */}
        {/* end form */}
      </Grid>

      <div className="submit__box">
        <MuiButton
          disableElevation
          variant="contained"
          color="primary"
          className="submit__btn"
          onClick={onSubmit}
        >
          <T>GLOBAL_PASSWORD_RESET</T>
        </MuiButton>
      </div>

      <div className="link__find_box">
        <Link to={pageUrl.auth.findId} className="link__find">
          <T>SIGNIN_FORGET_EMAIL</T>
        </Link>
      </div>
      <div className="link__box">
        <Link to={pageUrl.auth.signIn}>
          <T>GLOBAL_BACK_TO_LOGIN</T>
        </Link>
      </div>
    </Styled.ResetPassword>
  );
}

const Styled = {
  ResetPassword: styled.div`
    /* position: fixed; */
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .page__title {
      margin: 100px 0 75px;
      font-size: 30px;
      color: #333;
      text-align: center;
      font-weight: 700;
    }
    .page__form_container {
      width: 500px;
      margin: 0 auto;
    }
    .input__label {
      display: inline-block;
      margin-top: 5px;
      line-height: 1.5;
      font-size: 14px;
      color: ${color.gray_font};
      /* text-transform: uppercase; */
      .input__label_icon.necessary {
        font-family: sans-serif;
        font-weight: 700;
        color: ${color.red};
      }
    }

    .verify__input_timer {
      position: absolute;
      top: 50%;
      right: 15px;
      color: #777777;
      transform: translate(0, -50%);
      color: ${color.gray_font};
    }
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
    .submit__box {
      margin-bottom: 12px;
      margin-top: 80px;
      text-align: center;
      .submit__btn {
        width: 300px;
        font-size: 16px;
        font-weight: 700;
        text-transform: initial;
      }
    }
    .page__aleady {
      margin-top: 20px;
      font-size: 18px;
      color: ${color.black_font};
      text-align: center;
    }
    .link__box {
      display: block;
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .link__find {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
    }
  `,
};
