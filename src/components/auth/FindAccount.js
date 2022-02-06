import { regNumber } from 'lib/library';
import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { color, font } from 'styles/utils';
import { useTranslation } from 'react-i18next';
import { pageUrl } from 'lib/mapper';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { Link } from 'react-router-dom';
import { FormControl, Grid, MenuItem, Select, TextField } from '@material-ui/core';
import CustomFormHelperText from 'components/common/text/CustomFormHelperText';

export default function FindAccount({
  phoneCodeItems,
  phone,
  phoneCode,
  code,
  timer,
  isShowTimer,
  isSendPhone,
  checkPhoneStatus,
  checkCodeStatus,
  isSubmit,
  onCheckPhone,
  onCheckCode,
  onSubmit,
}) {
  const { t } = useTranslation();
  const isSubmitPhone = isSubmit || isSendPhone;
  const isErrorPhone = checkPhoneStatus === false || (isSubmitPhone && !regNumber(phone.value));

  return (
    <Styled.FindAccount data-component-name="SignUp">
      <h1 className="page__title">
        <T>ACCOUNT_INFO</T>
      </h1>

      <Grid container className="page__form_container">
        <Grid item xs={12}>
          <label htmlFor="phone" className="input__label">
            <T>GLOBAL_PHONE</T>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <MuiWrapper>
                <FormControl fullWidth variant="outlined">
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    name="phoneCode"
                    value={phoneCode.value}
                    renderValue={selected => selected}
                    onChange={phoneCode.onChange}
                  >
                    {phoneCodeItems?.length > 0 &&
                      phoneCodeItems.map((item, idx) => {
                        if (!item.code) return null;
                        return (
                          <MenuItem key={idx} value={item.code}>
                            {item.code && `${item.name} | ${item.code}`}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </Grid>
            <Grid item xs={6}>
              <MuiWrapper>
                <TextField
                  id="phone"
                  name="phone"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  placeholder={t('PLACEHOLDER_PHONE')}
                  inputProps={{
                    maxLength: 25,
                  }}
                  error={isErrorPhone}
                  value={phone.value}
                  onChange={phone.onChange}
                  onKeyUp={e => e.key === 'Enter' && onCheckPhone()}
                />
              </MuiWrapper>

              <CustomFormHelperText
                className={cx(`error`, {
                  active: isErrorPhone,
                })}
              >
                <T>REGISTER_NOT_VALID</T>
              </CustomFormHelperText>
            </Grid>
            <Grid item xs={3}>
              <MuiButton
                disableElevation
                variant="contained"
                color="primary"
                fullWidth
                onClick={onCheckPhone}
              >
                <T>GLOBAL_SEND_CODE</T>
              </MuiButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="code" className="input__label">
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
                  disabled={!checkPhoneStatus}
                  id="code"
                  name="code"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  error={checkCodeStatus === false}
                  value={code.value}
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
          <T>FIND_ACCOUNT</T>
        </MuiButton>
      </div>

      <div className="link__box">
        <Link to={pageUrl.auth.signIn}>
          <T>GLOBAL_BACK_TO_LOGIN</T>
        </Link>
      </div>
    </Styled.FindAccount>
  );
}

const Styled = {
  FindAccount: styled.div`
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
    .link_find {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
    }
  `,
};
