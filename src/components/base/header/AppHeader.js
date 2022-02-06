import { Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import cx from 'classnames';
import {
  country_en,
  country_ko,
  icon_alarm,
  icon_teeth_circle,
  light_bridge,
  logo,
  logo_white,
} from 'components/base/images';
import ImgCrop from 'components/common/images/ImgCrop';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import { cutUrl, addCommas } from 'lib/library';
import { navigation, pageUrl } from 'lib/mapper';
import { ENV_MODE_DEV } from 'lib/setting';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { AuthActions, BaseActions, UserActions } from 'store/actionCreators';
import { isLogInSelector } from 'store/modules/auth';
import styled, { createGlobalStyle } from 'styled-components';
import { color, device } from 'styles/utils';
import queryString from 'query-string';
import storage from 'lib/storage';

function AppHeader() {
  const {
    language,
    user,
    overviewData,
    newEventsData,
    isLogIn,
    signInUrl,
    signInUrlSuccess,
    signUpUrl,
    signUpUrlSuccess,
  } = useShallowSelector(state => ({
    language: state.base.language,
    user: state.user.user,
    overviewData: state.user.overview.data,
    newEventsData: state.event.newEvents.data,
    isLogIn: isLogInSelector(state),
    signInUrl: state.auth.dofOauth2SignIn.data?.connectUrl,
    signInUrlSuccess: state.auth.dofOauth2SignIn.success,
    signUpUrl: state.auth.dofOauth2SignUp.data?.connectUrl,
    signUpUrlSuccess: state.auth.dofOauth2SignUp.success,
  }));
  const location = useLocation();
  const { pathname, search, state } = location;
  const isAuthPage = cutUrl(pathname) === 'auth';
  const isMainPage = cutUrl(pathname) === 'home';
  const isMyPage = cutUrl(pathname).includes('@');
  const newEventCount = newEventsData?.newEventCount;
  const profile = overviewData?.profile;
  const { t } = useTranslation();
  // const history = useHistory();
  // const langMenuRef = useRef(null);
  const [langMenuEl, setLangMenuEl] = useState(null);
  const [isOpenLangMenu, setIsOpenLangMenu] = useState(false);

  const queryParse = queryString.parse(search);
  const from = state?.hasOwnProperty('from') ? state.from : { pathname };
  // NOTE: ErrorContainer 에서 returnPath 넘겨줬을 경우, PrivateRoute에서 from을 넘겨줬을경우
  const returnPath = queryParse?.returnPath || from.pathname;

  const languageMenuList = [
    {
      index: 'ko',
      icon: country_ko,
    },
    {
      index: 'en',
      icon: country_en,
    },
  ];
  const selectedLanguage = useMemo(() => {
    return languageMenuList.find(item => item.index === language);
  }, [language]);

  // test
  useEffect(() => {
    console.log('location', location);
  }, [location]);

  // SECTION: method
  const handleClickLangMenu = e => setLangMenuEl(e.currentTarget);
  const handleCloseLangMenu = () => setLangMenuEl(null);

  const handleChangeTranslation = language => {
    BaseActions.change_language(language);
    handleCloseLangMenu();
  };

  const onOauth2Service = service => {
    const submitData = {
      return_url: window.location.protocol + '//' + window.location.host + '/home',
      failure_url: window.location.protocol + '//' + window.location.host + '/home',
    };
    storage.set('returnPath', returnPath);
    if (service === 'signIn') {
      AuthActions.dof_oauth2_signin_request(submitData);
    }
    if (service === 'signUp') {
      AuthActions.dof_oauth2_signup_request(submitData);
    }
  };

  useDidUpdateEffect(() => {
    if (signInUrlSuccess) {
      window.location.href = signInUrl;
    }
  }, [signInUrlSuccess === true]);

  useDidUpdateEffect(() => {
    if (signUpUrlSuccess) {
      window.location.href = signUpUrl;
    }
  }, [signUpUrlSuccess === true]);

  return (
    <Styled.AppHeader data-component-name="AppHeader" darkTheme={isMyPage} isMainPage={isMainPage}>
      <header className={cx('header', { auth: isAuthPage })}>
        <div className={cx('header__in_wrapper', { default: true })}>
          <h1 className="header__logo_box">
            <Link to="/">
              {isMyPage ? (
                <img src={logo_white} alt="Logo" className="header__logo" />
              ) : (
                <img src={logo} alt="Logo" className="header__logo" />
              )}
              <span className="sr-only">DOF Bridge</span>
            </Link>
          </h1>

          <div className="header__menu_box">
            {!isAuthPage && isLogIn && (
              <nav className="header__main_menu">
                <h1 className="sr-only">메인 메뉴</h1>
                <ul className="header__menu_list main">
                  {navigation.map((item, idx) => (
                    <li
                      key={idx}
                      className={cx('header__menu_item main_item', {
                        active: pathname === item.path,
                      })}
                    >
                      <NavLink to={item.path} className="header__menu_link">
                        {/* {item.text} */}
                        {t(`APP_HEADER_MENU_${item.index}`)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="header__auth_menu">
              <ul className="header__menu_list auth">
                {isLogIn ? (
                  <>
                    {ENV_MODE_DEV && (
                      <li
                        className={cx('header__menu_item logout_item', {
                          active: pathname === pageUrl.auth.signOut,
                        })}
                      >
                        <NavLink to={pageUrl.auth.signOut} className="header__menu_link">
                          <T>GLOBAL_LOGOUT</T>
                        </NavLink>
                      </li>
                    )}
                    <li className="header__menu_item notification_item">
                      <NavLink to={`/@${user?.userCode}/notifications`}>
                        <div className={cx('icon_box', { count: !!newEventCount })}>
                          {newEventCount > 0 ? (
                            <>
                              <img src={icon_alarm} alt="alarm" />
                              {/* <NotificationsIcon htmlColor={color.red} />
                              <span>{newEventCount}</span> */}
                            </>
                          ) : (
                            <img src={icon_alarm} alt="alarm" />
                            // <NotificationsIcon htmlColor="#777" />
                          )}
                        </div>
                      </NavLink>
                    </li>
                    <li className="header__menu_item account_item">
                      <NavLink to={`/@${user?.userCode}`}>
                        {user?.profileImg ? (
                          <ImgCrop width={40} isCircle src={user.profileImg} />
                        ) : (
                          <img src={icon_teeth_circle} alt="account" />
                          // <img src={icon_account} alt="account" />
                        )}
                      </NavLink>
                    </li>
                    {/* <li className="header__menu_item point_item">{profile?.currentPoint || 0}p</li> */}
                    <li className="header__menu_item point_item">
                      <NavLink to={`/@${user?.userCode}/order/point-history`}>
                        {!!profile?.currentPoint ? addCommas(Number(profile?.currentPoint)) : 0}p
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    {/* {process.env.NODE_ENV === 'development' && (
                      <>
                      <li className="header__menu_item">
                      
                      <NavLink to={pageUrl.auth.signIn} className="header__menu_link sign_in">
                      <T>GLOBAL_LOGIN</T>(기존)
                      </NavLink>
                      </li>
                      <li className="header__menu_item">
                      <NavLink to={pageUrl.auth.signUp} className="header__menu_link sign_up">
                      <T>GLOBAL_SIGNUP</T>(기존)
                      </NavLink>
                      
                      </li>
                      </>
                    )} */}
                    {isMainPage && (
                      <li className={cx('header__menu_item howto_item')}>
                        <NavLink to={pageUrl.howto.index} className=" header__menu_link howto">
                          <img src={light_bridge} alt="light" />
                          <T>APP_HEADER_MENU_0</T> Bridge
                        </NavLink>
                      </li>
                    )}
                    <li className={cx('header__menu_item oauth_item sign_in')}>
                      <div
                        className=" header__menu_link oauth sign_in"
                        onClick={() => onOauth2Service('signIn')}
                      >
                        <T>GLOBAL_LOGIN</T>
                      </div>
                    </li>
                    <li className={cx('header__menu_item oauth_item')}>
                      <div
                        className="header__menu_link oauth sign_up"
                        onClick={() => onOauth2Service('signUp')}
                      >
                        <T>GLOBAL_SIGNUP</T>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="header__lang_box">
              {/* <span className="header__lang_item en" onClick={() => handleChangeTranslation('en')}>
              EN
            </span>

            <span className="header__lang_item ko" onClick={() => handleChangeTranslation('ko')}>
              KR
            </span> */}
              <button
                aria-controls={'languageMenuList'}
                aria-haspopup="true"
                onClick={handleClickLangMenu}
                // onMouseOver={handleClickLangMenu}
                className="btn-reset header__lang_btn cursor-pointer"
              >
                <img src={selectedLanguage.icon} alt="country" />
                {!langMenuEl ? (
                  <ArrowDropDownIcon htmlColor="#BCBCBC" />
                ) : (
                  <ArrowDropUpIcon htmlColor="#BCBCBC" />
                )}
              </button>
              <Menu
                id="languageMenuList"
                anchorEl={langMenuEl}
                keepMounted
                open={Boolean(langMenuEl)}
                onClose={handleCloseLangMenu}
                // elevation={0}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {languageMenuList.map((item, idx) => (
                  <MenuItem
                    key={idx}
                    onClick={() => handleChangeTranslation(item.index)}
                    className="header__lang_menu_item"
                  >
                    <img src={item.icon} alt="country" />{' '}
                    <CustomSpan marginLeft={5} fontColor="#B5B7C1">
                      {item.index}
                    </CustomSpan>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </div>
      </header>

      <GLobalStyles />
    </Styled.AppHeader>
  );
}

const GLobalStyles = createGlobalStyle`
  /* .MuiListItem-root.Mui-focusVisible {
    background-color: initial !important;
  } */
  .MuiListItem-root.Mui-focusVisible,
  #languageMenuList .header__lang_menu_item:hover {
    background-color: rgba(0, 0, 0, 0.04) !important;
    & span {
      color: ${color.blue};
    }
  }
`;

const Styled = {
  AppHeader: styled.div`
    position: relative;
    z-index: 11;
    &,
    .header,
    .header__in_wrapper {
      height: 90px;
      position: relative;
    }
    .header {
      /* position: fixed;
      top: 0;
      left: 0; */
      /* display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 90px; */
      width: 100%;
      background-color: ${({ darkTheme }) => (darkTheme ? color.navy : 'white')};
      /* box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.065); */
      box-shadow: 0 0px 10px rgba(0, 0, 0, 0.12);
      box-shadow: ${({ isMainPage }) => isMainPage && '0 3px 6px rgba(0, 0, 0, 0.16)'};
      text-align: center;
      &.main,
      &.auth {
        box-shadow: none;
      }
      &.main {
        top: 30px;
        background: none;
        .header__logo {
          width: 268px;
        }
      }

      > * {
        /* position: relative;
        top: 3px; */
      }
      .header__logo {
        width: 164px;
      }
    }
    .header__in_wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${({ darkTheme }) => darkTheme && 'white'};

      &.default {
        width: ${`${device.lg}px`};
        padding: 0 ${`${device.lgPadding}px`};
        margin: 0 auto;
      }
      &.main {
        padding: 0 90px;
      }

      @media (max-width: ${`${device.lg}px`}) {
        &.default {
          width: 100%;
        }
      }
    }
    .header__menu_box {
      text-align: center;
      display: flex;
      align-items: center;
      .header__main_menu {
        position: relative;
      }
      .header__menu_list {
        display: flex;
        align-items: center;

        &.main {
          margin-right: 25px;
        }

        .header__menu_item {
          position: relative;

          &.oauth_item,
          &.main_item {
            &:not(:first-of-type):not(.sign_in):after {
              content: '';
              position: absolute;
              top: 10%;
              left: 0;
              margin-top: 1px;
              height: 80%;
              border-left: 1px solid #000000;
              border-left-color: ${({ darkTheme }) => darkTheme && 'white'};
            }
          }
          &.oauth_item {
            padding: 0 15px;
          }
          &.main_item {
            padding: 0 20px;
          }

          &.logout_item {
            margin-right: 15px;
          }
          &.notification_item {
            /* margin-left: 60px; */
            .icon_box {
              position: relative;
              &.count {
                &:after {
                  content: '';
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  position: absolute;
                  top: 0px;
                  right: -2px;
                  font-size: 9px;
                  color: #fff;
                  background-color: ${color.blue};
                }
              }
              span {
                position: absolute;
                top: -12px;
                left: 50%;
                transform: translate(-50%, 0);
                color: ${color.red};
                font-size: 12px;
              }
            }
          }
          &.account_item {
            margin-left: 25px;
          }
          &.howto_item {
            margin-right: 15px;
          }
          &.oauth_item {
            &:last-child {
              padding-right: 0;
            }
          }
          &.point_item {
            margin-left: 10px;
            font-size: 15px;
            color: ${color.blue};
            font-weight: 500;
          }

          .header__menu_link {
            font-size: 15px;
            /* font-weight: 700; */
            &.active:not(.sign_up):not(.sign_in) {
              /* text-decoration: underline; */
              color: ${color.blue};
            }
            &.sign_in,
            &.sign_up {
              cursor: pointer;
            }
            &.sign_in {
            }
            &.sign_up {
            }
            &.howto {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 200px;
              height: 38px;
              background: rgb(0, 166, 226);
              background: linear-gradient(
                90deg,
                rgba(0, 166, 226, 1) 0%,
                rgba(44, 65, 151, 1) 100%
              );
              border-radius: 20px;
              box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.27);
              color: white;
              img {
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
    .header__lang_box {
      margin-left: 25px;

      .header__lang_btn {
        padding: 5px 0;
        padding-left: 1px;
        svg {
          margin-right: -4px;
        }
      }
      .header__lang_item {
        display: inline-block;
        padding: 0 5px;
        height: 100%;
        font-size: 10px;
        &.en {
          /* width: 1px;
          background-color: #000000; */
          border-right: 1px solid #000;
          border-right-color: ${({ darkTheme }) => darkTheme && 'white'};
        }
        &:hover {
          cursor: pointer;
          color: ${color.blue};
        }
      }
    }
  `,
};

export default AppHeader;
