import { FormControl, FormControlLabel, Grid, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { icon_calendar } from 'components/base/images';
import { beforeDash, color, flexCenter, font } from 'styles/utils';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { Link, useHistory, useParams } from 'react-router-dom';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import LineChart from 'components/common/chart/LineChart';
import { projectProcessFlagList } from 'lib/mapper';
import { UserActions } from 'store/actionCreators';
import { useShallowSelector, useDidUpdateEffect } from 'lib/utils';
import _ from 'lodash';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { addCommas, isPositive, projectChartItemConverter, regNumber } from 'lib/library';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import DateConverter from 'components/common/convert/DateConverter';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MuiWrapper from 'components/common/input/MuiWrapper';
import DollarIcon from 'components/base/icons/DollarIcon';
import CustomSpan from 'components/common/text/CustomSpan';
import StoreUserCardContainer from 'containers/store/StoreUserCardContainer';
import CustomCheckbox from 'components/common/checkbox/CustomCheckbox';
import MuiPagination from 'components/common/pagination/MuiPagination';

export default function OverviewContainer() {
  const { fetchOverview, fetchOverviewSuccess, fetchProject, fetchProjectGraph } =
    useShallowSelector(state => ({
      fetchOverviewSuccess: state.user.overview.success,
      fetchOverview: state.user.overview.data,
      fetchProject: state.user.projects.data,
      fetchProjectGraph: state.user.fetchProjectGraph.data,
    }));
  const { uid } = useParams();
  const profile = fetchOverview?.profile;
  const pointHistory = fetchOverview?.pointStatus;
  const pagingData = fetchProject?.pagingData;
  const projectList = fetchProject?.list;
  const projectGraph = fetchProjectGraph?.projectGraph;

  // 1: matching, 2: working, 3: done, 4: complete
  // const checkStage = useCheckSetInput(new Set(['matching']));
  const checkStage = useCheckSetInput(new Set(['waiting']));
  const checkStageIndex = useCheckSetInput(new Set([0]));
  // 10Y, 1Y, 1M, 1W
  const duration = useInput('1W');

  const waitingChartItems = useInput([]);
  const reviewChartItems = useInput([]);
  const designChartItems = useInput([]);
  const completeChartItems = useInput([]);

  const waitingColor = color.stage_waiting;
  const reviewColor = color.stage_matching;
  const designColor = color.stage_design;
  const completeColor = color.stage_complete;

  const projectChartConfig = {
    waiting: {
      index: 0,
      color: waitingColor,
      data: waitingChartItems.value,
    },
    review: {
      index: 1,
      color: reviewColor,
      data: reviewChartItems.value,
    },
    design: {
      index: 2,
      color: designColor,
      data: designChartItems.value,
    },
    complete: {
      index: 3,
      color: completeColor,
      data: completeChartItems.value,
    },
  };

  const page = useInput(1);

  let submitProjectParams = useMemo(
    () => ({
      duration: duration.value,
      page: page.value,
      stage: [...checkStageIndex.value]?.join('%'),
    }),
    [duration.value, page.value, checkStageIndex.value],
  );
  let submitGraphParams = useMemo(
    () => ({
      duration: duration.value,
      stage: [...checkStageIndex.value]?.join('%'),
    }),
    [duration.value, checkStageIndex.value],
  );

  // useEffect(() => {
  //   console.log('submitProjectParams _______ ', checkStage.value);
  // }, [checkStage.value]);
  // useEffect(() => {
  //   console.log('checkStageIndex.value _______ ', checkStageIndex.value);
  // }, [checkStageIndex.value]);

  // SECTION: init
  useEffect(() => {
    UserActions.fetch_overview_request();
    UserActions.fetch_projects_request(submitProjectParams);
    UserActions.fetch_project_graph_request(submitGraphParams);
  }, []);

  useDidUpdateEffect(() => {
    UserActions.fetch_projects_request(submitProjectParams);
  }, [submitProjectParams]);

  useDidUpdateEffect(() => {
    UserActions.fetch_project_graph_request(submitGraphParams);
  }, [submitGraphParams]);

  useEffect(() => {
    waitingChartItems.setValue(
      projectChartItemConverter({
        items: projectGraph?.filter(item => item.stage === 0),
        duration: duration.value,
      }),
    );
    reviewChartItems.setValue(
      projectChartItemConverter({
        items: projectGraph?.filter(item => item.stage === 1),
        duration: duration.value,
      }),
    );
    designChartItems.setValue(
      projectChartItemConverter({
        items: projectGraph?.filter(item => item.stage === 2),
        duration: duration.value,
      }),
    );
    completeChartItems.setValue(
      projectChartItemConverter({
        items: projectGraph?.filter(item => item.stage === 3),
        duration: duration.value,
      }),
    );
  }, [projectGraph]);

  let projectChartItems = [...checkStage.value].reduce((acc, curr) => {
    const obj = {
      index: projectChartConfig[curr].index,
      id: curr,
      color: projectChartConfig[curr].color,
      data: projectChartConfig[curr].data,
    };
    return _.orderBy(acc.concat(obj), 'index', 'desc');
  }, []);

  // useEffect(() => {
  //   console.log('projectChartItems _____ ', projectChartItems);
  // }, [projectChartItems]);

  // useEffect(() => {
  //   console.log('projectGraph ______ ', projectGraph);
  // }, [projectGraph]);

  const fetchList = { fetchOverviewSuccess };
  const { isFetchSuccess } = useFetchLoading(fetchList);
  if (!isFetchSuccess) return null;
  return (
    <Overview
      profile={profile}
      projectList={projectList}
      pointHistory={pointHistory}
      projectChartItems={projectChartItems}
      checkStage={checkStage}
      checkStageIndex={checkStageIndex}
      duration={duration}
      page={page}
      pagingData={pagingData}
    />
  );
}

function Overview({
  projectList,
  pointHistory,
  projectChartItems,
  checkStage,
  checkStageIndex,
  duration,
  page,
  pagingData,
}) {
  const { uid } = useParams();

  const { t } = useTranslation();
  // TODO: chart data bind
  const history = useHistory();

  const projectDurationTabList = [
    {
      // label: '10years',
      label: `${t('GLOBAL_SELECT_YEARS_10')}`,
      value: '10Y',
    },
    {
      // label: '1year',
      label: `${t('GLOBAL_SELECT_YEARS_1')}`,
      value: '1Y',
    },
    {
      // label: 'Last 30Days',
      label: `${t('GLOBAL_SELECT_DAYS_30')}`,
      value: '1M',
    },
    {
      // label: 'Last 7Days',
      label: `${t('GLOBAL_SELECT_DAYS_7')}`,
      value: '1W',
    },
  ];

  return (
    <Styled.Overview data-component-name="Overview">
      <h1 className="sr-only">User Overview</h1>
      {/* TODO: 이름 변경 */}
      <div className="overview__title page-title">
        <T>USER_MENU_MYBRIDGE</T>
      </div>

      <IntervalGrid
        width={850}
        // padding={5}
        hasPaddingGridContainer={false}
        hasCardBorder
        className="overview__card_container"
      >
        {/*********************************************** USER CARD ***********************************************/}
        <Grid item className="overview__card_grid_item profile">
          <StoreUserCardContainer
            parentPath="overview"
            marginRight={15}
            marginLeft={15}
            paddingTop={10}
          />
        </Grid>
        {/*********************************************** POINT ***********************************************/}
        <Grid item className="overview__card_grid_item point">
          <div className="overview__grid_item_box point">
            <div className="overview__point_title_box">
              <h2 className="overview__point_title">
                <T>USER_MY_POINT</T>
              </h2>
              <Link to={`/@${uid}/order/point-history`} className="overview__user_point">
                <DollarIcon width={24} color={color.blue} />
                <CustomSpan fontColor={color.blue} marginRight={5}>
                  {addCommas(Math.abs(pointHistory.currentPoint))}
                </CustomSpan>
                <T>USER_POINT</T>
                <span className="overview__profile_link">
                  <ArrowForwardIosRoundedIcon fontSize="inherit" />
                </span>
              </Link>
            </div>

            <ul className="overview__point_history_list">
              {!!pointHistory?.pointHistory?.length &&
                pointHistory?.pointHistory?.map((item, idx) => {
                  return (
                    <li key={idx} className="overview__point_history_item">
                      <div className="overview__point_history_row change">
                        {isPositive(item.changePoint) ? (
                          <>
                            <div className="overview__point_history_change_item">
                              <T>USER_POINT_INCOMING</T>
                            </div>
                            <div className="overview__point_history_change_item">
                              <CustomSpan fontColor={color.blue} fontSize={15}>
                                +{addCommas(Math.abs(item.changePoint))} P
                              </CustomSpan>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="overview__point_history_change_item">
                              <T>USER_POINT_OUTGOING</T>
                            </div>
                            <div className="overview__point_history_change_item">
                              <CustomSpan fontSize={15}>
                                -{addCommas(Math.abs(item.changePoint))} P
                              </CustomSpan>
                            </div>
                          </>
                        )}
                        <div className="overview__point_history_change_item">
                          <CustomSpan fontColor={color.gray_b5}>
                            {addCommas(Math.abs(item.afterPoint))} P
                          </CustomSpan>
                        </div>
                      </div>
                      <div className="overview__point_history_row status">
                        <div className="overview__point_history_status_item">
                          <CustomSpan fontColor={color.gray_b5}>
                            <DateConverter timestamp={item.enrollDate} format="MMM.DD.YYYY" />
                          </CustomSpan>
                        </div>
                        <div className="overview__point_history_status_item title">
                          {item.title}
                        </div>
                        <div className="overview__point_history_status_item"></div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Grid>
        {/*********************************************** PROJECT CHART ***********************************************/}
        <Grid item xs={12} className="overview__card_grid_item chart">
          <div className="overview__grid_item_box chart">
            <div className="overview__chart_title_box">
              <h2 className="overview__chart_title">
                <T>PROJECT_STATUS</T>
              </h2>
            </div>
            <Grid container alignItems="center" className="overview__chart_stage_tab_container">
              <Grid item xs={9} className="overview__chart_stage_tab_box">
                {projectProcessFlagList.map((item, index) => {
                  return (
                    <div className="overview__chart_stage_tab" key={index}>
                      <FormControlLabel
                        className="overview__chart_stage_tab_label "
                        control={
                          <CustomCheckbox
                            width={20}
                            color={item.color}
                            checked={checkStage.value.has(item.nameValue)}
                            onChange={e => {
                              checkStage.onChange({ e, value: item.nameValue });
                              page.onChange({ value: 1 });
                              item.stage.forEach(stage =>
                                checkStageIndex.onChange({ e, value: stage }),
                              );
                              // checkStageIndex.onChange({ e, value: item.stage });
                            }}
                          />
                        }
                        label={<span className="input__primary_text">{item.title}</span>}
                        labelPlacement="end"
                      />
                      {index < 3 && <div className="overview__chart_stage_tab_partition"></div>}
                    </div>
                  );
                })}
              </Grid>
              <Grid item xs={3} className="overview__chart_period_tab_box">
                <MuiWrapper className="overview__chart_period_select_wrapper sm order">
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
                      name="duration"
                      value={duration.value || ''}
                      onChange={duration.onChange}
                      className="radius-sm"
                    >
                      {projectDurationTabList?.length > 0 &&
                        projectDurationTabList.map((item, idx) => (
                          <MenuItem key={idx} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </MuiWrapper>
              </Grid>
            </Grid>

            <div className="overview__chart_box">
              {useMemo(
                () => (
                  <LineChart
                    className="overview__chart"
                    width={840}
                    height={380}
                    data={projectChartItems}
                  />
                ),
                [projectChartItems],
              )}
            </div>

            <div className="overview__project_card_list">
              {
                // projectList?.length &&
                projectList?.map((item, idx) => {
                  return <ProjectCardItem item={item} key={idx} />;
                })
              }
            </div>
            <div className="pagination__container">
              <MuiPagination
                count={pagingData?.totalPage}
                page={page.value}
                onChange={(e, value) => page.setValue(value)}
              />
            </div>
          </div>
        </Grid>
      </IntervalGrid>
    </Styled.Overview>
  );
}

// TODO: api 연동, 고도화
export function ProjectCardItem({ item = [] }) {
  const history = useHistory();
  // const stageName = project.processFlagList.find(i => i.id === item.stage)?.name;
  const stageName = projectProcessFlagList.find(i => i.stage.includes(item.stage))?.nameValue;
  // const stageName = projectProcessFlagList.includes()
  // useEffect(() => {
  //   console.log('ProjectCardItem ______ ', item);
  // }, [item]);
  // useEffect(() => {
  //   console.log('stageName ______ ', stageName);
  // }, [stageName]);

  return (
    <Styled.ProjectCardItem
      data-component-name="ProjectCardItem"
      onClick={() => history.push(`/project/detail/${item.projectCode}`)}
    >
      <div className="projectList__title_box">
        <div className={cx('projectList__timeline', stageName)}></div>
        <div className="projectList__title">{item.projectId}</div>
      </div>
      <div className="projectList__info_box">
        <div className="projectList__info_col date_col">
          <div className="projectList__info_icon_box calendar">
            <img src={icon_calendar} alt="icon_calendar" />
          </div>
          <DateConverter timestamp={item.enrollDate} format="MMM.DD.YYYY" />
        </div>
        <div className="projectList__info_col price_col">
          <div className="projectList__info_icon_box price">
            <AttachMoneyIcon fontSize="small" />
          </div>
          {!!item.point ? ` ${item.point}P` : `-`}
          {/* {item.applyCount ? item.applyCount : '-'} */}
        </div>
      </div>
    </Styled.ProjectCardItem>
  );
}

const Styled = {
  Overview: styled.div`
    .page-title {
      padding-bottom: 5px;
      ${beforeDash({ width: 50, fontColor: color.black_font })};
    }
    .pagination__container {
      padding-top: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .overview__card_container {
      .overview__card_grid_item {
        &.profile {
          width: 355px;
        }
        &.point {
          width: calc(100% - 355px);
        }
        &.project,
        &.chart {
          margin-top: 10px;
        }
      }
      .overview__grid_item_box {
        border-radius: 10px;
        padding-bottom: 20px;
        .overview__profile_link {
          ${flexCenter}
          width: 25px;
          height: 25px;
          background-color: ${color.blue};
          border-radius: 2px;
          font-size: 16px;
          color: #fff;
          svg {
            position: relative;
          }
        }

        &.point {
          padding: 0 25px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-wrap: wrap;
          .overview__point_title_box,
          .overview__point_history_list {
            width: 100%;
          }
          .overview__point_title_box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 80px;
          }
          .overview__point_title {
            position: relative;
            left: -25px;
            ${beforeDash({
              width: 17,
              height: 2,
              marginRight: 10,
              fontSize: 18,
              fontColor: color.black_font,
            })};
          }
          .overview__user_point {
            display: inline-flex;
            align-items: center;
            font-size: 25px;
            > :first-child {
              margin-right: 10px;
            }
            > :last-child {
              margin-left: 20px;
            }
          }

          .overview__point_history_list {
            margin-top: 15px;
            .overview__point_history_item {
              width: 100%;
              height: 85px;
              padding: 20px 30px;
              border-radius: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
              /* &:hover {
                box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
              } */

              &:not(:first-child) {
                margin-top: 10px;
              }
              .overview__point_history_row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;

                &.change {
                  font-size: 13px;
                }
                &.status {
                  font-size: 10px;
                  font-weight: 400;
                }
                > [class*='_item']:nth-child(1) {
                  width: 40%;
                }
                > [class*='_item']:nth-child(2) {
                  width: calc(60% - 80px);
                }
                > [class*='_item']:nth-child(3) {
                  width: 80px;
                  text-align: right;
                }
                .overview__point_history_change_item {
                  display: inline-block;
                }
                .overview__point_history_status_item {
                  &.title {
                    text-transform: capitalize;
                    /* overflow: hidden; */
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }

        &.chart {
          padding: 40px 20px 10px;
          .overview__project_card_list {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            row-gap: 25px;
            column-gap: 25px;
            padding-top: 10px;
          }

          .overview__chart_title_box {
            .overview__chart_title {
              color: #0f0f0f;
              position: relative;
              /* left: -25px; */
              left: -20px;
              ${beforeDash({ width: 17, height: 2, marginRight: 10, fontColor: color.black_font })};
            }
          }
          .overview__chart_stage_tab,
          .overview__chart_period_tab {
            display: inline-block;
            line-height: 18px;
            cursor: pointer;
          }
          .overview__chart_stage_tab_container {
            padding: 30px 0 40px 6px;
            .overview__chart_stage_tab_box {
              position: relative;
              display: flex;
              .overview__chart_stage_tab {
                padding-left: 12px;
                display: flex;
                align-items: center;

                .overview__chart_stage_tab_label {
                  margin-right: 0;
                  .input__primary_text {
                    padding-left: 5px;
                  }
                }
                .overview__chart_stage_tab_partition {
                  width: 1px;
                  height: 17px;
                  background-color: ${color.gray_b5};
                  margin: 0 20px;
                  &:nth-child(4) {
                    display: none;
                  }
                }
              }
            }
          }
          .overview__chart_period_tab_box {
          }
          .overview__chart_period_tab {
            text-align: right;
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
            /* margin-left: -35px;
            margin-right: -35px; */
            margin-left: -20px;
            margin-right: -20px;
            /* margin-left: -20px;
            margin-right: -20px; */
            .overview__chart_no_data {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .overview__chart_legends {
              display: flex;
              align-items: center;
              padding-top: 15px;
              /* padding: 0 25px; */
              margin: 0 -10px;
              font-size: 13px;
              border-top: 1px solid ${color.gray_border2};
              .overview__chart_legends_item {
                display: flex;
                &.division {
                  margin-left: 50px;
                }
                &.label {
                  padding-right: 15px;
                  border-right: 1px solid ${color.gray_border2};
                }
                .overview__chart_legends_symbol {
                  display: inline-block;
                  width: 14px;
                  height: 14px;
                  margin-left: 10px;
                  border-radius: 2px;
                }
                .overview__chart_legends_name {
                  margin-left: 5px;
                  color: #333;
                }
              }
            }
          }
        }
      }
    }
  `,
  ProjectCardItem: styled.div`
    & {
      height: 90px;
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
      width: calc(50% - 25px / 2);
      /* display: block; */
      padding: 15px 20px;
      /* line-height: 20px; */
      border-radius: 5px;
      cursor: pointer;
      /* transition: all 0.3s; */
      &:hover {
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
        /* background: ${color.gray_bg1}; */
      }
      /* &:not(:last-child) {
        margin-bottom: 10px;
      } */

      .projectList__title_box {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .projectList__timeline {
        position: relative;
        width: 15px;
        height: 15px;
        border-radius: 3px;
        background: ${color.red};
        /* &.create {
          background-color: ${color.stage_create};
        }
        &.matching {
          background-color: ${color.stage_review};
        }
        &.working {
          background-color: ${color.stage_design};
        }
        &.done {
          background-color: ${color.stage_complete};
        } */
        &.waiting {
          background-color: ${color.stage_waiting};
        }
        &.review {
          background-color: ${color.stage_matching};
        }
        &.design {
          background-color: ${color.stage_design};
        }
        &.complete {
          background-color: ${color.stage_complete};
        }
      }
      .projectList__title {
        width: calc(100% - 30px);
        /* margin-left: 12px; */
        margin-left: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        ${font(15, color.black_font)};
        font-weight: 500;
        line-height: 20px;
      }
      .projectList__info_box {
        display: flex;
        align-items: flex-start;
        margin-top: 15px;
        margin-left: 35px;
      }
      .projectList__info_col {
        position: relative;
        display: flex;
        align-items: center;
        ${font(13, color.gray_font)};
        font-weight: 300;

        &.date_col {
          width: 135px;
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
      .projectList__info_icon_box {
        /* margin-right: 8px;
        position: relative;
        top: 2px; */
        width: 25px;
        height: 25px;
        border-radius: 5px;
        background-color: #e6e6ea;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;

        &.price {
          color: #5b5b5b;
        }
      }
      .projectList__partner {
        position: relative;
        ${font(16, color.gray_font)};
      }
    }
  `,
};
