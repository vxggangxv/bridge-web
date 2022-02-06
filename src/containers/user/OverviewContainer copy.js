import { Grid } from '@material-ui/core';
import React, { useEffect, useMemo, Fragment } from 'react';
import styled from 'styled-components';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { icon_calendar, icon_face, icon_user } from 'components/base/images';
import StarScore from 'components/common/score/StarScore';
import { color, flexCenter, font } from 'styles/utils';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { Link, useHistory } from 'react-router-dom';
import MuiButton from 'components/common/button/MuiButton';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import LineChart from 'components/common/chart/LineChart';
import { pageUrl, project } from 'lib/mapper';
import { UserActions } from 'store/actionCreators';
import { useShallowSelector, useDidUpdateEffect } from 'lib/utils';
import ImgCrop from 'components/common/images/ImgCrop';
import _ from 'lodash';
import T from 'components/common/text/T';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { projectChartItemConverter } from 'lib/library';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import DateConverter from 'components/common/convert/DateConverter';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

export default function OverviewContainer() {
  const {
    overviewData,
    fetchOveviewSuccess,
    resentProjectsData,
    fetchResentProjectsSuccess,
  } = useShallowSelector(state => ({
    overviewData: state.user.overview.data,
    fetchOveviewSuccess: state.user.overview.success,
    resentProjectsData: state.user.resentProjects.data,
    fetchResentProjectsSuccess: state.user.resentProjects.success,
  }));
  const profile = overviewData?.profile;
  const resentProjectAsClient = overviewData?.resentProjectAsClient;
  const resentProjectAsDesigner = overviewData?.resentProjectAsDesigner;
  const projectGraphAsClient = resentProjectsData?.projectGraphAsClient;
  const projectGraphAsDesigner = resentProjectsData?.projectGraphAsDesigner;
  // 1: matching, 2: working, 3: done, 4: complete
  const checkStage = useCheckSetInput(new Set(['matching']));
  // 10Y, 1Y, 1M, 1W
  const duration = useInput('1W');

  const matchingChartItems = useInput([]);
  const workingChartItems = useInput([]);
  const doneChartItems = useInput([]);
  const completeChartItems = useInput([]);
  const matchingChartItems2 = useInput([]);
  const workingChartItems2 = useInput([]);
  const doneChartItems2 = useInput([]);
  const completeChartItems2 = useInput([]);

  let submitParams = useMemo(
    () => ({
      projectDuration: duration.value,
    }),
    [duration.value],
  );

  useEffect(() => {
    console.log('duration', duration.value);
  }, [duration.value]);

  // SECTION: init
  useEffect(() => {
    UserActions.fetch_overview_request();
    UserActions.fetch_resent_projects_request(submitParams);
  }, []);

  // SECTION: onChange submit
  useDidUpdateEffect(() => {
    UserActions.fetch_resent_projects_request(submitParams);
  }, [submitParams]);

  // SECTION: init data mapping, onChange chart data mapping
  useEffect(() => {
    console.log('matchingChartItems', matchingChartItems.value);
    console.log('workingChartItems', workingChartItems.value);
    console.log('doneChartItems', doneChartItems.value);
    console.log('completeChartItems', completeChartItems.value);
    // matchingChartItems.setValue([]);
    matchingChartItems.setValue(
      projectChartItemConverter({
        items: projectGraphAsClient?.filter(item => item.stage === 1),
        duration: duration.value,
      }),
    );
    matchingChartItems2.setValue(
      projectChartItemConverter({
        items: projectGraphAsDesigner?.filter(item => item.stage === 1),
        duration: duration.value,
      }),
    );
    workingChartItems.setValue(
      projectChartItemConverter({
        items: projectGraphAsClient?.filter(item => item.stage === 2),
        duration: duration.value,
      }),
    );
    workingChartItems2.setValue(
      projectChartItemConverter({
        items: projectGraphAsDesigner?.filter(item => item.stage === 2),
        duration: duration.value,
      }),
    );
    doneChartItems.setValue(
      projectChartItemConverter({
        items: projectGraphAsClient?.filter(item => item.stage === 3),
        duration: duration.value,
      }),
    );
    doneChartItems2.setValue(
      projectChartItemConverter({
        items: projectGraphAsDesigner?.filter(item => item.stage === 3),
        duration: duration.value,
      }),
    );
    completeChartItems.setValue(
      projectChartItemConverter({
        items: projectGraphAsClient?.filter(item => item.stage === 4),
        duration: duration.value,
      }),
    );
    completeChartItems2.setValue(
      projectChartItemConverter({
        items: projectGraphAsDesigner?.filter(item => item.stage === 4),
        duration: duration.value,
      }),
    );
  }, [projectGraphAsClient, projectGraphAsDesigner]);

  const matchingColor = color.stage_matching;
  const workingColor = color.stage_working;
  const doneColor = color.stage_done;
  const completeColor = color.stage_complete;

  const projectLegendsItems = [
    {
      index: 1,
      label: 'matchingAsClient',
      color: matchingColor,
    },
    {
      index: 2,
      label: 'workingAsClient',
      color: workingColor,
    },
    {
      index: 3,
      label: 'doneAsClient',
      color: doneColor,
    },
    {
      index: 4,
      label: 'completeAsClient',
      color: completeColor,
    },
    {
      index: 5,
      label: 'matchingAsDesigner',
      color: 'red',
    },
    {
      index: 6,
      label: 'workingAsDesigner',
      color: 'lightgreen',
    },
    {
      index: 7,
      label: 'doneAsDesigner',
      color: 'blue',
    },
    {
      index: 8,
      label: 'completeAsDesigner',
      color: 'lightcoral',
    },
  ];

  const projectChartConfig = {
    matching: {
      index: 1,
      color: matchingColor,
      data: matchingChartItems.value,
    },
    working: {
      index: 2,
      color: workingColor,
      data: workingChartItems.value,
    },
    done: {
      index: 3,
      color: doneColor,
      data: doneChartItems.value,
    },
    complete: {
      index: 4,
      color: completeColor,
      data: completeChartItems.value,
    },
    matching2: {
      index: 5,
      color: 'red',
      data: matchingChartItems2.value,
    },
    working2: {
      index: 6,
      color: 'lightgreen',
      data: workingChartItems2.value,
    },
    done2: {
      index: 7,
      color: 'blue',
      data: doneChartItems2.value,
    },
    complete2: {
      index: 8,
      color: 'lightcoral',
      data: completeChartItems2.value,
    },
  };

  let projectChartItems = [...checkStage.value].reduce((acc, curr) => {
    const obj = {
      index: projectChartConfig[curr].index,
      id: curr,
      color: projectChartConfig[curr].color,
      data: projectChartConfig[curr].data,
    };
    const obj2 = {
      index: projectChartConfig[`${curr}2`].index,
      id: `${curr}2`,
      color: projectChartConfig[`${curr}2`].color,
      data: projectChartConfig[`${curr}2`].data,
    };
    return _.orderBy(acc.concat(obj, obj2), 'index', 'desc');
  }, []);

  useEffect(() => {
    console.log(projectChartItems, 'projectChartItems');
  }, [projectChartItems]);

  // useEffect(() => {
  //   console.log(changeType.value, 'changeType.value');
  // }, [changeType.value]);

  // useEffect(() => {
  //   console.log(checkStage.value.has('matching'), 'checkStage');
  //   console.log(checkStage.value, 'checkStage');
  //   console.log(checkStage.value.length, 'checkStage');
  //   console.log(typeof checkStage.value, 'checkStage');
  // }, [checkStage.value]);

  // "profileImgIdx": 24,
  // "profileImg": "https://dof-live.s3.ap-northeast-2.amazonaws.com/sync/user/J720AUG-0001/J720AUG-0001/profile-J720AUG-0001.png",
  // "email": "receiver@doflab.com",
  // "userCode": "J720AUG-0001",
  // "company": "receiver company",
  // "grade": null,
  // "languageGroup": null,
  // "manager": "manager",
  // "phone": "01055431123",
  // "country": "India",
  // "state": "Chhattisgarh",
  // "countryId": 101,
  // "stateId": 1553,
  // "address": "성동구 307",
  // "visibility": 0,
  // "licenseImg": "https://dof-live.s3.ap-northeast-2.amazonaws.com/sync/user/J720AUG-0001/J720AUG-0001/license-J720AUG-0001.png"

  const fetchList = { fetchOveviewSuccess, fetchResentProjectsSuccess };
  const { isFetchSuccess } = useFetchLoading(fetchList);
  if (!isFetchSuccess) return null;
  return (
    <Overview
      profile={profile}
      projectChartItems={projectChartItems}
      projectLegendsItems={projectLegendsItems}
      resentProjectAsClient={resentProjectAsClient}
      resentProjectAsDesigner={resentProjectAsDesigner}
      checkStage={checkStage}
      duration={duration}
    />
  );
}

