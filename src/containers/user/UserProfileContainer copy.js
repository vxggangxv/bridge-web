import {
  ButtonBase,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { icon_face, icon_user_circle } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import useCheckInput from 'lib/hooks/useCheckInput';
import useDateInput from 'lib/hooks/useDateInput';
import useFileInput from 'lib/hooks/useFileInput';
import useInput from 'lib/hooks/useInput';
import { companyType, requiredCountryListForLab, visibilityType } from 'lib/mapper';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { regNumber, setFormData } from 'lib/library';
import React, { useEffect, useState, useRef } from 'react';
import { UserActions, UtilActions } from 'store/actionCreators';
import styled from 'styled-components';
import { font, buttonBlue, color, theme, beforeDash } from 'styles/utils';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import {
  icon_type_clinic,
  icon_type_lab,
  icon_type_milling,
  icon_type_designer,
} from 'components/base/images';
import CustomFormHelperText from 'components/common/text/CustomFormHelperText';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import moment from 'moment';
import PlainModal from 'components/common/modal/PlainModal';
import ModalChangePassword from 'components/common/modal/content/ModalChangePassword';
import ImgCrop from 'components/common/images/ImgCrop';
import { flexAlignItemsCenter } from 'styles/utils';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { ENV_MODE_DEV } from 'lib/setting';

export default function UserProfileContainer(props) {
  const {
    user,
    fetchProfileSuccess,
    editProfileSuccess,
    supportCountryList,
    fetchSupportCountriesSuccess,
    countryList,
    regionList,
  } = useShallowSelector(state => ({
    user: state.user.user,
    fetchProfileSuccess: state.user.fetchProfile.success,
    editProfileSuccess: state.user.editProfile.success,
    supportCountryList: state.util.supportCountries.data?.languageList,
    fetchSupportCountriesSuccess: state.util.supportCountries.success,
    countryList: state.util.countries.data?.countryList,
    regionList: state.util.regions.data?.regionList,
  }));
  const isModify = useInput(true);
  const profileFile = useFileInput({
    file: null,
    name: '',
  });
  const visibility = useInput(0);
  const type = useCheckInput({
    clinic: true,
    lab: false,
    milling: false,
    designer: false,
  });
  const language = useInput([]);
  const country = useInput('');
  const region = useInput('');
  const company = useInput('');
  const manager = useInput('');
  const phone = useInput('');
  // onChange - setValue 에 사용
  const phoneCode = useInput('');
  const address = useInput('');
  const businessFile = useFileInput({
    file: null,
    name: '',
  });
  const licenseFile = useFileInput({
    file: null,
    name: '',
  });
  const licenseDate = useDateInput(null);
  const checkDeleteFile = useInput({
    profile: 0,
    business: 0,
    license: 0,
  });
  const checkDesignerService = useCheckOneInput(false);
  const [isSubmit, setIsSubmit] = useState(false);

  // "profileImgIdx": 24,
  // "profileImg": "https://dof-live.s3.ap-northeast-2.amazonaws.com/sync/user/J720AUG-0001/private/J720AUG-0001/profile-J720AUG-0001.png",
  // "email": "receiver@doflab.com",
  // "userCode": "J720AUG-0001",
  // "company": "receiver company",
  // "grade": null,
  // "languageGroup": null,
  // "manager": "manager",
  // "phone": "01055431123",
  // "country": "India",
  // "state": "Chhattisgarh",
  // "country_id": 101,
  // "states_id": 1553,
  // "address": "성동구 307",
  // "visibility": 0,
  // "licenseImg": "https://dof-live.s3.ap-northeast-2.amazonaws.com/sync/user/J720AUG-0001/private/J720AUG-0001/license-J720AUG-0001.png"
  // "licenseDate": 123123123
  // init
  useEffect(() => {
    // UserActions.fetch_request();
    UserActions.fetch_profile_request();
    UtilActions.fetch_support_countries_request();
    UtilActions.fetch_countries_request();
  }, []);

  // init - user data input
  useDidUpdateEffect(() => {
    // TEMP:
    console.log(user, 'user');
    profileFile.setValue({ ...profileFile.value, name: user.profileImg });
    visibility.setValue(user.visibility || 0);
    type.setValue(user.type);
    country.setValue(user.country_id || '');
    region.setValue(user.states_id || '');
    language.setValue(user.languageIdxGroup || []);
    company.setValue(user.company || '');
    manager.setValue(user.manager || '');
    phone.setValue(user.phone || '');
    phoneCode.setValue(user.phonecode || '');
    address.setValue(user.address || '');
    businessFile.setValue({ ...businessFile.value, name: user.businessImg });
    licenseFile.setValue({ ...licenseFile.value, name: user.licenseImg });
    const isCheckDateNull =
      !user?.licenseDate || user.licenseDate === 'null' || user.licenseDate === null ? true : false;
    // const date = isCheckDateNull ? null : moment.unix(moment(user.licenseDate).unix());
    // const date = isCheckDateNull ? null : moment(user.licenseDate);
    const date = isCheckDateNull ? null : moment(moment.unix(user.licenseDate));
    licenseDate.setValue(date);
    // licenseDate.setValue('2020-10-10');
  }, [!!fetchProfileSuccess]);

  // onChange - country.value에 따른 regionList, phoneCode 변경
  useDidUpdateEffect(() => {
    // TEMP:
    // console.log('work??');
    UtilActions.fetch_regions_request({ country: country.value });
    if (countryList) {
      // console.log('countryList', countryList);
      const countryPhoneCode =
        countryList?.find(item => item.id === country.value)?.phonecode || '';
      phoneCode.setValue(countryPhoneCode);
      // console.log(countryPhoneCode, 'countryPhoneCode');
    }
  }, [country.value]);

  // init, onChange - type.value?.desinger === true
  useDidUpdateEffect(() => {
    // TEMP:
    // console.log('work??');
    checkDesignerService.setValue(!!type.value?.designer);
  }, [type.value?.designer]);

  const handleSubmit = () => {
    // presenter component에서 submit 이후 required값 체크되도록
    setIsSubmit(true);

    // 필수 입력 및 정규식 유효성 확인
    const hasTypeValue = [
      type.value?.clinic,
      type.value?.lab,
      type.value?.milling,
      type.value?.designer,
    ].some(item => !!item === true);

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
      !hasTypeValue,
      !hasLanguageValue,
      !hasRegionValue,
      !hasCompanyValue,
      // !hasManagerValue,
      !isValidPhoneValue,
    ];

    // 기공사일 경우
    if (type.value?.lab && requiredCountryListForLab.indexOf(country.value) !== -1) {
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
    // console.log(isFailureSubmit);
    if (isFailureSubmit) return false;

    // NOTE: ADD 할 경우 file true, DELETE 할 경우 1 체크
    const isDeleteProfile = !!profileFile.value.file || checkDeleteFile.value.profile;
    const isDeleteBusiness = !!businessFile.value.file || checkDeleteFile.value.business;
    const isDeleteLicense = !!licenseFile.value.file || checkDeleteFile.value.license;

    const submitData = {
      userCode: user.userCode,
      visibility: visibility.value,
      profileImg: profileFile.value.file,
      type_clinic: type.value?.clinic ? 1 : 0,
      type_lab: type.value?.lab ? 1 : 0,
      type_milling: type.value?.milling ? 1 : 0,
      type_designer: type.value?.designer ? 1 : 0,
      languageGroup: language.value.join('%'),
      states_id: region.value,
      company: company.value,
      // manager: manager.value,
      phone: phone.value?.trim(),
      phonecode: countryList?.find(item => item.phonecode === phoneCode.value)?.id,
      address: address.value?.trim(),
      businessImg: businessFile.value.file,
      licenseImg: licenseFile.value.file,
      licenseDate: licenseDate.value?.format('YYYY-MM-DD'),
      deleteProfileImg: isDeleteProfile ? user.profileImg : null,
      deleteBusinessImg: isDeleteBusiness ? user.businessImg : null,
      deleteLicenseImg: isDeleteLicense ? user.licenseImg : null,
    };

    // NOTE: lab아닐경우 자격증 삭제
    if (!type.value?.lab) {
      submitData.deleteLicenseImg = user.licenseImg;
      submitData.licenseDate = null;
    }

    console.log(submitData, 'submitData');
    // console.log(setFormData(submitData), 'setFormData(submitData)');
    // actions.INFO_USER_INFORMATION_SAGAS({ userCode: user.userCode });
    UserActions.edit_profile_request(setFormData(submitData));
  };

  useDidUpdateEffect(() => {
    if (editProfileSuccess) {
      UserActions.fetch_profile_request();
      isModify.setValue(false);
    }
  }, [!!editProfileSuccess]);

  // if (!user) return null;
  const { isFetchSuccess } = useFetchLoading({ fetchProfileSuccess, fetchSupportCountriesSuccess });
  if (!isFetchSuccess) return null;
  return (
    <UserProfile
      user={user}
      isModify={isModify}
      profileFile={profileFile}
      visibility={visibility}
      type={type}
      supportCountryList={supportCountryList}
      language={language}
      country={country}
      countryList={countryList}
      region={region}
      regionList={regionList}
      company={company}
      manager={manager}
      phone={phone}
      phoneCode={phoneCode}
      address={address}
      businessFile={businessFile}
      licenseFile={licenseFile}
      licenseDate={licenseDate}
      checkDeleteFile={checkDeleteFile}
      checkDesignerService={checkDesignerService}
      isSubmit={isSubmit}
      onSubmit={handleSubmit}
    />
  );
}

export function UserProfile({
  user,
  isModify,
  profileFile,
  visibility,
  type,
  supportCountryList,
  language,
  country,
  countryList,
  region,
  regionList,
  company,
  manager,
  phone,
  phoneCode,
  address,
  businessFile,
  licenseFile,
  licenseDate,
  checkDeleteFile,
  checkDesignerService,
  isSubmit,
  onSubmit,
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // ref state
  const profileFileRef = useRef();
  const businessFileRef = useRef();
  const licenseFileRef = useRef();
  const isRequiredBusiness =
    type.value?.lab && requiredCountryListForLab.indexOf(country.value) !== -1;
  const viewVisibility = _.find(visibilityType, item => item.id === user.visibility)?.label;
  const viewTypeList = _.reduce(
    user.type,
    (arr, value, keyName) => {
      return value === 1 ? arr.concat(companyType[keyName]) : arr;
    },
    [],
  );
  const typeIconArray = {
    clinic: icon_type_clinic,
    lab: icon_type_lab,
    milling: icon_type_milling,
    designer: icon_type_designer,
  };

  // console.log(typeList, 'typeList');
  // const userTypeList =

  return (
    <Styled.UserProfile data-component-name="Profile">
      <PlainModal
        isOpen={isOpen}
        onClick={() => setIsOpen(false)}
        content={<ModalChangePassword onClose={() => setIsOpen(false)} />}
        width={680}
        isCloseIcon={true}
      />

      <h1 className="page-title">Information</h1>
      <div className={cx('page-layout', { edit: isModify.value })}>
        <div className={cx('profile__thumbnail_box', { edit: isModify.value })}>
          <figure className="profile__figure">
            {user.profileImg ? (
              <ImgCrop
                width={130}
                isCircle
                src={user.profileImg}
                className="radius-circle box-shadow-default"
              />
            ) : (
              <img
                src={icon_user_circle}
                art="face icon"
                width="130"
                className="radius-circle box-shadow-default"
              />
            )}
          </figure>
          <div className="profile__account_box">
            <p className="profile__name">{user.company}</p>
            <p className="profile__email">{user.email}</p>
            {ENV_MODE_DEV && <p className="profile__email">{user.userCode}</p>}
          </div>

          <MuiButton
            disableElevation
            variant="contained"
            className="password_reset_btn sm"
            onClick={() => setIsOpen(true)}
          >
            <T>mypage.passwordReset</T>
          </MuiButton>
        </div>

        {/* {isModify.value && <div className="profile__grid_division"></div>} */}

        <Grid container className={cx('profile__form_container', { edit: isModify.value })}>
          {isModify.value && (
            <>
              <Grid item xs={12} className="profile__form_title">
                Modify
              </Grid>
              <Grid item xs={12} className="profile__form_grid_item">
                <label className="profile__form_label">
                  <T>global.label.profileImage</T>
                </label>
                <div className="profile__form_input_box">
                  <Grid container spacing={1}>
                    <Grid item xs={9}>
                      <MuiWrapper className="profile__form_input">
                        <TextField
                          variant="outlined"
                          fullWidth
                          disabled
                          placeholder={profileFile.value.name}
                        />
                      </MuiWrapper>
                    </Grid>
                    <Grid item xs={3} className="file__box">
                      <ButtonBase className="file__upload_btn_box">
                        <label className="file__upload_btn">
                          <T>global.addFile</T>
                          <input
                            type="file"
                            accept=".gif,.png,.jpeg,.jpg"
                            id="profileImage"
                            name="profileImage"
                            hidden
                            ref={profileFileRef}
                            onChange={profileFile.onChange}
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
                          profileFile.setValue({});
                          profileFileRef.current.value = null;
                          checkDeleteFile.setValue({
                            ...checkDeleteFile.value,
                            ['profile']: 1,
                          });
                        }}
                      >
                        <T>global.delete</T>
                      </MuiButton>
                    </Grid>
                  </Grid>
                  <CustomFormHelperText>
                    <T>mypage.subtext.image</T>
                  </CustomFormHelperText>
                </div>
              </Grid>
            </>
          )}
          <Grid item xs={12} className="profile__form_grid_item align-items-no">
            {!isModify.value && (
              <label className="profile__form_label userType">
                <T>global.label.userType</T>
              </label>
            )}
            <span className="profile__form_text">
              {viewTypeList
                .map(item => {
                  const typeIndex = item.index;
                  if (typeIndex === 'clinic') return t('global.userType.clinic');
                  if (typeIndex === 'lab') return t('global.userType.lab');
                  if (typeIndex === 'milling') return t('global.userType.milling');
                  if (typeIndex === 'designer') return t('global.userType.designer');
                })
                .join(' / ')}
            </span>
            <div className="profile__form_input_box width-full">
              <Grid container spacing={1}>
                {isModify.value && (
                  <Grid item xs={12}>
                    <label className="profile__form_label userType">
                      <T>global.label.userType</T>
                    </label>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormGroup row className="signup__type_group">
                    {_.map(companyType, (item, key) => {
                      const typeIndex = item.index;
                      const checked = type.value[item.index];
                      const typeIcon = typeIconArray[item.index];
                      return (
                        <label
                          className={cx('signup__type_checkbox', { active: checked })}
                          key={key}
                        >
                          <input
                            type="checkbox"
                            className="signup__type_input"
                            name={typeIndex}
                            checked={checked}
                            onChange={e => type.onChange(e)}
                          />
                          <span className="signup__type_checkmark">
                            <span className="signup__type_checkmark_in"></span>
                          </span>
                          <span className="signup__type_icon">
                            <img src={typeIcon} alt={key} />
                          </span>
                          <span className="signup__type_name">
                            {typeIndex === 'clinic' && <T>global.userType.clinic</T>}
                            {typeIndex === 'lab' && <T>global.userType.lab</T>}
                            {typeIndex === 'milling' && <T>global.userType.milling</T>}
                            {typeIndex === 'designer' && <T>global.userType.designer</T>}
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
                    <T>reg.required</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item designer-service">
            <label className="profile__form_label">
              <T>global.label.designerService</T>
            </label>
            <span className="profile__form_text">{type.value.designer ? 'O' : 'X'}</span>
            <div className="profile__form_input_box flex-align-items-center">
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
                  <span className="profile__primary_text">
                    <T>mypage.designerServiceText</T>
                  </span>
                }
                labelPlacement="end"
              />
            </div>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>signup.publicAvailabilty</T>
            </label>
            <span className="profile__form_text">{viewVisibility}</span>
            <div className="profile__form_input_box">
              <Grid container spacing={1}>
                <Grid item xs={9}>
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
                            {item.index === 'public' && <T>signup.public</T>}
                            {item.index === 'partnerShip' && <T>signup.publicToPartners</T>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </Grid>
              </Grid>
              <CustomFormHelperText>
                <T>mypage.subtext.public</T>
              </CustomFormHelperText>
            </div>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>global.label.nickName</T>
            </label>
            <span className="profile__form_text">{user.company}</span>
            <div className="profile__form_input_box">
              <Grid container spacing={1}>
                <Grid item xs={9}>
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
                      value={company.value}
                      onChange={company.onChange}
                    />
                  </MuiWrapper>
                  <CustomFormHelperText
                    className={cx('error', {
                      active: isSubmit ? !company.value : false,
                    })}
                  >
                    <T>reg.required</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid>
            </div>
          </Grid>
          {/* <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>global.label.ceoName</T>
            </label>
            <span className="profile__form_text">{user.manager}</span>
            <div className="profile__form_input_box">
              <Grid container spacing={1}>
                <Grid item xs={9}>
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
                      value={manager.value}
                      onChange={manager.onChange}
                    />
                  </MuiWrapper>
                  <CustomFormHelperText
                    className={cx('error', {
                      active: isSubmit ? !manager.value : false,
                    })}
                  >
                    <T>reg.required</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid>
            </div>
          </Grid> */}

          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>global.language</T>
            </label>
            <span className="profile__form_text">{user.language?.join(', ')}</span>
            <div className="profile__form_input_box">
              <Grid container spacing={1}>
                <Grid item xs={9}>
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
                            if (selected.includes(curr.language_idx))
                              return acc.concat(curr.language);
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
                    <T>reg.required</T>
                  </CustomFormHelperText>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>global.label.country</T>
            </label>
            <span className="profile__form_text">
              {user.country} / {user.state}
            </span>
            <div className="profile__form_input_box">
              <Grid container spacing={1}>
                <Grid item xs={9}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <MuiWrapper>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          error={isSubmit ? !region.value : false}
                        >
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
                        <T>reg.required</T>
                      </CustomFormHelperText>
                    </Grid>
                    <Grid item xs={6}>
                      <MuiWrapper>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          error={isSubmit ? !region.value : false}
                        >
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
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>global.label.phone</T>
            </label>
            <span className="profile__form_text">
              {user.phonecode} {user.phone}
            </span>
            <div className="profile__form_input_box">
              <Grid container spacing={1}>
                <Grid item xs={9}>
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
                          placeholder={t('reg.phone')}
                          inputProps={{
                            maxLength: 25,
                          }}
                          error={isSubmit ? !regNumber(phone.value) : false}
                          value={phone.value}
                          onChange={phone.onChange}
                        />
                      </MuiWrapper>

                      <CustomFormHelperText
                        className={cx(`error`, {
                          active: isSubmit ? !regNumber(phone.value) : false,
                        })}
                      >
                        <T>reg.notValid</T>
                      </CustomFormHelperText>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>global.label.address</T>
            </label>
            <span className="profile__form_text">{user.address}</span>
            <div className="profile__form_input_box">
              <Grid container spacing={1}>
                <Grid item xs={9}>
                  <MuiWrapper>
                    <TextField
                      id="address"
                      name="address"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      inputProps={{
                        maxLength: 25,
                      }}
                      value={address.value}
                      onChange={address.onChange}
                    />
                  </MuiWrapper>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            {!isModify.value && (
              <label className="profile__form_label">Certificate of Business registration</label>
            )}
            <span className="profile__form_text">
              {user.businessData?.imgSrc ? (
                <ImgCrop width="100" height="120" display="inline-block" src={user.businessImg} />
              ) : (
                '-'
              )}
            </span>
            <div className="profile__form_input_box width-full">
              <Grid container spacing={1}>
                {isModify.value && (
                  <Grid item xs={12}>
                    <label className="profile__form_label width-full">
                      Certificate of Business registration
                    </label>
                  </Grid>
                )}
                <Grid item xs={9}>
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
                <Grid item xs={3} className="file__box">
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
                      checkDeleteFile.setValue({
                        ...checkDeleteFile.value,
                        ['business']: 1,
                      });
                    }}
                  >
                    <T>global.delete</T>
                  </MuiButton>
                </Grid>
              </Grid>
            </div>
          </Grid>
          {!!type.value?.lab && (
            <>
              <Grid item xs={12} className="profile__form_grid_item">
                <label className="profile__form_label">
                  <T>mypage.licenseRegistration</T>
                </label>
                <span className="profile__form_text">
                  {user.licenseData?.imgSrc ? (
                    <ImgCrop
                      width="100"
                      height="120"
                      display="inline-block"
                      src={user.licenseImg}
                    />
                  ) : (
                    '-'
                  )}
                </span>
                <div className="profile__form_input_box">
                  <Grid container spacing={1}>
                    <Grid item xs={9}>
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
                        <T>reg.required</T>
                      </CustomFormHelperText>
                    </Grid>
                    <Grid item xs={3} className="file__box">
                      <ButtonBase className="file__upload_btn_box">
                        <label htmlFor="licenseImage" className="file__upload_btn">
                          <T>global.addFile</T>
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
                          checkDeleteFile.setValue({
                            ...checkDeleteFile.value,
                            ['license']: 1,
                          });
                        }}
                      >
                        <T>global.delete</T>
                      </MuiButton>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={12} className="profile__form_grid_item">
                <label className="profile__form_label">
                  <T>mypage.licenseDate</T>
                </label>
                <div className="profile__form_text">
                  {user.licenseData?.licenseDate === 'null' ? '-' : user.licenseData?.licenseDate}
                </div>
                <div className="profile__form_input_box">
                  <Grid container spacing={1}>
                    <Grid item xs={9}>
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
                        <T>reg.required</T>
                      </CustomFormHelperText>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </>
          )}
          {/* {isModify.value ? (
            <Grid item xs={12} className="profile__submit_box">
              <MuiButton
                disableElevation
                variant="outlined"
                color="primary"
                onClick={() => isModify.setValue(false)}
              >
                <T>global.cancel</T>
              </MuiButton>
              <MuiButton disableElevation variant="contained" color="primary" onClick={onSubmit}>
                <T>global.ok</T>
              </MuiButton>
            </Grid>
          ) : (
            <Grid item xs={12} className="profile__submit_box">
              <MuiButton
                disableElevation
                variant="contained"
                color="primary"
                onClick={() => isModify.setValue(true)}
              >
                <T>global.modify</T>
              </MuiButton>
            </Grid>
          )} */}
        </Grid>
        {isModify.value ? (
          <Grid item xs={12} className="profile__submit_box">
            <MuiButton
              disableElevation
              variant="outlined"
              color="primary"
              onClick={() => isModify.setValue(false)}
            >
              <T>global.cancel</T>
            </MuiButton>
            <MuiButton disableElevation variant="contained" color="primary" onClick={onSubmit}>
              <T>global.ok</T>
            </MuiButton>
          </Grid>
        ) : (
          <Grid item xs={12} className="profile__submit_box">
            <MuiButton
              className="profile__modify_btn sm"
              disableElevation
              variant="contained"
              color="primary"
              onClick={() => isModify.setValue(true)}
            >
              <T>global.modify</T>
            </MuiButton>
          </Grid>
        )}
      </div>
    </Styled.UserProfile>
  );
}

const Styled = {
  UserProfile: styled.section`
    .page-title {
      ${beforeDash({})};
    }
    .page-layout {
      /* width: 890px;
      margin: 0 auto; */
      width: 100%;
      &:not(.edit) {
        display: flex;
        flex-wrap: wrap;
        margin-top: 50px;
      }
    }
    .profile__thumbnail_box {
      text-align: center;
      /* padding: 150px 0 60px; */
      &:not(.edit) {
        width: 280px;
      }
      &.edit {
        padding: 50px 0 80px;
      }
      .profile__account_box {
        margin-top: 15px;
        font-size: 20px;
        .profile__email {
          margin-top: 10px;
          font-size: 15px;
        }
      }
      .password_reset_btn {
        margin-top: 40px;
        color: #fff;
        background-color: #bcbcbc;
        min-width: 125px;
        font-size: 12px;
        /* border-radius: 0; */
      }
    }

    .profile__form_container {
      /* padding: 100px 0 120px; */
      /* border-top: 1px solid ${color.gray_border2}; */
      font-size: 15px;
      .profile__form_text,
      .profile__form_input_box {
        display: none;
      }
      &:not(.edit) {
        width: calc(100% - 280px);
          padding-left: 40px;
          /* padding-right: 60px; */
          border-left: 1px solid ${color.gray_border2};      
        .profile__form_grid_item {
          &:not(:first-child) {
            margin-top: 15px;
          }
        }
        .profile__form_text {
          display: block;
        }
      }
      
      &.edit {
        padding: 0 60px;
        .profile__form_title {
          ${beforeDash({ width: 17, height: 2, marginRight: 10, fontSize: 18 })};
        }
        .profile__form_grid_item {
          margin-top: 25px;
        }
        .profile__form_label {
          /* top: -18px; */
          display: flex;
          align-items: center;
          &.userType {
            /* top: 7px; */
          }
          &:before {
            content: '';
            display: inline-block;
            width: 1px;
            margin-right: 5px;
            border: 7px solid transparent;
            border-left-width: 9px;
            border-left-color: ${color.blue};
            border-right: none;
          }
        }
        .profile__form_input_box {
          display: block;
          /* &.width-full {
            padding-left: 180px;
          } */
          &.flex-align-items-center {
            ${flexAlignItemsCenter}
          }
          .customFormHelperText  {
            position: absolute;
          }
        }
        // designer service 별도 스타일 처리
        .designer-service {
          /* margin-top: 0px; */
          .profile__form_label {
            top: 0px;
          }
          .profile__primary_text {
            color: ${theme.color.primary};
          }
        }
      }
      
      .profile__form_grid_item {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          line-height: 1.5;
          &:not(.align-items-no) {
            align-items: center;
          }
        }
        .profile__form_label {
          position: relative;
          width: 180px;
          /* font-weight: 700; */
          /* text-align: right; */
          &.width-full {
            width: 100%;
          }
        }
        .profile__form_text {
          width: calc(100% - 180px);
          /* padding-left: 100px; */
        }
        .profile__form_input_box {
          width: calc(100% - 180px);
          &.width-full {
            width: 100%;
          }
          /* padding-left: 30px; */
          /* padding-right: 15px; */
          /* min-height: 60px; */
          .profile__form_input {
            /* width: 500px; */
          }
        }
      
    }

    .signup__type_group {
      justify-content: space-between;
      .signup__type_checkbox {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 120px;
        border: 1px solid #bbb;
        box-sizing: border-box;
        border-radius: 5px;
        font-size: 15px;
        text-align: center;
        cursor: pointer;
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
        .signup__type_icon {
          position: relative;
          top: -10px;
          display: inline-block;
        }
        .signup__type_checkmark,
        .signup__type_name {
          position: absolute;
          display: block;
        }
        .signup__type_checkmark {
          display: flex;
          justify-content: center;
          align-items: center;
          top: 9px;
          right: 9px;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background-color: #bbb;
          .signup__type_checkmark_in {
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
        .signup__type_name {
          bottom: 15px;
          left: 0;
          width: 100%;
          text-align: center;
          color: #333333;
        }
      }
    }

    .signup__visibility_group {
      display: flex;
      justify-content: space-between;
      width: 100%;
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

    .file__box {
      display: flex;
      align-items: flex-start;
      .file__upload_btn_box {
        flex: 1.3;
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

    .profile__submit_box {
      margin-top: 50px;
      /* text-align: right; */
      .button {
        min-width: 100px;
        &:not(:first-child) {
          margin-left: 5px;
        }
      }
      .profile__modify_btn {
        display: block;
        width: 260px;
        margin: 0 auto;
      }
    }
  `,
};
