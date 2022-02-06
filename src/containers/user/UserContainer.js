import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Switch,
  Route,
  Redirect,
  Link,
  useLocation,
  NavLink,
  useHistory,
  useParams,
} from 'react-router-dom';
import AppTemplate from 'components/base/template/AppTemplate';
import { pageUrl } from 'lib/mapper';
import OverviewContainer from 'containers/user/OverviewContainer';
import UserProfileContainer from 'containers/user/UserProfileContainer';
import UserProjectListContainer from 'containers/user/UserProjectListContainer';
import PointHistoryContainer from 'containers/user/PointHistoryContainer';
import NotificationsContainer from 'containers/user/NotificationsContainer';
import UserQnaContainer from 'containers/user/UserQnaContainer';
import HistoryContainer from 'containers/order/HistoryContainer';
import ExchangeContainer from 'containers/order/ExchangeContainer';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { Grid } from '@material-ui/core';
import CustomSpan from 'components/common/text/CustomSpan';
import { color, paper, paperSubtitle } from 'styles/utils';
import DollarIcon from 'components/base/icons/DollarIcon';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { PointActions } from 'store/actionCreators';
import { useShallowSelector } from 'lib/utils';
import cx from 'classnames';
import useImmerInput from 'lib/hooks/useImmerInput';
import UserPortfolioContainer from './UserPortfolioContainer';
import { cutUrl } from 'lib/library';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default function UserContainer(props) {
  const { currentPoint } = useShallowSelector(state => ({
    currentPoint: state.point.status.data?.pointStatus?.currentPoint,
  }));

  // SECTION: init
  useEffect(() => {
    // PointActions.fetch_status_request();
  }, []);

  return <User currentPoint={currentPoint} />;
}

