import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect, NavLink, useParams, useLocation } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import { color } from 'styles/utils';
import { icon_face } from 'components/base/images';
import StarScore from 'components/common/score/StarScore';
import { DesignerActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import cx from 'classnames';
import ImgCrop from 'components/common/images/ImgCrop';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import DesignerProjectListContainer from './DesignerProjectListContainer';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { icon_bulb } from 'components/base/images';
import UserPortfolioContainer from 'containers/user/UserPortfolioContainer';
import T from 'components/common/text/T';

export default function DesignerContainer() {
  const { uid } = useParams();
  const { profileData, fetchProfileSuccess } = useShallowSelector(state => ({
    profileData: state.designer.profile.data?.profileData,
    fetchProfileSuccess: state.designer.profile.success,
  }));

  // init
  useEffect(() => {
    DesignerActions.fetch_profile_request({ userCode: uid });
  }, []);

  const { isFetchSuccess } = useFetchLoading({ fetchProfileSuccess });
  if (!isFetchSuccess) return null;
  return <Designer profileData={profileData} />;
}

export const Designer = React.memo(function Designer({ profileData }) {
  const { userCode } = useShallowSelector(state => ({
    userCode: state.user.user?.userCode,
  }));
  const { uid } = useParams();
  const location = useLocation();
  const currentPathname = location.pathname.substr(1).split('/')[2];

  return (
    <Styled.Designer data-component-name="Designer" className="designer__container main-layout">
      <div className="designer__container_header">
        <div className="designer__container_header_icon_wrapper">
          <img src={icon_bulb} />
        </div>
        <div className="designer__container_header_comment">
          <T>DESIGNER_FIND_PARTNERS</T>
        </div>
      </div>
      <aside className="designer__profile_aside">
        <h2 className="sr-only">디자이너 메뉴</h2>
        <div className="designer__profile box-shadow-default">
          <div className="designer__profile_thumbnail_box">
            <figure className="designer__profile_figure">
              {profileData.profileImg ? (
                <ImgCrop width={82} height={82} isCircle src={profileData.profileImg} />
              ) : (
                <img src={icon_face} art="face icon" />
              )}
            </figure>
            <p className="designer__profile_name">{profileData.company}</p>
            <StarScore
              max={5}
              hideText={true}
              size={13}
              score={profileData.gradeAsDesigner}
              className="designer__profile_score"
            />
          </div>

          <div className="designer__profile_info_list">
            <div className="designer__profile_info_item language">
              <div className="designer__profile_info_item_label">
                <T>GLOBAL_LANGUAGE</T>
              </div>
              <div className="designer__profile_info_item_contents">
                {profileData.languageGroup}
              </div>
            </div>
            <div className="designer__profile_info_item rework">
              <div className="designer__profile_info_item_label">
                <T>DESIGNER_REWORK</T>
              </div>
              <div className="designer__profile_info_item_contents">
                {profileData.rework || 0}(<T>GLOBAL_TIMES</T>)
              </div>
            </div>
            <div className="designer__profile_info_item change">
              <div className="designer__profile_info_item_label">
                <T>DESIGNER_DROPPED</T>
              </div>
              <div className="designer__profile_info_item_contents">
                {profileData.giveUpCount || 0}(<T>GLOBAL_TIMES</T>)
              </div>
            </div>
          </div>
        </div>
        <div className="designer__menu box-shadow-default">
          <ul className="designer__menu_list">
            <li className="designer__menu_item">
              <NavLink
                to={`${pageUrl.designer.index}/@${uid}/portfolio`}
                className={cx('designer__menu_link', { active: currentPathname === 'portfolio' })}
              >
                <T>GLOBAL_PORTFOLIO</T>
                <ArrowForwardIosRoundedIcon className={cx('designer__menu_arrow')} />
              </NavLink>
            </li>
            <li className="designer__menu_item">
              <NavLink
                to={`${pageUrl.designer.index}/@${uid}/projects`}
                className={cx('designer__menu_link', { active: currentPathname === 'projects' })}
              >
                <T>GLOBAL_PROJECT</T>
                <ArrowForwardIosRoundedIcon className={cx('designer__menu_arrow')} />
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
                component={() => <UserPortfolioContainer isHiddenEdit={true} padding={20} />}
              />
            );
          }, [])}
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
    .designer__container_header {
      height: 170px;
      width: 100%;
      display: flex;
      align-items: center;
      .designer__container_header_icon_wrapper {
        width: 60px;
        display: flex;
        justify-content:center;
        align-items: center;
        img {
          width: 34px;
          height: 48px;
        }
      }
      .designer__container_header_comment {
        color: ${color.white};
        font-size: 27px;
      }
    }
    &.designer__container {
      display: flex;
      flex-wrap: wrap;

    }
    .designer__profile_aside {
      position: relative;
      width: 290px;
      .designer__profile,
      .designer__menu {
        background-color: ${color.white};
        width: 100%;
        border: 1px solid ${color.gray_border2};
        border-radius: 10px;
      }
      .designer__profile {
        /* width: 290px; */
        padding: 40px 30px 35px;
      }
      .designer__profile_thumbnail_box {
        text-align: center;
        .designer__profile_figure {
          img {
            width: 82px;
            height: 82px;
          }
        }
        .designer__profile_name {
          margin-top: 15px;
          /* font-weight: 700; */
          font-size: 15px;
        }
        .designer__profile_score {
          margin-top: 10px;
          justify-content: center;
        }
      }
      .designer__profile_info_list {
        margin-top: 25px;
        .designer__profile_info_item {
          display: flex;
          /* margin-top: 10px; */
          padding-top: 15px;
            font-size: 15px;
          .designer__profile_info_item_label {
            width: 100%;
          }
          .designer__profile_info_item_contents {
            width: 100%;
            /* text-align: center; */
          }
        }
      }
      
      .designer__menu {
        margin-top: 10px;
        padding: 20px 0;
      }
      .designer__menu_list {
        .designer__menu_item {
          font-size: 18px;
          &:not(:first-child) {
            margin-top: 5px;
          }
        }
        .designer__menu_link {
          /* display: block; */
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          &.active {
            /* background-color: ${color.blue_week}; */
            background-color: #E5F7FF;
          }
          &:not(.active):hover {
            background-color: ${color.blue_week_hover};
          }

        }
      }
      .designer__menu_arrow {
        font-size: 18px;
      }
    }

    .designer__content_container {
      margin-left: 20px;
      position: relative;
      background-color: ${color.white};
      border-radius: 10px;
      box-shadow: 0 0 10px rgb(0 0 0 / 13%);
      padding: 40px 0;
      width: 970px;
      min-height: 586px;
      /* height: 740px; */
      padding-top: 47px;
    }
  `,
};
