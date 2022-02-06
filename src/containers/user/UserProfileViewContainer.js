import { Grid } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import { icon_face, icon_user_circle } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
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
import {
  picto_type_clinic,
  picto_type_lab,
  picto_type_milling,
  picto_type_designer,
} from 'components/base/images';
import moment from 'moment';
import ImgCrop from 'components/common/images/ImgCrop';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { ENV_MODE_DEV } from 'lib/setting';
import { getCookie } from 'lib/storage';
import PlainModal from 'components/common/modal/PlainModal';
import AppModal from 'components/common/modal/AppModal';
import UserPasswordModalContainer from 'containers/user/UserPasswordModalContainer';

export default function UserProfileViewContainer(props) {
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
  const isOpenPasswordChange = useInput(false);
  const { uid } = useParams();
  const isModify = useInput(false);
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

    // TEST:
    console.log('file', getCookie('file0'));
  }, []);

  // init - user data input
  useDidUpdateEffect(() => {
    // TEMP:
    // console.log(user, 'user');
    // const urlToObject = async () => {
    //   const response = await fetch(user.profileImg);
    //   // here image is url/location of image
    //   const blob = await response.blob();
    //   const file = new File([blob], 'image.jpg', { type: blob.type });
    //   console.log('user.profileImg', file);
    // };
    // if (user?.profileImg) urlToObject();
    // console.log('user.profileImg', newFile(blob, user.profileImg));
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

  // onChange, refetch on editPage
  // useDidUpdateEffect(() => {
  //   if (isModify.value) {
  //     UserActions.fetch_profile_request();
  //   }
  // }, [isModify.value]);

  // onChange - country.value에 따른 regionList, phoneCode 변경
  // useDidUpdateEffect(() => {
  //   // TEMP:
  //   // console.log('work??');
  //   UtilActions.fetch_regions_request({ country: country.value });
  //   if (countryList) {
  //     // console.log('countryList', countryList);
  //     const countryPhoneCode =
  //       countryList?.find(item => item.id === country.value)?.phonecode || '';
  //     phoneCode.setValue(countryPhoneCode);
  //     // console.log(countryPhoneCode, 'countryPhoneCode');
  //   }
  // }, [country.value]);

  // init, onChange - type.value?.desinger === true
  // useDidUpdateEffect(() => {
  //   // TEMP:
  //   // console.log('work??');
  //   checkDesignerService.setValue(!!type.value?.designer);
  // }, [type.value?.designer]);

  // cancel시 수정값 초기화, fetch로 오지 않는 정보 초기화
  const handleCancel = () => {
    isModify.setValue(false);
    profileFile.setValue({
      file: null,
      name: '',
    });
    businessFile.setValue({
      file: null,
      name: '',
    });
    licenseFile.setValue({
      file: null,
      name: '',
    });
    checkDeleteFile.setValue({
      profile: 0,
      business: 0,
      license: 0,
    });
  };

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
      // deleteProfileImg: isDeleteProfile ? user.profileImg : null,
      // deleteBusinessImg: isDeleteBusiness ? user.businessImg : null,
      // deleteLicenseImg: isDeleteLicense ? user.licenseImg : null,
      deleteProfileImg: isDeleteProfile ? user.profileImgIdx : null,
      deleteBusinessImg: isDeleteBusiness ? user.businessImgIdx : null,
      deleteLicenseImg: isDeleteLicense ? user.licenseImgIdx : null,
    };

    // NOTE: lab아닐경우 자격증 삭제
    if (!type.value?.lab) {
      submitData.deleteLicenseImg = user.licenseImg;
      submitData.licenseDate = null;
    }

    // console.log(submitData, 'submitData');
    // console.log(setFormData(submitData), 'setFormData(submitData)');
    // actions.INFO_USER_INFORMATION_SAGAS({ userCode: user.userCode });
    UserActions.edit_profile_request(setFormData(submitData));
  };

  useDidUpdateEffect(() => {
    if (editProfileSuccess) {
      // UserActions.fetch_profile_request();
      isModify.setValue(false);
    }
  }, [!!editProfileSuccess]);
  const handleCloseAccountModal = () => {
    isOpenPasswordChange.setValue(false);
  };

  // if (!user) return null;
  const { isFetchSuccess } = useFetchLoading({ fetchProfileSuccess, fetchSupportCountriesSuccess });
  if (!isFetchSuccess) return null;
  return (
    <UserProfileView
      isOpenPasswordChange={isOpenPasswordChange}
      uid={uid}
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
      onCancel={handleCancel}
      isSubmit={isSubmit}
      onSubmit={handleSubmit}
      onCloseModal={handleCloseAccountModal}
    />
  );
}

