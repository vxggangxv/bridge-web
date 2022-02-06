import React, { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect, NavLink, useParams, useLocation } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import { color } from 'styles/utils';
import { icon_face } from 'components/base/images';
import StarScore from 'components/common/score/StarScore';
import { Checkbox, FormControl, Select, TextField, MenuItem } from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import { BinActions, DesignerActions, UtilActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import cx from 'classnames';
import ImgCrop from 'components/common/images/ImgCrop';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import MuiButton from 'components/common/button/MuiButton';
import { inputNumber, setFormData } from 'lib/library';
import { DesignerContext } from './DesignerContext';
import MuiWrapper from 'components/common/input/MuiWrapper';
import DesignerProjectListContainer from './DesignerProjectListContainer';
import DesignerPortfolioContainer from './DesignerPortfolioContainer';
import UserPortfolioContainer from 'containers/user/UserPortfolioContainer';

export default function DesignerContainer() {
  const { uid } = useParams();
  const {
    profileData,
    fetchProfileSuccess,
    editProfileSuccess,
    supportCountryList,
    fetchSupportCountriesSuccess,
  } = useShallowSelector(state => ({
    profileData: state.designer.profile.data?.profileData,
    fetchProfileSuccess: state.designer.profile.success,
    editProfileSuccess: state.designer.editProfile.success,
    supportCountryList: state.util.supportCountries.data?.languageList,
    fetchSupportCountriesSuccess: state.util.supportCountries.success,
  }));
  // portfolio state
  const language = useInput([]);
  const rework = useInput('');
  const giveUpCount = useInput('');

  // changeDesigner: 1
  // company: "receiver company"
  // grade: 3
  // languageGroup: null
  // profileImg: null
  // rework: 3
  // visibility: 0
  // edit button action, edit 클릭 true, cancel 클릭 false
  const isEdit = useInput(null);
  // save action -> request fetch
  const isSave = useInput(false);
  const { deletePortfolio, portfolioFileList } = useContext(DesignerContext);

  // init
  useEffect(() => {
    UtilActions.fetch_support_countries_request();
    DesignerActions.fetch_profile_request({ userCode: uid });
  }, []);

  // init form state
  // onChange isEdit, false시 초기화
  useDidUpdateEffect(() => {
    if (profileData || (isEdit.value === false && profileData)) {
      rework.setValue(profileData.rework);
      giveUpCount.setValue(profileData.giveupCount);
      if (supportCountryList) {
        if (!profileData.languageGroup) return;
        let languageGroupValue = profileData.languageGroup.split(',');
        const languageValue = supportCountryList.reduce((acc, curr) => {
          if (languageGroupValue.includes(curr.language)) return acc.concat(curr.language_idx);
          return acc;
        }, []);
        language.setValue(languageValue);
      }
    }

    if (isEdit.value === false) {
      portfolioFileList.setValue([]);
    }
  }, [isEdit.value, profileData, supportCountryList]);

  // save action
  // TODO: success 이후 submitPortfolioData 초기하
  // deletePortfolio.setValue(new Set([]));
  // portfolioFileList.setValue([]);
  useDidUpdateEffect(() => {
    if (isSave.value) {
      isSave.setValue(false);

      // profile
      const submitProfileData = {
        languageGroup: language.value,
        rework: rework.value,
        // changeDesigner: changeDesigner.value,
      };
      console.log('submitProfileData', submitProfileData);
      DesignerActions.edit_profile_request(submitProfileData);

      // portfolio
      console.log('deletePortfolio.value', [...deletePortfolio.value]?.join('%'));
      const submitPortfolioData = {
        deletePortfolio: [...deletePortfolio.value]?.join('%'),
        files: {
          portfolio: portfolioFileList.value,
        },
      };
      console.log('submitPortfolioData', submitPortfolioData);
      BinActions.edit_portfolio_file_request(setFormData(submitPortfolioData));
    }
  }, [!!isSave.value, deletePortfolio.value, portfolioFileList.value]);

  // request save success
  // fetch profile, portfolio
  // TODO: 각각의 put 성공시 fetch
  useDidUpdateEffect(() => {
    if (editProfileSuccess) {
      DesignerActions.fetch_profile_request({ userCode: uid });
      DesignerActions.fetch_portfolio_request({ page: 1, userCode: uid });
    }
  }, [!!editProfileSuccess]);

  const { isFetchSuccess } = useFetchLoading({ fetchProfileSuccess });
  if (!isFetchSuccess) return null;
  return (
    <Designer
      profileData={profileData}
      isEdit={isEdit}
      isSave={isSave}
      supportCountryList={supportCountryList}
      language={language}
      rework={rework}
    />
  );
}

export const Designer = React.memo(function Designer({
  profileData,
  isEdit,
  isSave,
  supportCountryList,
  language,
  rework,
}) {
  const { userCode } = useShallowSelector(state => ({
    userCode: state.user.user?.userCode,
  }));
  const { uid } = useParams();
  const location = useLocation();
  const currentPathname = location.pathname.substr(1).split('/')[2];
  const isSelf = uid === userCode;

  // // cancel action -> initial
  // useDidUpdateEffect(() => {
  //   if (isCancel) {
  //     language
  //   }
  // }, [isCancel])

  // // onChange save
  // useDidUpdateEffect(() => {
  //   if (isSave.value) {
  //     // request put designer portfolio

  //   }
  // }, [!!isSave.value]);

  return (
    <Styled.Designer data-component-name="Designer" className="designer__container main-layout">
      <aside className="designerPortfolio__profile_aside">
        <h2 className="sr-only">디자이너 메뉴</h2>
        <div className="designerPortfolio__profile">
          <div className="designerPortfolio__profile_thumbnail_box">
            <figure className="designerPortfolio__profile_figure">
              {profileData.profileImg ? (
                <ImgCrop width={120} height={120} isCircle src={profileData.profileImg} />
              ) : (
                <img src={icon_face} art="face icon" />
              )}
            </figure>
            <p className="designerPortfolio__profile_name">{profileData.company}</p>
            <StarScore
              max={5}
              score={profileData.gradeAsDesigner}
              className="designerList__profile_score"
            />
          </div>

          <ul className="designerPortfolio__profile_info_list">
            <li className="designerPortfolio__profile_info_item language">
              <b>Language</b>
              {!isEdit.value ? (
                <span>{profileData.languageGroup}</span>
              ) : (
                <MuiWrapper className="language sm" isGlobalStyle={true}>
                  <FormControl fullWidth variant="outlined">
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
                      onChange={language.onChange}
                      renderValue={selected => {
                        if (selected.length === 0) {
                          return '';
                        }
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
              )}
            </li>
            <li className="designerPortfolio__profile_info_item rework">
              <b>Re-work</b>
              {!isEdit.value ? (
                <span>{profileData.rework || 0}</span>
              ) : (
                <MuiWrapper className="sm">
                  <TextField
                    className="radius-sm"
                    variant="outlined"
                    fullWidth
                    value={rework.value ? +rework.value : ''}
                    onChange={e => rework.onChange({ value: inputNumber(e.target.value) })}
                  />
                </MuiWrapper>
              )}
            </li>
            <li className="designerPortfolio__profile_info_item change">
              <b>Givp up</b>
              <span>{profileData.giveUpCount || 0}</span>
            </li>
          </ul>
          {isSelf && (
            <div className="designerPortfolio__edit_btn_box">
              {!isEdit.value ? (
                <MuiButton
                  disableElevation
                  variant="contained"
                  color="primary"
                  className="sm"
                  onClick={() => isEdit.setValue(true)}
                >
                  Edit
                </MuiButton>
              ) : (
                <>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="sm"
                    onClick={() => isEdit.setValue(false)}
                  >
                    Cancel
                  </MuiButton>
                  <MuiButton
                    disableElevation
                    variant="contained"
                    color="primary"
                    className="sm"
                    onClick={() => {
                      isSave.setValue(true);
                      isEdit.setValue(false);
                    }}
                  >
                    Save
                  </MuiButton>
                </>
              )}
            </div>
          )}
        </div>
        <div className="designer__menu">
          <ul className="designer__menu_list">
            <li className="designer__menu_item">
              <NavLink
                to={`${pageUrl.designer.index}/@${uid}/portfolio`}
                className={cx('designer__menu_link', { active: currentPathname === 'portfolio' })}
              >
                Portfolio
              </NavLink>
            </li>
            <li className="designer__menu_item">
              <NavLink
                to={`${pageUrl.designer.index}/@${uid}/projects`}
                className={cx('designer__menu_link', { active: currentPathname === 'projects' })}
              >
                Projects
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
      <div className="designer__content_container">
        <Switch>
          <Redirect exact path={pageUrl.designer.detail} to={pageUrl.designer.portfolio} />
          {useMemo(() => {
            return (
              <Route
                path={pageUrl.designer.portfolio}
                // component={() => <DesignerPortfolioContainer isEdit={isEdit.value} />}
                component={() => <UserPortfolioContainer isEdit={isEdit.value} />}
              />
            );
          }, [isEdit.value])}
          {useMemo(() => {
            return (
              <Route
                path={pageUrl.designer.project}
                component={() => <DesignerProjectListContainer />}
              />
            );
          }, [])}
          <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
        </Switch>
      </div>
    </Styled.Designer>
  );
});

const Styled = {
  Designer: styled.div`
    &.designer__container {
      display: flex;
      flex-wrap: wrap;
      margin-top: 100px;
    }
    .designerPortfolio__profile_aside {
      position: relative;
      width: 270px;
      .designerPortfolio__profile,
      .designer__menu {
        width: 100%;
        border: 1px solid ${color.gray_border2};
      }
      .designerPortfolio__profile {
        padding: 40px 20px 30px;
      }
      .designerPortfolio__profile_thumbnail_box {
        text-align: center;
        .designerPortfolio__profile_figure {
        }
        .designerPortfolio__profile_name {
          margin-top: 30px;
          font-weight: 700;
          font-size: 24px;
        }
        .designerList__profile_score {
          margin-top: 10px;
          justify-content: center;
        }
      }
      .designerPortfolio__profile_info_list {
        margin-top: 30px;
        .designerPortfolio__profile_info_item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          /* font-size: 16px; */
          border-bottom: 1px solid ${color.gray_border2};
          &:not(:first-child) {
            margin-top: 20px;
          }
          .muiWrapper {
            width: 140px;
            .form__input {
              font-size: 14px;
            }
          }
        }
      }
      .designerPortfolio__edit_btn_box {
        margin-top: 15px;
        text-align: right;
        .button {
          height: 30px;
          padding: 0 10px;
          & + .button {
            margin-left: 5px;
          }
        }
      }
      .designer__menu {
        margin-top: 10px;
        padding: 10px;
      }
      .designer__menu_list {
        .designer__menu_item {
          font-size: 18px;
          &:not(:first-child) {
            margin-top: 5px;
          }
        }
        .designer__menu_link {
          display: block;
          padding: 15px 20px;
          &.active {
            background-color: ${color.blue_week};
          }
          &:not(.active):hover {
            background-color: ${color.blue_week_hover};
          }
        }
      }
    }
  `,
  UserPortfolioContainer: styled.div``,
};