function Overview({
  profile,
  projectChartItems,
  projectLegendsItems,
  resentProjectAsClient,
  resentProjectAsDesigner,
  checkStage,
  duration,
}) {
  const { clinic, lab, milling, designer } = profile.type;
  // const hasTwoType = !!((clinic || lab || milling) && designer);
  // console.log('hasTwoType', hasTwoType);

  // TODO: chart data bind
  const history = useHistory();

  const projectStageTabList = [
    {
      label: 'Matching',
      value: 'matching',
    },
    {
      label: 'Working',
      value: 'working',
    },
    {
      label: 'Done',
      value: 'done',
    },
    {
      label: 'Complete',
      value: 'complete',
    },
  ];

  const projectDurationTabList = [
    {
      label: '10years',
      value: '10Y',
    },
    {
      label: '1year',
      value: '1Y',
    },
    {
      label: 'Last 30Days',
      value: '1M',
    },
    {
      label: 'Last 7Days',
      value: '1W',
    },
  ];

  return (
    <Styled.Overview data-component-name="Overview">
      <h1 className="sr-only">User Overview</h1>
      {/* TODO: 이름 변경 */}
      <div className="overview__title">
        Welcome, {profile.company}
        {/* 
        {hasTwoType && (
          <div className="overview__change_type">
            <MuiButton
              variant={changeType.value === 'owner' ? 'contained' : 'outlined'}
              color={changeType.value === 'owner' ? 'primary' : 'default'}
              disableElevation
              className="sm"
              onClick={() => changeType.setValue('owner')}
            >
              Owner
            </MuiButton>
            <MuiButton
              variant={changeType.value === 'designer' ? 'contained' : 'outlined'}
              color={changeType.value === 'designer' ? 'primary' : 'default'}
              disableElevation
              className="sm"
              onClick={() => changeType.setValue('designer')}
            >
              Designer
            </MuiButton>

            <FormControlLabel
            control={
              <Switch
                checked={changeType.designer}
                onChange={changeType.onChange}
                name="designer"
                color="primary"
              />
            }
            labelPlacement="start"
            label="Change Designer"
          />
          </div>
        )}
         */}
      </div>

      <IntervalGrid width={1200} padding={15} hasBorder className="overview__card_container">
        <Grid item xs={8} className="overview__card_grid_item profile">
          <div className="overview__card profile">
            <div className="overview__profile_link_box">
              <MuiButton
                disableElevation
                variant="contained"
                color="primary"
                className="sm"
                onClick={() =>
                  history.push(`${pageUrl.designer.index}/@${profile.userCode}/portfolio`)
                }
              >
                Portfolio
              </MuiButton>
              <MuiButton
                disableElevation
                variant="contained"
                color="primary"
                className="sm"
                onClick={() => history.push(`/@${profile.userCode}/profile`)}
              >
                Information
              </MuiButton>
            </div>
            <div className="overview__profile_thumbnail_box">
              <figure className="overview__profile_figure">
                {profile.profileImg ? (
                  <ImgCrop width={120} height={120} isCircle src={profile.profileImg} />
                ) : (
                  <img src={icon_face} art="face icon" />
                )}
              </figure>
              <div className="overview__profile_account_box">
                <p className="overview__profile_name">{profile.company}</p>
                <p className="overview__profile_email">{profile.email}</p>
                <StarScore
                  max={5}
                  score={profile.gradeAsClinic}
                  activeIcon={<FavoriteIcon htmlColor="orange" />}
                  unactiveIcon={<FavoriteBorderIcon htmlColor="orange" />}
                  isComponent={true}
                  className="designerList__profile_score"
                />
                <StarScore
                  max={5}
                  score={profile.gradeAsDesigner}
                  className="designerList__profile_score"
                />
              </div>
            </div>
            <ul className="overview__profile_info_list">
              <li className="overview__profile_info_item language">
                <b>User type</b>
                <span>Designer, Lab</span>
              </li>
              {/* TODO: change designer, give up 체크 */}
              <li className="overview__profile_info_item rework">
                <b>Change designer</b>
                <span>{profile.changeDesignerCount || 0}</span>
              </li>
              <li className="overview__profile_info_item rework">
                <b>Give up</b>
                <span>{profile.giveupCount || 0}</span>
              </li>
              <li className="overview__profile_info_item change">
                <b>Created project</b>
                <span>24</span>
              </li>
            </ul>
          </div>
        </Grid>
        <Grid item xs={4} className="overview__card_grid_item point">
          <div className="overview__card point">
            <h2 className="overview__point_title">My point</h2>
            <p className="overview__point_point">
              <span className="lg">{profile.currentPoint}</span> <span className="sm">point</span>
            </p>
            <div className="overview__point_btn_box">
              <MuiButton
                variant="outlined"
                color="primary"
                className="sm"
                onClick={() => history.push(`${pageUrl.order.exchange}`)}
              >
                Exchange
              </MuiButton>
              <MuiButton
                variant="outlined"
                color="primary"
                className="sm"
                onClick={() => history.push(`/@${profile.userCode}/point-history`)}
              >
                History
              </MuiButton>
              <MuiButton
                variant="contained"
                color="primary"
                disableElevation
                className="sm"
                onClick={() => history.push(`${pageUrl.order.store}`)}
              >
                Store
              </MuiButton>
            </div>
          </div>
        </Grid>

        <Grid item xs={6} className="overview__card_grid_item">
          <div className="overview__card project">
            <Link
              to={`/@${profile.userCode}/projects?userType=1`}
              className="overview__profile_link"
            >
              <ArrowForwardIosRoundedIcon fontSize="inherit" />
            </Link>
            <div className="overview__project_tab_list">
              <span className="overview__project_tab_title">Project | made</span>
              {/* <TextButton
                className={cx({ waiting: beforeStage.value == 0 })}
                fontColor="#aaa"
                onClick={() => beforeStage.setValue(0)}
              >
                Waiting
              </TextButton>
              {' | '}
              <TextButton
                className={cx({ matching: beforeStage.value == 1 })}
                fontColor="#aaa"
                onClick={() => beforeStage.setValue(1)}
              >
                Matching
              </TextButton> */}
            </div>
            <div className="overview__project_tab_panel">
              <ProjectList projectItems={resentProjectAsClient} />
            </div>
          </div>
        </Grid>
        <Grid item xs={6} className="overview__card_grid_item">
          <div className="overview__card project">
            <Link
              to={`/@${profile.userCode}/projects?userType=2`}
              className="overview__profile_link"
            >
              <ArrowForwardIosRoundedIcon fontSize="inherit" />
            </Link>
            <div className="overview__project_tab_list">
              <span className="overview__project_tab_title">Project | applied</span>
              {/* <TextButton
                className={cx({ working: afterStage.value == 2 })}
                fontColor="#aaa"
                onClick={() => afterStage.setValue(2)}
              >
                Working
              </TextButton>
              {' | '}
              <TextButton
                className={cx({ done: afterStage.value == 3 })}
                fontColor="#aaa"
                onClick={() => afterStage.setValue(3)}
              >
                Done
              </TextButton> */}
            </div>
            <div className="overview__project_tab_panel">
              <ProjectList projectItems={resentProjectAsDesigner} />
            </div>
          </div>
        </Grid>

        <Grid item xs={12} className="overview__card_grid_item">
          <div className="overview__card chart">
            <Grid container alignItems="center">
              <Grid item xs={6} className="overview__chart_stage_tab_box">
                {projectStageTabList.map((item, index) => (
                  <div
                    className={cx('overview__chart_stage_tab', {
                      active: checkStage.value.has(item.value),
                    })}
                    key={index}
                    data-value={item.value}
                    onClick={checkStage.onChange}
                  >
                    {item.label}
                  </div>
                ))}
              </Grid>
              <Grid item xs={6} className="overview__chart_period_tab_box">
                {projectDurationTabList.map((item, index) => (
                  <div
                    className={cx('overview__chart_period_tab', {
                      active: item.value === duration.value,
                    })}
                    key={index}
                    data-value={item.value}
                    onClick={duration.onChange}
                  >
                    {item.value === '10Y' && <T>dashboard.years10</T>}
                    {item.value === '1Y' && <T>dashboard.year1</T>}
                    {item.value === '1M' && <T>dashboard.last30Days</T>}
                    {item.value === '1W' && <T>dashboard.last7Days</T>}
                  </div>
                ))}
              </Grid>
            </Grid>

            <div className="overview__chart_box">
              <LineChart
                width={1180}
                height={380}
                data={projectChartItems}
                legendsData={projectLegendsItems}
                legendsComponent={
                  <div className="overview__chart_legends cf">
                    {projectLegendsItems.map((item, idx) => (
                      <div className="overview__chart_legends_item" key={idx}>
                        <span
                          className="overview__chart_legends_symbol"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="overview__chart_legends_name">{item.label}</span>
                      </div>
                    ))}
                  </div>
                }
                className="overview__chart"
              />
            </div>
            {/* <LineChart
              width={1180}
              height={380}
              // data={projectChartItems}
              // legendsData={projectLegendsItems}
              className="overview__chart"
            /> */}
          </div>
        </Grid>
      </IntervalGrid>
    </Styled.Overview>
  );
}