export function UserProfileView({
  isOpenPasswordChange,
  uid,
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
  onCancel,
  isSubmit,
  onSubmit,
  onCloseModal,
}) {
  const history = useHistory();
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
    // clinic: icon_type_clinic,
    // lab: icon_type_lab,
    // milling: icon_type_milling,
    // designer: icon_type_designer,
    clinic: picto_type_clinic,
    lab: picto_type_lab,
    milling: picto_type_milling,
    designer: picto_type_designer,
  };

  // console.log(typeList, 'typeList');
  // const userTypeList =

  return (
    <Styled.UserProfileView data-component-name="Profile">
      <PlainModal isOpen={isOpenPasswordChange.value} onClick={onCloseModal} width={570}>
        <AppModal
          title="password"
          content={<UserPasswordModalContainer onCloseModal={onCloseModal} isModal={true} />}
          contentCardStyle={{
            // padding: '0 0 30px 0',
            padding: 0,
            backgroundColor: 'transparent',
          }}
          isCloseIcon={true}
          onClick={onCloseModal}
          onCancel={onCloseModal}
          hideButton={true}
        />
      </PlainModal>

      <h1 className="page-title">
        <T>USER_MENU_INFORMATION</T>
      </h1>
      <div className="page-layout">
        <div className="profile__thumbnail_box">
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
            onClick={() => {
              // setIsOpen(true)
              // history.push(`/@${uid}/profile/password`);
              isOpenPasswordChange.setValue(true);
            }}
          >
            <T>USER_INFO_PASSWORD_RESET</T>
          </MuiButton>
        </div>

        <Grid container className="profile__form_container">
          <Grid item xs={12} className="profile__form_grid_item align-items-no">
            <label className="profile__form_label userType">
              <T>GLOBAL_USERTYPE</T>
            </label>
            <span className="profile__form_text">
              {viewTypeList
                .map(item => {
                  const typeIndex = item.index;
                  if (typeIndex === 'clinic') return t('GLOBAL_CLINIC');
                  if (typeIndex === 'lab') return t('GLOBAL_LAB');
                  if (typeIndex === 'milling') return t('GLOBAL_MILLING');
                  if (typeIndex === 'designer') return t('GLOBAL_DESIGNER');
                })
                .join(' / ')}
            </span>
          </Grid>

          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>GLOBAL_NICKNAME</T>
            </label>
            <span className="profile__form_text">{user.company}</span>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>GLOBAL_COUNTRY</T>
            </label>
            <span className="profile__form_text">
              {user.country} / {user.state}
            </span>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>GLOBAL_ADDRESS</T>
            </label>
            <span className="profile__form_text">{user.address}</span>
          </Grid>

          <Grid item xs={12} className="profile__form_grid_item">
            <label className="profile__form_label">
              <T>GLOBAL_PHONE</T>
            </label>
            <span className="profile__form_text">
              {user.phonecode} {user.phone}
            </span>
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item designer-service">
            {/* <label className="profile__form_label">
              <T>GLOBAL_DESIGNER_SERVICE</T>
            </label>
             */}
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            {/* <label className="profile__form_label">
              <T>SIGNUP_PUBLIC_AVAILABILTY</T>
            </label>
            <span className="profile__form_text">{viewVisibility}</span> */}
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            {/* <label className="profile__form_label">
              <T>GLOBAL_LANGUAGE</T>
            </label>
            <span className="profile__form_text">{user.language?.join(', ')}</span> */}
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            {/* <label className="profile__form_label">
              <T>GLOBAL_LANGUAGE</T>
            </label>
            <span className="profile__form_text">{user.language?.join(', ')}</span> */}
          </Grid>
          <Grid item xs={12} className="profile__form_grid_item">
            {/* <label className="profile__form_label">
              <T>GLOBAL_LANGUAGE</T>
            </label>
            <span className="profile__form_text">{user.language?.join(', ')}</span> */}
          </Grid>

          {/* {!!type.value?.designer && (
            <>
              <Grid item xs={12} className="profile__form_grid_item">
                <label className="profile__form_label">
                  <T>GLOBAL_LICENSE_REGISTRATION</T>
                </label>
                <span className="profile__form_text">
                  {user.licenseImg ? (
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
              </Grid>
              <Grid item xs={12} className="profile__form_grid_item">
                <label className="profile__form_label">
                  <T>GLOBAL_LICENSE_DATE</T>
                </label>
                <div className="profile__form_text">
                  {user.licenseDate === 'null' ? '-' : user.licenseDate}
                </div>
              </Grid>
            </>
          )} */}
        </Grid>

        <Grid item xs={12} className="profile__submit_box">
          <MuiButton
            className="profile__modify_btn sm"
            disableElevation
            variant="contained"
            color="primary"
            onClick={() => history.push(`/@${uid}/profile/edit`)}
          >
            <T>GLOBAL_MODIFY</T>
          </MuiButton>
        </Grid>
      </div>
    </Styled.UserProfileView>
  );
}

const Styled = {
  UserProfileView: styled.section`
    .page-title {
      ${beforeDash({})};
    }
    .page-layout {
      /* width: 890px;
      margin: 0 auto; */
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 50px;
    }
    .padding-left-20 {
      padding-left: 20px;
    }
    .profile__thumbnail_box {
      text-align: center;
      /* padding: 150px 0 60px; */
      width: 280px;
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
      font-size: 15px;
      .profile__form_text,
      .profile__form_input_box {
        display: none;
      }
      width: calc(100% - 280px);
      padding-left: 40px;
      border-left: 1px solid ${color.gray_border2};
      .profile__form_grid_item {
        /* &:not(:first-child) {
          margin-top: 15px;
        } */
      }
      .profile__form_text {
        display: block;
      }

      .profile__form_grid_item {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        line-height: 1.5;
        align-items: center;
        /* &:not(.align-items-no) {
          align-items: center;
        } */
      }
      .profile__form_label {
        position: relative;
        width: 180px;
        &.width-full {
          width: 100%;
        }
      }
      .profile__form_text {
        width: calc(100% - 180px);
        font-size: 14px;
      }
      .profile__form_input_box {
        width: calc(100% - 180px);
        &.width-full {
          width: 100%;
        }
      }
    }

    .profile__submit_box {
      margin-top: 60px;
      padding: 0 68px;
      .button {
        min-width: 100px;
        /* &:not(:first-child) {
          margin-left: 10px;
        } */
      }
      .profile__modify_btn {
        display: block;
        width: 260px;
        margin: 0 auto;
      }
    }
  `,
};