export const User = React.memo(({ currentPoint }) => {
  const {
    userCompany,
    //  userCode
    isDeisgner,
  } = useShallowSelector(state => ({
    // userCode: state.user.user?.userCode,
    userCompany: state.user.user?.company,
    isDeisgner: state.user.user?.type?.designer,
  }));
  const { uid } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.log('isDeisgner ___ ', !!isDeisgner);
  }, []);

  // active - arrow 회전, hasChildren - menu의 path 반응하도록, add current
  const userNavigationValue = [
    {
      index: 'overview',
      path: `/@${uid}`,
      // text: `My Bridge`,
      text: `${t('USER_MENU_MYBRIDGE')}`,
      active: false,
    },
    {
      index: 'profile',
      path: `/@${uid}/profile`,
      // text: `Information`,
      text: `${t('USER_MENU_INFORMATION')}`,
      active: false,
    },
    // {
    //   index: 'portfolio',
    //   path: `/@${uid}/portfolio`,
    //   // text: `Portfolio`,
    //   text: `${t('USER_MENU_PORTFOLIO')}`,
    //   active: false,
    // },
    // {
    //   index: 'projects',
    //   path: `/@${uid}/projects`,
    //   // text: `Projects`,
    //   text: `${t('USER_MENU_PROJECTS')}`,
    //   active: false,
    //   menu: [
    //     {
    //       path: `/@${uid}/projects/made-project`,
    //       // text: `Made Project`,
    //       text: `${t('USER_MENU_PROJECTS_MAKE')}`,
    //     },
    //     {
    //       path: `/@${uid}/projects/applied-project`,
    //       // text: `Applied Project`,
    //       text: `${t('USER_MENU_PROJECTS_FIND')}`,
    //     },
    //   ],
    // },
    {
      index: 'order',
      path: `/@${uid}/order/point-history`,
      // text: `Information`,
      text: `${t('USER_MENU_POINT')}`,
      active: false,
    },
    // {
    //   index: 'order',
    //   path: `/@${uid}/order`,
    //   // text: `Point`,
    //   text: `${t('USER_MENU_POINT')}`,
    //   active: false,
    //   // hasChildren: true,
    //   menu: [
    //     {
    //       path: `/@${uid}/order/exchange`,
    //       // text: `Exchange`,
    //       text: `${t('USER_MENU_POINT_EXCHANGE')}`,
    //     },
    //     {
    //       path: `/@${uid}/order/point-history`,
    //       // text: `History`,
    //       text: `${t('USER_MENU_POINT_HISTORY')}`,
    //     },
    //     // {
    //     //   path: `/@${uid}/order/store`,
    //     //   // text: `Store`,
    //     //   text: `${t('USER_MENU_POINT_STORE')}`,
    //     // },
    //   ],
    // },
    {
      index: 'notifications',
      path: `/@${uid}/notifications`,
      // text: 'Notification',
      text: `${t('USER_MENU_NOTIFICATIONS')}`,
      active: false,
    },
    {
      index: 'qnas',
      path: `/@${uid}/qnas`,
      // text: 'Q&A',
      text: `${t('USER_MENU_QNA')}`,
      active: false,
      // hasChildren: true,
    },
    {
      index: 'signOut',
      path: pageUrl.auth.signOut,
      // text: 'logout',
      text: `${t('GLOBAL_LOGOUT')}`,
      active: false,
    },
  ];

  const userNavigationValueIncludeDesigner = [
    {
      index: 'overview',
      path: `/@${uid}`,
      // text: `My Bridge`,
      text: `${t('USER_MENU_MYBRIDGE')}`,
      active: false,
    },
    {
      index: 'profile',
      path: `/@${uid}/profile`,
      // text: `Information`,
      text: `${t('USER_MENU_INFORMATION')}`,
      active: false,
    },
    // {
    //   index: 'portfolio',
    //   path: `/@${uid}/portfolio`,
    //   // text: `Portfolio`,
    //   text: `${t('USER_MENU_PORTFOLIO')}`,
    //   active: false,
    // },
    // {
    //   index: 'projects',
    //   path: `/@${uid}/projects`,
    //   // text: `Projects`,
    //   text: `${t('USER_MENU_PROJECTS')}`,
    //   active: false,
    //   menu: [
    //     {
    //       path: `/@${uid}/projects/made-project`,
    //       // text: `Made Project`,
    //       text: `${t('USER_MENU_PROJECTS_MAKE')}`,
    //     },
    //     {
    //       path: `/@${uid}/projects/applied-project`,
    //       // text: `Applied Project`,
    //       text: `${t('USER_MENU_PROJECTS_FIND')}`,
    //     },
    //   ],
    // },
    // {
    //   index: 'order',
    //   path: `/@${uid}/order/point-history`,
    //   // text: `Information`,
    //   text: `${t('USER_MENU_POINT')}`,
    //   active: false,
    // },
    {
      index: 'order',
      path: `/@${uid}/order`,
      // text: `Point`,
      text: `${t('USER_MENU_POINT')}`,
      active: false,
      // hasChildren: true,
      menu: [
        {
          path: `/@${uid}/order/exchange`,
          // text: `Exchange`,
          text: `${t('USER_MENU_POINT_EXCHANGE')}`,
        },
        {
          path: `/@${uid}/order/point-history`,
          // text: `History`,
          text: `${t('USER_MENU_POINT_HISTORY')}`,
        },
        // {
        //   path: `/@${uid}/order/store`,
        //   // text: `Store`,
        //   text: `${t('USER_MENU_POINT_STORE')}`,
        // },
      ],
    },
    {
      index: 'notifications',
      path: `/@${uid}/notifications`,
      // text: 'Notification',
      text: `${t('USER_MENU_NOTIFICATIONS')}`,
      active: false,
    },
    {
      index: 'qnas',
      path: `/@${uid}/qnas`,
      // text: 'Q&A',
      text: `${t('USER_MENU_QNA')}`,
      active: false,
      // hasChildren: true,
    },
    {
      index: 'signOut',
      path: pageUrl.auth.signOut,
      // text: 'logout',
      text: `${t('GLOBAL_LOGOUT')}`,
      active: false,
    },
  ];
  const userNavigation = useImmerInput(
    !!isDeisgner ? userNavigationValueIncludeDesigner : userNavigationValue,
  );

  // SECTION: init
  // router active
  useEffect(() => {
    userNavigation.setValue(draft => {
      const idx = draft.findIndex(item => item.path.includes(cutUrl(pathname, 1)));
      // console.log('idx', idx);
      if (idx !== -1 && !!draft[idx].menu) {
        draft[idx].active = true;
      }
    });
  }, [pathname]);

  // console.log(userNavigation[3].menu.length);
  // console.log(userNavigation[3].menu);

  return (
    <Styled.User data-component-name="User">
      <div className="user__content_title_box main-layout">
        <h2 className="user__content_title">
          <T>USER_WELCOME</T>,&nbsp;
          {/* <CustomSpan fontColor={color.blue}>DOF_Designer</CustomSpan> */}
          <CustomSpan fontColor={color.blue}>{userCompany}</CustomSpan>
        </h2>
        {/* <Link to={`/@${uid}/order/point-history`} className="user__point">
          <DollarIcon width={24} color={color.blue} />
          <CustomSpan fontColor={color.blue} marginRight={5}>
            {currentPoint}
          </CustomSpan>
          point
          <ArrowForwardIosRoundedIcon className="user__point_arrow" />
        </Link> */}
      </div>

      {/* <NavLink to={item.path} className="user__menu_link"> */}
      <div className="user__content_grid_container">
        <aside className="user__menu_contaienr box-shadow-default">
          <h3 className="user__menu_title">
            <T>USER_MY_PAGE</T>
          </h3>
          <ul className="user__menu_list">
            {userNavigation.value.map((item, idx) => {
              console.log('item.path.includes(pathname)', item.path.includes(pathname));

              return (
                <li
                  key={idx}
                  className={cx('user__menu_item', {
                    // cutUrl적용
                    active: !!item.menu && item.path.includes(pathname),
                    current:
                      (!item.menu && item.path === pathname) ||
                      (item.hasChildren && pathname.includes(item.path)),
                    logout: item.index === 'signOut',
                  })}
                >
                  <>
                    <a
                      onClick={e => {
                        if (!item.menu) {
                          history.push(item.path);
                          userNavigation.setValue(draft => {
                            draft.map((navItem, navItemIdx) => {
                              navItem.active = false;
                            });
                          });
                        }
                        // TODO: submenu 있을 경우 active clas추가 -> arrow rotate
                        if (!!item.menu) {
                          userNavigation.setValue(draft => {
                            draft.map((navItem, navItemIdx) => {
                              if (idx !== navItemIdx) {
                                navItem.active = false;
                              } else {
                                navItem.active = !navItem.active;
                              }
                            });
                          });
                        }
                      }}
                      className="user__menu_link cursor-pointer"
                    >
                      {item.text}
                      {/* // TODO: submenu 있을 경우 arrow변경 에 따른 arrow표시 */}
                      <ArrowForwardIosRoundedIcon
                        htmlColor="inherit"
                        // className={cx('user__menu_link_arrow right', { active: item.active })}
                        className={cx('user__menu_link_arrow right', {
                          active: item.active,
                          current:
                            (!item.menu && item.path === pathname) ||
                            (item.hasChildren && pathname.includes(item.path)),
                        })}
                      />
                    </a>
                    {!!item.menu?.length && (
                      <ul className={cx('user__submenu_list', { active: item.active })}>
                        {item.menu.map((menu, menuIdx) => {
                          console.log('item menu menu ====> ', menu);
                          return (
                            <li
                              key={menuIdx}
                              className={cx('user__submenu_item', {
                                current:
                                  menu.path === pathname ||
                                  (menu.hasChildren && pathname.includes(menu.path)),
                              })}
                            >
                              <NavLink to={menu.path} className="user__submenu_link">
                                {menu.text}
                                <ArrowForwardIosRoundedIcon
                                  htmlColor="inherit"
                                  className={cx('user__menu_link_arrow right', {
                                    current: pathname.includes(menu.path),
                                  })}
                                />
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="user__main_container">
          <h1 className="sr-only">My page Contents</h1>
          <Switch>
            <Route exact path={pageUrl.user.index} component={OverviewContainer} />
            <Route path={pageUrl.user.profile} component={UserProfileContainer} />
            <Route path={pageUrl.user.portfolio} component={UserPortfolioContainer} />
            {/* <Route path={pageUrl.user.project} component={UserProjectListContainer} /> */}
            <Route path={pageUrl.user.projectByClient} component={UserProjectListContainer} />
            <Route path={pageUrl.user.projectByDesigner} component={UserProjectListContainer} />
            <Route path={pageUrl.user.exchange} component={ExchangeContainer} />
            <Route path={pageUrl.user.history} component={HistoryContainer} />
            {/* <Route path={pageUrl.user.history} component={PointHistoryContainer} /> */}
            <Route path={pageUrl.user.notifications} component={NotificationsContainer} />
            <Route path={pageUrl.user.qna} component={UserQnaContainer} />
            <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
          </Switch>
        </section>
      </div>
    </Styled.User>
  );
});

const Styled = {
  User: styled.div`
    .user__content_title_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 65px;
      padding-bottom: 30px;
      .user__content_title {
        /* ${paperSubtitle}; */
        padding-bottom: 0;
        font-size: 25px;
      }
      .user__point {
        display: inline-flex;
        align-items: center;
        font-size: 25px;
        > :first-child {
          margin-right: 10px;
        }
        > :last-child {
          margin-left: 10px;
        }
        .user__point_arrow {
          font-size: 18px;
          color: ${color.black_font};
        }
      }
    }
    .user__content_grid_container {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 1280px;
      margin: 0 auto;
    }
    .user__menu_contaienr,
    .user__main_container {
      /* border: 1px solid #ddd; */
    }

    .user__menu_contaienr {
      /* width: 290px; */
      width: 325px;
      border-radius: 10px;
      .user__menu_title {
        display: flex;
        align-items: center;
        padding-left: 25px;
        height: 60px;
        border-bottom: 4px solid ${color.blue};
        color: ${color.blue};
        font-size: 19px;
        font-weight: 500;
      }
      .user__menu_list {
        user-select: none;
        .user__submenu_link,
        .user__menu_link {
          display: block;
          padding: 15px 25px;
          /* font-size: 18px; */
          font-size: 16px;
          text-transform: capitalize;
          display: flex;

          justify-content: space-between;
        }
        .user__menu_link {
        }
        .user__menu_link_arrow {
          position: relative;
          right: -7px;
          font-size: 16px;
          /* font-size: 18px; */
          /* color: ${color.black_font}; */
          visibility: hidden;
          &.active {
            transform: rotate(90deg);
            visibility: visible;
          }
          &.current {
            visibility: visible;
          }
        }
        .user__menu_item {
          color: ${color.black_font};
          &.logout {
            color: ${color.gray_font2};
            .user__menu_link_arrow {
              color: ${color.gray_font2};
            }
          }
          .user__menu_link {
            &:hover {
              color: ${color.blue};
            }
          }
        }
        .user__submenu_list {
          width: 100%;
          display: none;
          &.active {
            display: block;
          }
          .user__submenu_link {
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 50px;
            font-size: 16px;
            &:hover {
              color: ${color.blue};
            }
          }
        }
        .user__submenu_item,
        .user__menu_item {
          &.current {
            > a {
              background-color: #e5f7ff;
            }
          }
        }
      }
    }

    .user__main_container {
      ${paper};
      width: 940px;
      min-height: 586px;
      padding-top: 47px;
    }
  `,
};