// TODO: api 연동, 고도화
export function ProjectList({ projectItems = [] }) {
  const history = useHistory();

  useEffect(() => {
    console.log('projectItems', projectItems);
  }, [projectItems]);

  // const handleClick = config => {
  //   const { e = {}, type = '', name = '' } = config;

  //   if (type === 'link') {
  //     const { caseCode } = config;
  //     history.push(convertUrl.projectDetailLoad({ caseCode }));

  //     return;
  //   }
  // };

  return (
    <Styled.ProjectList>
      {!!projectItems?.length &&
        projectItems.map((item, idx) => {
          // console.log('item', item);
          // if (item.stage !== projectStage) return;
          const stageName = project.processFlagList.find(i => i.id === item.stage)?.name;
          return (
            <Fragment key={idx}>
              <div
                className="projectList__row"
                onClick={() =>
                  history.push(`${pageUrl.project.detail}?projectCode=${item.projectCode}`)
                }
              >
                <div className="projectList__title_box">
                  <div className={cx('projectList__timeline', stageName)}></div>
                  <div className="projectList__title">{item.projectId}</div>
                </div>
                <div className="projectList__info_box">
                  <div className="projectList__info_col partner_col">
                    <img
                      className="icon_dashboard partner"
                      src={icon_calendar}
                      alt="icon_calendar"
                    />
                    <DateConverter timestamp={item.enrollDate} format="YYYY-MM-DD" />
                  </div>
                  <div className="projectList__info_col date_col">
                    <img className="icon_dashboard date" src={icon_user} alt="icon_user" />
                    {item.applyCount ? item.applyCount : '-'}
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
      {/* {Array.from({ length: 4 }).map((item, idx) => (
        <Fragment key={idx}>
          <div className="projectList__row" onClick={() => history.push(``)}>
            <div className="projectList__title_box">
              <div className={cx('projectList__timeline', projectStage)}></div>
              <div className="projectList__title">Title</div>
            </div>
            <div className="projectList__info_box">
              <div className="projectList__info_col partner_col">
                <img className="icon_dashboard partner" src={icon_calendar} alt="icon_calendar" />
                2020-12-24
              </div>
              <div className="projectList__info_col date_col">
                <img className="icon_dashboard date" src={icon_user} alt="icon_user" />
                <div className={cx('projectList__date')}>
                </div>
              </div>
            </div>
          </div> 
        </Fragment>
        
      ))}
      */}
    </Styled.ProjectList>
  );
}

const Styled = {
  Overview: styled.div`
    .overview__title {
      position: relative;
      font-size: 36px;
      font-weight: 700;
      width: 1200px;
      margin: 80px auto 20px;
      .overview__change_type {
        position: absolute;
        top: 5px;
        right: 0px;
        .button + .button {
          margin-left: 5px;
        }
        // 재사용 할 경우 styles/utils로 이동
        .MuiSwitch-root {
          width: 50px;
          height: 32px;
          padding: 4px;
          margin-left: 3px;
        }
        .MuiSwitch-thumb {
          width: 14px;
          height: 14px;
        }
        .MuiSwitch-track {
          border-radius: 20px;
        }
        .MuiSwitch-colorPrimary.Mui-checked {
          color: #fff;
        }
        .MuiSwitch-track {
          background-color: #888;
        }
        .MuiSwitch-switchBase.Mui-checked {
          transform: translateX(18px);
        }
        .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
          background-color: ${color.blue};
        }
        .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
          opacity: 1;
        }
        .MuiTypography-root {
          font-size: 14px;
        }
        .MuiFormControlLabel-labelPlacementStart {
          margin-right: -4px;
        }
      }
    }
    .overview__card_container {
      .overview__card_grid_item {
        &.profile {
          max-width: 68.29%;
          flex-basis: 68.29%;
        }
        &.point {
          max-width: 31.71%;
          flex-basis: 31.71%;
        }
      }
      .overview__card {
        border-radius: 10px;
        .overview__profile_link_box {
          position: absolute;
          top: 20px;
          right: 20px;
          .button {
            margin-left: 5px;
            padding-left: 10px;
            padding-right: 10px;
          }
        }
        .overview__profile_link {
          position: absolute;
          top: 30px;
          right: 30px;
          ${flexCenter};
          width: 25px;
          height: 25px;
          background-color: ${color.blue};
          border-radius: 50%;
          font-size: 16px;
          color: #fff;
          svg {
            position: relative;
          }
        }
        &.profile,
        &.point {
          height: 245px;
        }
        &.profile {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 60px 65px 60px 40px;
          .overview__profile_thumbnail_box {
            display: flex;
            align-items: center;
            .overview__profile_figure {
              margin-right: 30px;
            }
            .overview__profile_name,
            .overview__profile_email {
              font-weight: 700;
            }
            .overview__profile_name {
              font-size: 20px;
            }
            .overview__profile_email {
              margin-top: 5px;
              font-size: 16px;
              color: ${color.gray_font};
            }
            .designerList__profile_score {
              margni-top: 10px;
              line-height: 1.5;
            }
          }
          .overview__profile_info_list {
            position: relative;
            top: 10px;
            width: 320px;
            .overview__profile_info_item {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid ${color.gray_border2};
              padding-bottom: 5px;
              &:not(:first-child) {
                margin-top: 10px;
              }
              b {
                color: ${color.gray_font};
              }
            }
          }
        }
        &.point {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          .overview__point_title {
            ${font(18, color.blue)};
            font-weight: 700;
          }
          .overview__point_point {
            position: relative;
            top: -12px;
            margin-left: 20px;
            font-weight: 700;
            .lg {
              font-size: 40px;
            }
            .sm {
              font-size: 20px;
              margin-left: 5px;
            }
          }
          .overview__point_btn_box {
            text-align: right;
            .button {
              padding-left: 10px;
              padding-right: 10px;
              border-width: 2px;
              font-weight: 700;
              &:not(:first-child) {
                margin-left: 5px;
              }
            }
          }
        }
        &.project {
          padding: 30px;
          .overview__project_tab_list {
            display: flex;
            align-items: center;
            .overview__project_tab_title {
              font-size: 20px;
              font-weight: 700;
            }
            .button {
              font-size: 20px;
              font-weight: 700;
              &.waiting {
                color: ${color.stage_waiting};
              }
              &.matching {
                color: ${color.stage_matching};
              }
              &.working {
                color: ${color.stage_working};
              }
              &.done {
                color: ${color.stage_done};
              }
            }
          }
          .overview__project_tab_panel {
            margin-top: 20px;
          }
        }
        &.chart {
          padding: 30px;
          .overview__chart_stage_tab,
          .overview__chart_period_tab {
            display: inline-block;
            line-height: 18px;
            cursor: pointer;
          }
          .overview__chart_stage_tab {
            background: ${color.gray_bg1};
            padding: 5px 15px;
            margin: 0 3px;
            border-radius: 3px;
            font-size: 14px;
            transition: background-color 0.25s;
            &:last-child {
              margin-right: 0;
            }
            &.active {
              background-color: #f0f7fb;
            }
          }
          .overview__chart_period_tab_box {
            text-align: right;
          }
          .overview__chart_period_tab {
            padding: 0 10px;
            border-right: solid 1px ${color.gray_border};
            &.active {
              color: ${color.blue};
            }
            &:last-child {
              border-right: none;
              padding-right: 0;
            }
          }
          .overview__chart_box {
            margin-top: 25px;
            margin-left: -20px;
            margin-right: -20px;
            .overview__chart_no_data {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .overview__chart_legends {
              .overview__chart_legends_item {
                float: left;
                display: flex;
                align-items: center;
                min-width: 160px;
                text-transform: capitalize;
                &:nth-child(n + 4) {
                  margin-top: 5px;
                }
                &:not(:first-child):not(:nth-child(5)) {
                  margin-left: 12px;
                }
                &:nth-child(5) {
                  clear: both;
                }
                .overview__chart_legends_symbol {
                  display: inline-block;
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                }
                .overview__chart_legends_name {
                  margin-left: 5px;
                  font-size: 14px;
                  color: #333;
                }
              }
            }
          }
        }
      }
    }
  `,
  ProjectList: styled.div`
    height: 350px;
    overflow-y: auto;
    .projectList__row {
      border: solid 1px ${color.gray_border2};
      padding: 13px 15px;
      line-height: 20px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background: ${color.gray_bg1};
      }
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
    .projectList__title_box {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .projectList__timeline {
      position: relative;
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background: ${color.red};
      &.create {
        background-color: ${color.stage_waiting};
      }
      &.matching {
        background-color: ${color.stage_matching};
      }
      &.working {
        background-color: ${color.stage_working};
      }
      &.done {
        background-color: ${color.stage_done};
      }
    }
    .projectList__title {
      width: calc(100% - 30px);
      margin-left: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      ${font(18, color.black_font)};
    }
    .projectList__info_box {
      display: flex;
      align-items: flex-start;
      margin-left: 30px;
    }
    .projectList__info_col {
      position: relative;
      &.partner_col {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 10px;
        ${font(16, color.gray_font)};
      }
      &.date_col {
        flex: 0.65;
        padding-left: 10px;
        &:before {
          position: absolute;
          content: '';
          display: block;
          width: 1px;
          height: 15px;
          background-color: ${color.gray_border};
          top: 3px;
          left: 0;
        }
      }
    }
    .projectList__date {
      display: inline-block;
      ${font(16, color.gray_font)};
      &.impendingProject {
        ${font(16, color.red)};
        font-weight: 700;
      }
    }
    .icon_dashboard {
      margin-right: 8px;
      position: relative;
      top: 2px;
    }
    .projectList__partner {
      position: relative;
      ${font(16, color.gray_font)};
    }
  `,
};
