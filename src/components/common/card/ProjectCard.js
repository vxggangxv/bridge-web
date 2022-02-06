import React, { useEffect, useMemo } from 'react';
import TeethSvg from 'components/model/TeethSvg';
import styled from 'styled-components';
import {
  icon_calendar,
  icon_circle_alert,
  icon_clinic,
  icon_clock,
  // icon_cloud,
  icon_dollar,
  icon_earth,
  icon_gradient_bubble,
  icon_pen,
  icon_repair,
  icon_spot,
  icon_tool,
  icon_user,
} from 'components/base/images';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { color } from 'styles/utils';
import DateConverter from '../convert/DateConverter';
import moment from 'moment';
import { project, projectProcessFlagList } from 'lib/mapper';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import TeethSvgV2 from 'components/model/TeethSvgV2';
import { cutUrl } from 'lib/library';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { ProjectActions } from 'store/actionCreators';
import cx from 'classnames';
import CustomSpan from 'components/common/text/CustomSpan';
import T from '../text/T';
import { ENV_MODE_DEV } from 'lib/setting';

/**
 * project/list, designers/@:id/projects 공통 카드 UI
 * @param {string} typeId : 1(findProject), 2(not 1) 타입
 * @param {string} link : 이동 Url
 * @param {string} stage : 0: create, 1: wating, 2: matching, 3: working, 4: done, 5: complete
 * @param {string} stage : create, wating - 0, matching - 1, working - 2, done - 3, complete - 4
 */
export default function ProjectCard(props) {
  const {
    teeth,
    bridgeList,
    companyName,
    dueDate,
    enrollDate,
    notation,
    point,
    preferedProgram: programName,
    projectCode,
    projectId,
    projectTitle,
    stage,
    newChatCount,
    hasNewEvent,
    //
    // applyCount = 0,
    // country,
    // languageIsoGroup,
    // reworkCount,
    // sender,
    // paidState,
    // supportCountryList,
    //
    // custom value
    typeId,
    // isExpired: isExpiredProp,
    link,
    className = '',
    // projectCardSize = 'medium', // small, medium, large
    hasBoxShadow = true,
    teethBoxSize = 120,
    teethBoxPadding = 20,
  } = props;
  // console.log(props, 'props');
  const { user } = useShallowSelector(state => ({
    user: state.user.user,
  }));
  const history = useHistory();
  const { pathname } = useLocation();
  const isUserPage = `${cutUrl(pathname)}` === `@${user?.userCode}`;
  const stageItem = project.processFlagList.find(item => item.id === stage);
  // const isExpired = moment(moment.unix(dueDate)).diff(moment()) < 0;
  const isExpired = false;
  const isSender = companyName === user?.company;

  const currentStageItem = useMemo(() => {
    return projectProcessFlagList.find(item => item.stage.includes(stage));
  }, [stage]);

  const handleDeleteProject = projectCode => {
    ProjectActions.delete_project_request({
      projectCode,
    });
  };

  // supportCountryList 없을 경우 request
  // useEffect(() => {
  //   if (!supportCountryList) {
  //     UtilActions.fetch_support_countries_request();
  //   }
  // }, [!!supportCountryList])
  // useEffect(() => {
  //   console.log('link', link);
  // }, [link]);

  // console.log('bridgeList', bridgeList);
  return (
    <Styled.ProjectCard
      data-component-name="ProjectCard"
      className={className}
      hasLink={!!link}
      onClick={() => (!isExpired && link ? history.push(link) : null)}
      hasBoxShadow={hasBoxShadow}
      teethBoxSize={teethBoxSize}
      teethBoxPadding={teethBoxPadding}
    >
      {/* {isUserPage && (stage === 0 || stage === 4) && (
            <div className="projectCard__close_btn">
              <IconButton
                style={{ padding: 5 }}
                className="plainModal__close_btn"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteProject(projectCode);
                }}
              >
                <CloseIcon className="plainModal__close_icon" />
              </IconButton>
            </div>
          )} */}
      {ENV_MODE_DEV && isSender && (
        <div className="projectCard__close_btn">
          <IconButton
            style={{ padding: 2 }}
            className="plainModal__close_btn"
            onClick={e => {
              e.stopPropagation();
              handleDeleteProject(projectCode);
            }}
          >
            <CloseIcon className="plainModal__close_icon" />
          </IconButton>
        </div>
      )}
      {hasNewEvent && (
        <div className="projectCard__new_event">
          <img src={icon_circle_alert} alt="alert" />
        </div>
      )}
      <div className="projectCard__overview_box">
        <div className="projectCard__overview">
          {teeth && (
            <TeethSvgV2
              teeth={{ value: teeth }}
              bridge={{ value: bridgeList }}
              numbering={{ value: notation }}
              hiddenToothText
            />
          )}
          {/* <img src={teeth} alt="teeth" width={90} /> */}
        </div>
      </div>
      <div className="projectCard__info">
        {typeId !== 1 && (
          <div
            className={`projectCard__stage`}
            style={{
              backgroundColor: stageItem?.color,
            }}
          >
            {stageItem?.title}
          </div>
        )}
        <h3 className="projectCard__title">{projectTitle || '-'}</h3>
        <div className="projectCard__subtitle">
          {projectId}
          <CustomSpan
            marginLeft={5}
            fontColor={currentStageItem.color}
            fontSize={12}
            fontWeight={400}
          >
            {currentStageItem.title}
            {/* {stage === 3 && <CustomSpan fontColor={color.stage_done}>(Done)</CustomSpan>} */}
            {stage === 3 && '(Done)'}
          </CustomSpan>
        </div>
        <ul className="projectCard__step_info_list">
          <li className="projectCard__step_info_item">
            <CustomSpan fontSize={13} fontWeight={400} width={125}>
              - <T>GLOBAL_TOTAL_POINTS</T>
            </CustomSpan>
            <CustomSpan fontColor="#9f9f9f" fontWeight={300} marginRight={5}>
              Point
            </CustomSpan>
            {point}
          </li>
          <li className="ul projectCard__step_info_item">
            <CustomSpan fontSize={13} fontWeight={400} width={125}>
              - <T>PROJECT_DUE_DATE</T>
            </CustomSpan>
            {moment(moment.unix(dueDate)).format('MMM. DD. YYYY HH:mm')}
          </li>
          <li className="ul projectCard__step_info_item">
            <CustomSpan fontSize={13} fontWeight={400} width={125}>
              - <T>PROJECT_CAD_PROGRAM</T>
            </CustomSpan>
            {programName}
          </li>
        </ul>
      </div>
      {isExpired && <div className="projectCard__expired">Expired</div>}
      {/* <div className="projectCard__unread">
        <span>10</span>
      </div> */}
      {!!newChatCount && (
        <div className="projectCard__unread">
          <span>{newChatCount}</span>
        </div>
      )}
    </Styled.ProjectCard>
  );
}

