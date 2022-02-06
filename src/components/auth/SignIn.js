import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import MuiWrapper from 'components/common/input/MuiWrapper';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import VisibleEyes from 'components/common/icon/VisibleEyes';
import cx from 'classnames';
import { color } from 'styles/utils';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiButton from 'components/common/button/MuiButton';
import { brand, pageUrl } from 'lib/mapper';
import { ENV_MODE_DEV } from 'lib/setting';

export default function SignIn({
  email,
  password,
  autoLogin,
  resentLoginList,
  onChangeLanguage,
  onSubmit,
}) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { t } = useTranslation();

  // NOTE: 개발용 아이디 비밀번호
  const devInsertAccount = value => {
    if (value === 'sender') {
      email.setValue('sender@doflab.com');
      password.setValue('dof0070!');
    }
    if (value === 'receiver') {
      email.setValue('receiver@doflab.com');
      password.setValue('dof0070!');
    }
  };

  return (
    <Styled.SignIn data-component-name="SignIn">
      <h1 className="signin__title">
        <T>GLOBAL_LOGIN</T>
      </h1>

      {ENV_MODE_DEV && (
        <div className="dev__insert">
          <MuiButton
            variant="outlined"
            disableElevation
            config={{ color: '#ddd', fontColor: '#777' }}
            onClick={() => devInsertAccount('sender')}
          >
            Sender Login
          </MuiButton>
          <MuiButton
            variant="outlined"
            disableElevation
            config={{ color: '#ddd', fontColor: '#777' }}
            onClick={() => devInsertAccount('receiver')}
          >
            Receiver Login
          </MuiButton>

          <MuiButton
            variant="outlined"
            disableElevation
            config={{ color: '#ddd', fontColor: '#777' }}
            onClick={onChangeLanguage}
          >
            Language
          </MuiButton>
        </div>
      )}

      <Grid container className="signin__form_container">
        <Grid item xs={12} className="input__label_box">
          <label htmlFor="email" className="input__label">
            <T>GLOBAL_EMAIL</T>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            id="emailAuto"
            value={email.value}
            onChange={(e, newVal) => email.setValue(newVal)}
            options={resentLoginList?.length > 0 ? resentLoginList.map(option => option) : []}
            renderInput={params => (
              <MuiWrapper>
                <TextField
                  {...params}
                  id="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  onChange={email.onChange}
                />
              </MuiWrapper>
            )}
          />
        </Grid>

        <Grid item xs={12} className="input__label_box">
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
              inputProps={{
                maxLength: 20,
              }}
              value={password.value}
              onChange={password.onChange}
              onKeyUp={e => e.key === 'Enter' && onSubmit()}
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
        </Grid>

        <Grid container alignItems="center" className="grid__container auto__box">
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <MuiWrapper>
                  <Checkbox
                    checked={autoLogin.value}
                    color="primary"
                    size="small"
                    onChange={e => autoLogin.setValue(e.target.checked)}
                    className="auto__check"
                  />
                </MuiWrapper>
              }
              label={
                <span className="autologin__btn">
                  <T>SIGNIN_AUTO_LOGIN</T>
                </span>
              }
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Link to={pageUrl.auth.resetPassword} className="password__btn">
              <T>SIGNIN_FORGET_PASSWORD</T>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <div className="submit__box">
        <MuiButton
          variant="contained"
          color="primary"
          disableElevation
          className="submit__btn"
          onClick={onSubmit}
        >
          <T>GLOBAL_LOGIN</T>
        </MuiButton>
      </div>
      <div className="link__box">
        <Link to={pageUrl.auth.signUp} className="link__btn">
          {t('SIGNUP_TEXT', { brandLogoText: brand.logo.text })}
        </Link>
      </div>
    </Styled.SignIn>
  );
}

const Styled = {
  SignIn: styled.div`
    .dev__insert {
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translate(-50%, 0%);
      width: 400px;
      & > *:not(:first-child) {
        margin-left: 10px;
      }
    }
    .signin__title {
      margin-bottom: 60px;
      font-size: 40px;
      color: #333;
      text-align: center;
      font-weight: 700;
      text-transform: uppercase;
    }
    .signin__form_container {
      width: 400px;
      margin: 0 auto;
      & > .input__label_box:not(:first-child) {
        margin-top: 15px;
      }
    }
    .input__label {
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
    .auto__check {
      margin-left: 7px;
      margin-right: -5px;
    }
    .autologin__btn,
    .password__btn {
      font-size: 14px;
    }
    .submit__box {
      margin-bottom: 12px;
      margin-top: 55px;
      text-align: center;
      .submit__btn {
        width: 300px;
        font-size: 16px;
        font-weight: 700;
        text-transform: initial;
      }
    }
    .link__box {
      display: block;
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
  `,
};
