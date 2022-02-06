import { regEmail, regNumber, regPassword } from 'lib/library';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { buttonBlue, color, flexAlignItemsCenter, theme } from 'styles/utils';
import { useTranslation } from 'react-i18next';
import { visibilityType, companyType, pageUrl, requiredCountryListForLab, brand } from 'lib/mapper';
import VisibleEyes from 'components/common/icon/VisibleEyes';
import MuiWrapper from 'components/common/input/MuiWrapper';
import TermsOfUseInfo from 'components/base/terms/TermsOfUseInfo';
import { _color } from 'styles/_variables';
import { Link } from 'react-router-dom';
import {
  ButtonBase,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {
  picto_type_clinic,
  picto_type_lab,
  picto_type_milling,
  picto_type_designer,
} from 'components/base/images';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import CustomFormHelperText from 'components/common/text/CustomFormHelperText';
import CustomSpan from 'components/common/text/CustomSpan';

export default function SignUp({
  visibility,
  type,
  checkDesignerService,
  email,
  code,
  password,
  confirmPassword,
  supportCountryList,
  language,
  country,
  countryList,
  region,
  regionList,
  company,
  manager,
  // phoneCodeList,
  phone,
  phoneCode,
  businessFile,
  licenseFile,
  licenseDate,
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
  const businessFileRef = useRef();
  const licenseFileRef = useRef();
  // submit, sendEmail check
  const isSubmitEmail = isSubmit || isSendEmail;
  const isErrorEmail = checkEmailStatus === false || (isSubmitEmail && !regEmail(email.value));
  // 패스워드 보여주기 여부
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const isRequiredBusiness =
    type.value.lab && requiredCountryListForLab.indexOf(country.value) !== -1;
  const typeIconArray = {
    // clinic: icon_type_clinic,
    // lab: icon_type_lab,
    // milling: icon_type_milling,
    // designer: icon_type_designer,
    clinic: picto_type_clinic,
    lab: picto_type_lab,
    milling: picto_type_milling,
    designer: picto_type_designer,
  };

  return (
    <Styled.SignUp data-component-name="SignUp">
      <h1 className="signup__title">
        {t('SIGNUP_TEXT', { brandLogoText: brand.logo.text })}
        {/* <Button
          disableElevation
          variant="contained"
          size="small"
          className="signup__back_btn"
          onClick={() => history.goBack()}
        >
          <T>global.back</T>
        </Button> */}
      </h1>

      <Grid container className="signup__form_container">
        <Grid item xs={12}>
          <label htmlFor="userType" className="input__label">
            <T>GLOBAL_USERTYPE</T>
            <CustomSpan fontColor={color.red}>*</CustomSpan>
          </label>
        </Grid>
        <Grid item xs={12}>
          <FormGroup row className="signup__type_group">
            {_.map(companyType, (item, key) => {
              const typeIndex = item.index;
              const checked = type.value[item.index];
              const typeIcon = typeIconArray[item.index];
              return (
                <label className={cx('signup__type_checkbox', { active: checked })} key={key}>
                  <input
                    type="checkbox"
                    className="signup__type_input"
                    name={typeIndex}
                    checked={checked}
                    onChange={e => type.onChange(e)}
                  />
                  <span className="signup__type_icon">
                    <img src={typeIcon} alt={key} />
                  </span>
                  <span className="signup__type_name">
                    {typeIndex === 'clinic' && <T>GLOBAL_CLINIC</T>}
                    {typeIndex === 'lab' && <T>GLOBAL_LAB</T>}
                    {typeIndex === 'milling' && <T>GLOBAL_MILLING</T>}
                    {typeIndex === 'designer' && <T>GLOBAL_DESIGNER</T>}
                  </span>
                </label>
              );
            })}
          </FormGroup>
          <CustomFormHelperText
            className={cx('error', {
              active: isSubmit ? !_.find(type.value, item => !!item === true) : false,
            })}
          >
            <T>REGISTER_REQUIRED</T>
          </CustomFormHelperText>
        </Grid>

        {/* TODO: User service check */}
        <Grid item xs={12}>
          <label className="input__label">
            <T>GLOBAL_DESIGNER_SERVICE</T>
          </label>
        </Grid>
        <Grid item xs={12} className="input__grid_item designer-service">
          <div className="input__box flex-align-items-center">
            <FormControlLabel
              className="cursor-default"
              control={
                <MuiWrapper>
                  <Checkbox
                    checked={checkDesignerService.value}
                    color="primary"
                    size="small"
                    // onChange={checkDesignerService.onChange}
                    className="cursor-default"
                  />
                </MuiWrapper>
              }
              label={
                <span className="input__primary_text">
                  <T>INFORMATION_DESIGNER_CAN_PROVIDED_SERVICE</T>
                </span>
              }
              labelPlacement="end"
            />
          </div>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="email" className="input__label">
            <T>GLOBAL_EMAIL</T>
            <CustomSpan fontColor={color.red}>*</CustomSpan>
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
                  disabled={!checkEmailStatus}
                  id="code"
                  name="code"
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
            <CustomSpan fontColor={color.red}>*</CustomSpan>
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
              placeholder={t('REGISTER_PASSWORD')}
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
            <CustomSpan fontColor={color.red}>*</CustomSpan>
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

        <Grid item xs={12}>
          <label htmlFor="country" className="input__label">
            <T>GLOBAL_LANGUAGE</T>
            <CustomSpan fontColor={color.red}>*</CustomSpan>
          </label>
        </Grid>
        <Grid item xs={12}>
          <MuiWrapper className="form__input_box" isGlobalStyle={true}>
            <FormControl
              fullWidth
              variant="outlined"
              error={isSubmit ? !language.value?.length : false}
            >
              <Select
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  marginThreshold: 10,
                }}
                displayEmpty
                multiple
                name="language"
                value={language.value}
                onChange={e => {
                  if (!(e.target.value?.length > 5)) {
                    language.onChange(e);
                  } else {
                    // if need, alarm
                  }
                }}
                renderValue={selected => {
                  if (selected.length === 0) return '';
                  const selectedLabelList = supportCountryList.reduce((acc, curr) => {
                    if (selected.includes(curr.language_idx)) return acc.concat(curr.language);
                    return acc;
                  }, []);

                  return selectedLabelList.join(', ');
                }}
              >
                {supportCountryList?.length > 0 &&
                  supportCountryList.map((item, index) => (
                    <MenuItem key={index} value={item.language_idx}>
                      <Checkbox
                        color="primary"
                        checked={language.value.includes(item.language_idx)}
                      />
                      {item.locale}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </MuiWrapper>

          <CustomFormHelperText
            className={cx(`error`, {
              active: isSubmit ? !language.value?.length : false,
            })}
          >
            <T>REGISTER_REQUIRED</T>
          </CustomFormHelperText>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="country" className="input__label">
            <T>GLOBAL_COUNTRY</T>
            <CustomSpan fontColor={color.red}>*</CustomSpan>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <MuiWrapper>
                <FormControl fullWidth variant="outlined" error={isSubmit ? !region.value : false}>
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    displayEmpty
                    name="country"
                    value={country.value}
                    onChange={e => {
                      country.onChange(e);
                      region.setValue('');
                    }}
                  >
                    {countryList?.length > 0 &&
                      countryList.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper>

              <CustomFormHelperText
                className={cx(`error`, {
                  active: isSubmit ? !region.value : false,
                })}
              >
                <T>REGISTER_REQUIRED</T>
              </CustomFormHelperText>
            </Grid>
            <Grid item xs={6}>
              <MuiWrapper>
                <FormControl fullWidth variant="outlined" error={isSubmit ? !region.value : false}>
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    name="region"
                    value={region.value}
                    onChange={region.onChange}
                  >
                    {regionList?.length > 0 &&
                      regionList.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="company" className="input__label">
            <T>GLOBAL_NICKNAME</T>
            <CustomSpan fontColor={color.red}>*</CustomSpan>
          </label>
        </Grid>
        <Grid item xs={12}>
          <MuiWrapper>
            <TextField
              id="company"
              name="company"
              variant="outlined"
              fullWidth
              autoComplete="off"
              inputProps={{
                maxLength: 25,
              }}
              error={isSubmit ? !company.value : false}
              value={company.value || ''}
              onChange={company.onChange}
            />
          </MuiWrapper>

          <CustomFormHelperText
            className={cx(`error`, {
              active: isSubmit ? !company.value : false,
            })}
          >
            <T>REGISTER_REQUIRED</T>
          </CustomFormHelperText>
        </Grid>

        {/* <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <label htmlFor="company" className="input__label">
                <T>global.label.companyName</T>
              </label>
              <MuiWrapper>
                <TextField
                  id="company"
                  name="company"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  inputProps={{
                    maxLength: 25,
                  }}
                  error={isSubmit ? !company.value : false}
                  value={company.value || ''}
                  onChange={company.onChange}
                />
              </MuiWrapper>

              <CustomFormHelperText
                className={cx(`error`, {
                  active: isSubmit ? !company.value : false,
                })}
              >
                <T>reg.required</T>
              </CustomFormHelperText>
            </Grid>
            <Grid item xs={6}>
              <label htmlFor="manager" className="input__label">
                <T>global.label.ceoName</T>
              </label>
              <MuiWrapper>
                <TextField
                  id="manager"
                  name="manager"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  inputProps={{
                    maxLength: 25,
                  }}
                  error={isSubmit ? !manager.value : false}
                  value={manager.value || ''}
                  onChange={manager.onChange}
                />
              </MuiWrapper>

              <CustomFormHelperText
                className={cx(`error`, {
                  active: isSubmit ? !manager.value : false,
                })}
              >
                <T>reg.required</T>
              </CustomFormHelperText>
            </Grid>
          </Grid>
        </Grid> */}

        <Grid item xs={12}>
          <label htmlFor="phone" className="input__label">
            <T>GLOBAL_PHONE</T>
            <CustomSpan fontColor={color.red}>*</CustomSpan>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
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
                    {/* {phoneCodeList?.length > 0 &&
                      phoneCodeList.map((item, idx) => {
                        if (!item.code) return null;
                        return (
                          <MenuItem key={idx} value={item.code}>
                            {item.code && `${item.name} | ${item.code}`}
                          </MenuItem>
                        );
                      })} */}
                    {countryList?.length > 0 &&
                      countryList.map((item, idx) => {
                        if (!item.phonecode) return null;
                        return (
                          <MenuItem key={idx} value={item.phonecode}>
                            {item.phonecode && `${item.name} | ${item.phonecode}`}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </Grid>
            <Grid item xs={8}>
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
                  error={isSubmit ? !regNumber(phone.value) : false}
                  value={phone.value || ''}
                  onChange={phone.onChange}
                />
              </MuiWrapper>

              <CustomFormHelperText
                className={cx(`error`, {
                  active: isSubmit ? !regNumber(phone.value) : false,
                })}
              >
                <T>REGISTER_NOT_VALID</T>
              </CustomFormHelperText>
            </Grid>
          </Grid>
        </Grid>

        {/* <Grid item xs={12}>
          <label className="input__label">
            <T>signup.businessRegistration</T>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <MuiWrapper>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled
                  // error={error.businessFile.isError}
                  placeholder={businessFile.value.name}
                />
              </MuiWrapper>
              <CustomFormHelperText
                className={cx(`error`, { active: false })}
              ></CustomFormHelperText>
            </Grid>
            <Grid item xs={4} className="file__box">
              <ButtonBase className="file__upload_btn_box">
                <label htmlFor="businessImage" className="file__upload_btn">
                  <T>global.addFile</T>
                  <input
                    type="file"
                    accept=".gif,.png,.jpeg,.jpg"
                    id="businessImage"
                    name="businessImage"
                    hidden
                    ref={businessFileRef}
                    onChange={businessFile.onChange}
                  />
                </label>
              </ButtonBase>

              <MuiButton
                variant="outlined"
                color="primary"
                fullWidth
                disableElevation
                className="file__delete_btn"
                onClick={() => {
                  businessFile.setValue({});
                  businessFileRef.current.value = null;
                }}
              >
                <T>global.delete</T>
              </MuiButton>
            </Grid>
          </Grid>
        </Grid> */}

        {!!type.value.designer && (
          <>
            <Grid item xs={12}>
              <label className="input__label">
                <T>GLOBAL_LICENSE_REGISTRATION</T>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <MuiWrapper>
                    <TextField
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        readOnly: true,
                      }}
                      placeholder={licenseFile.value.name}
                      error={isSubmit && isRequiredBusiness ? !licenseFile.value.name : false}
                    />
                  </MuiWrapper>
                  <CustomFormHelperText
                    className={cx(`error`, {
                      active: isSubmit && isRequiredBusiness ? !licenseFile.value.name : false,
                    })}
                  >
                    <T>REGISTER_REQUIRED</T>
                  </CustomFormHelperText>
                </Grid>
                <Grid item xs={4} className="file__box">
                  <ButtonBase className="file__upload_btn_box">
                    <label htmlFor="licenseImage" className="file__upload_btn">
                      <T>GLOBAL_ADD_FILE</T>
                      <input
                        type="file"
                        accept=".gif,.png,.jpeg,.jpg"
                        id="licenseImage"
                        name="licenseImage"
                        hidden
                        ref={licenseFileRef}
                        onChange={licenseFile.onChange}
                      />
                    </label>
                  </ButtonBase>

                  <MuiButton
                    variant="outlined"
                    color="primary"
                    fullWidth
                    disableElevation
                    className="file__delete_btn"
                    onClick={() => {
                      licenseFile.setValue({});
                      licenseFileRef.current.value = null;
                    }}
                  >
                    <T>GLOBAL_DELETE</T>
                  </MuiButton>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <label htmlFor="phone" className="input__label">
                <T>GLOBAL_LICENSE_DATE</T>
              </label>
            </Grid>
            <Grid item xs={12}>
              <CustomDatePicker
                value={licenseDate.value}
                fullWidth
                height={40}
                className={cx({
                  error: isSubmit && isRequiredBusiness ? !licenseDate.value : false,
                })}
                onChange={licenseDate.onChange}
              />

              <CustomFormHelperText
                className={cx(`error`, {
                  active: isSubmit && isRequiredBusiness ? !licenseDate.value : false,
                })}
              >
                <T>REGISTER_REQUIRED</T>
              </CustomFormHelperText>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <label htmlFor="visibility" className="input__label">
            <T>SIGNUP_PUBLIC_AVAILABILTY</T>
          </label>
        </Grid>
        <Grid item xs={12}>
          <div className="signup__visibility_group">
            {_.map(visibilityType, item => {
              const checked = item.id === Number(visibility.value);
              return (
                <label
                  className={cx('signup__visibility_radio', {
                    active: checked,
                  })}
                  key={item.id}
                >
                  <input
                    type="radio"
                    name="visibility"
                    className="signup__visibility_input"
                    value={item.id}
                    checked={checked}
                    onChange={visibility.onChange}
                  />
                  <span className="signup__visibility_checkmark">
                    <span className="signup__visibility_checkmark_in"></span>
                  </span>
                  <span className="signup__visibility_name">
                    {item.index === 'public' && <T>SIGNUP_PUBLIC_ALL</T>}
                    {item.index === 'partnerShip' && <T>SIGNUP_PUBLIC_TO_PARTNERS</T>}
                  </span>
                </label>
              );
            })}
          </div>

          <CustomFormHelperText className={cx(`error`, { active: false })}></CustomFormHelperText>
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
          <T>SIGNUP_CREATE_ACCOUNT</T>
        </MuiButton>
      </div>

      <TermsOfUseInfo location="signup" />

      <div className="signup__aleady">
        {/* 이미 계정이 있으신가요? */}
        {/* <span className="login__info">
            <Link to="/auth/signin">로그인하기</Link>
          </span> */}
        <T>SIGNUP_ALREADY_ACCOUNT</T>
      </div>
      <div className="link__box">
        <Link to={pageUrl.auth.signIn}>
          <T>GLOBAL_BACK_TO_LOGIN</T>
        </Link>
      </div>
    </Styled.SignUp>
  );
}

const Styled = {
  SignUp: styled.div`
    /* position: fixed; */
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .signup__title {
      margin: 100px 0 45px;
      font-size: 40px;
      color: #333;
      text-align: center;
      font-weight: 700;
      .signup__back_btn {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-left: 12px;
        width: 60px;
        height: 30px;
        min-width: auto;
        border-radius: 30px;
        font-size: 13.5px;
        line-height: 1.5;
        font-weight: 700;
        color: white;
        background-color: ${color.navy};
        &:hover {
          background-color: ${color.navy};
        }
      }
    }
    .signup__form_container {
      width: 500px;
      margin: 0 auto;
    }
    .signup__type_group {
      justify-content: space-between;
      .signup__type_checkbox {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        width: 120px;
        height: 120px;
        border: 1px solid #bbb;
        box-sizing: border-box;
        border-radius: 5px;
        font-size: 15px;
        text-align: center;
        cursor: pointer;
        overflow: hidden;
        &.active {
          background-color: #f6fafc;
          border-color: ${color.blue};
          .signup__type_checkmark {
            background-color: ${color.blue};
          }
        }
        .signup__type_input {
          position: absolute;
          top: 0;
          left: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        .signup__type_icon,
        .signup__type_name {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .signup__type_icon {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          height: 92px;
          img {
            width: 80%;
            height: 80px;
          }
        }
        .signup__type_name {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: calc(100% - 92px);
          background-color: ${color.blue};
          font-size: 12px;
          text-align: center;
          color: #fff;
          line-height: 0;
        }
      }
    }
    .input__box {
      display: block;
      &.flex-align-items-center {
        ${flexAlignItemsCenter}
      }
    }
    // designer service 별도 스타일 처리
    .designer-service {
      margin-top: 0px;
      .input__primary_text {
        font-size: 15px;
        color: ${theme.color.primary};
      }
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
    .file__box {
      display: flex;
      align-items: flex-start;
      .file__upload_btn_box {
        flex: 1.2;
      }
      .file__upload_btn {
        ${buttonBlue};
        width: 100%;
        font-size: 14px;
        height: 40px;
        padding: 0;
        border-radius: 4px;
      }
      .file__delete_btn {
        flex: 1;
        margin-left: 5px;
      }
    }
    .signup__visibility_group {
      display: flex;
      justify-content: space-between;
      .signup__visibility_radio {
        position: relative;
        cursor: pointer;
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 180px;
        height: 40px;
        border: 1px solid #bbb;
        box-sizing: border-box;
        border-radius: 4px;
        text-align: center;
        font-size: 15px;
        color: #333333;
        &:not(:first-child) {
          margin-left: 8px;
        }
        &.active {
          background-color: #f6fafc;
          border-color: ${color.blue};
          .signup__visibility_checkmark {
            background-color: ${color.blue};
          }
        }
        .signup__visibility_input {
          position: absolute;
          top: 0;
          left: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        .signup__visibility_checkmark {
          position: absolute;
          display: block;
        }
        .signup__visibility_checkmark {
          display: flex;
          justify-content: center;
          align-items: center;
          top: 50%;
          right: 9px;
          transform: translateY(-50%);
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background-color: #bbb;
          .signup__visibility_checkmark_in {
            position: relative;
            top: -2px;
            display: block;
            width: 8px;
            height: 5px;
            border: 1px solid transparent;
            border-left-color: #fff;
            border-bottom-color: #fff;
            transform: rotate(-45deg);
          }
        }
        .signup__visibility_name {
        }
      }
    }
    .submit__box {
      margin-bottom: 12px;
      margin-top: 30px;
      text-align: center;
      .submit__btn {
        width: 300px;
        font-size: 16px;
        font-weight: 700;
        text-transform: initial;
      }
    }
    .signup__aleady {
      margin-top: 20px;
      font-size: 18px;
      color: ${color.black_font};
      text-align: center;
    }
    .link__box {
      display: block;
      margin-top: 10px;
      font-size: 16px;
      color: ${color.blue};
      font-weight: bold;
      text-align: center;
    }
  `,
};