const Styled = {
  ProjectCard: styled.div`
    position: relative;
    display: flex;
    /* align-items: center; */
    /* width: 575px; */
    /* height: 220px; */
    /* margin: 10px 10px 0 0; */
    padding: 30px 20px;
    height: 100%;
    box-shadow: ${({ hasBoxShadow }) => hasBoxShadow && '0px 0px 6px rgba(0, 0, 0, 0.16)'};
    border: ${({ hasBoxShadow }) => !hasBoxShadow && `1px solid ${color.gray_border}`};
    background-color: #fff;
    border-radius: 10px;
    cursor: ${({ hasLink }) => hasLink && 'pointer'};
    .projectCard__expired {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.35);
      border-radius: 5px;
      font-size: 48px;
      color: #fff;
      font-weight: 700;
      letter-spacing: 5px;
    }
    .projectCard__close_btn {
      position: absolute;
      top: 5px;
      right: 5px;
      svg {
        margin: -5px 0;
        width: 15px;
      }
    }
    .projectCard__new_event {
      position: absolute;
      top: 20px;
      right: 25px;
    }
    .projectCard__overview_box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: -10px 0px;
      width: ${({ teethBoxSize }) => `${teethBoxSize}px`};
      padding: ${({ teethBoxPadding }) => `0 ${teethBoxPadding}px`};
      box-sizing: content-box !important;
      /* padding: 7px 0;
      border: 1px solid ${color.gray_border2};
      border-radius: 5px;
      background-color: #f4f8f9; */
      .projectCard__overview {
        width: 100%;
      }
    }
    .projectCard__info {
      width: ${({ teethBoxSize }) => `calc(100% - ${teethBoxSize}px)`};
      /* width: calc(100% - 140px); */
      margin-left: 30px;
      .projectCard__stage {
        display: inline-block;
        margin-bottom: 5px;
        min-width: 75px;
        padding: 11px 10px;
        border-radius: 50px;
        text-align: center;
        font-size: 11px;
        line-height: 0;
        color: #fff;
        text-transform: capitalize;
        &.completed {
          background-color: ${color.stage_completed};
        }
        &.waiting {
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
      .projectCard__title {
        display: flex;
        align-items: center;
        padding-right: 10px;
        font-size: 19px;

        font-weight: 700;
        text-transform: capitalize;
        > *:first-child {
          margin-right: 8px;
        }
      }
      .projectCard__subtitle {
        margin-top: 8px;
        font-size: 11px;
        font-weight: 300;
        color: ${color.gray_b5};
      }
      .projectCard__step_info_list {
        margin-top: 35px;
        .projectCard__step_info_item {
          margin-top: 15px;
          font-size: 15px;
          font-weight: 500;
        }
      }
    }
    .projectCard__unread {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 30px;
      background: ${`url(${icon_gradient_bubble}) no-repeat center / cover`};
      font-size: 10px;
      color: white;
      span {
        position: relative;
        top: -2px;
        font-weight: 500;
      }
    }
  `,
};
