import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import styled from 'styled-components';
import cx from 'classnames';
import { project } from 'lib/mapper';
import CustomTooltip from 'components/common/tooltip/CustomTooltip';
import { font, color, floatClear } from 'styles/utils';
import { useLocation } from 'react-router-dom';
import { cutUrl } from 'lib/library';
import { step_circle } from 'components/base/images';
import { AppContext } from 'contexts/AppContext';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

/**
 * <StageTimeLine
    stage={informationFormat.stage} // number
    items={timeLineList} // array
    className=""
   />
 * @param {*} props
 * @param {number} stage
 * @param {items} array
 */

const mapTimeLine = project.processFlagList;

export default React.memo(function StageTimeLine(props) {
  // timeline: { project_client: 1609389887, working: null, completed: null }
  // let { stage = null, dateTime = { project_client: undefined } } = props;
  // let { stage = null, dateTime = { waiting: undefined } } = props;
  const { pathname } = useLocation();
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  const isCreatePage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/create';
  const { isProjectClient } = useContext(AppContext);
  let { stage = 0, timeline = { project_client: undefined } } = props;
  const { t } = useTranslation();
  // console.log('stage-', stage);
  // console.log('timeline-', timeline);
  // undefined 에러 방지, 단계 객체 생성 [stage]: null
  timeline = _.reduce(
    mapTimeLine,
    (acc, item) => {
      acc[item.name] = timeline[item.name] || null;
      return acc;
    },
    {},
  );
  // console.log('timeline-', timeline);
  let filterDateTimeLine = _.reduce(
    timeline,
    (acc, value, key) => {
      const findObj = mapTimeLine.find(item => item.name === key);
      return acc.concat({
        number: acc.length + 1,
        name: findObj?.name,
        id: findObj?.id,
        title: findObj?.title,
        dueDate: value,
      });
    },
    [],
  );

  // console.log(filterDateTimeLine, 'filterDateTimeLine');

  // const rolePercent = stage === null ? 40 : 100;
  // 기본 상태인 new가 있기 때문에 + 1
  const perBgSize = 100 / (filterDateTimeLine.length + 1);
  const findStageItem = filterDateTimeLine.find(i => i.id === Number(stage));
  // 현재 기본단위 너비 * 스테이지
  // let bgGradientWidth = !!stage ? perBgSize * (findStageItem?.number + 1) : perBgSize * 1;
  let bgGradientWidth = isDetailPage ? perBgSize * (findStageItem?.number + 1) : perBgSize * 1;

  // useEffect(() => {
  //   console.log(perBgSize, 'perBgSize');
  //   console.log(bgGradientWidth, 'bgGradientWidth');
  // }, [bgGradientWidth]);

  return (
    <Styled.StageTimeLine
      data-component-name="StageTimeLine"
      className={props.className}
      bgSize={bgGradientWidth}
      length={filterDateTimeLine.length}
    >
      <div className="stageTimeLine__box_outer_wrapper">
        <div className="stageTimeLine__box_outer back">
          <div className="stageTimeLine__box back">
            {/* TODO: api data enrollDate 등록 */}
            <div
              className={cx('stageTimeLine__step_item', {
                on: true,
                current: isCreatePage,
                project_designer: !isCreatePage && !isProjectClient,
                project_client: isCreatePage || isProjectClient,
              })}
              style={{
                left: `${perBgSize}%`,
              }}
            >
              <CustomTooltip
                className="tooltip__box"
                disableHoverListener={true}
                // title={moDate}
                placement="bottom"
                interactive={false}
                baseStyle
                // customStyle={{ top: `15px`, right: `-10px` }}
              >
                {/* <span className="stageTimeLine__step_text">New</span> */}
                <span className="stageTimeLine__step_text">
                  <T>PROJECT_PROGRESS_0</T>
                </span>
              </CustomTooltip>
            </div>
            {filterDateTimeLine.map((item, idx) => {
              const containStageStatus = item.id <= stage;
              const prevStageStatus = item.id < stage;
              const equalState = item.id === stage;
              const moDate = moment.unix(item.dueDate).format('YYYY-MM-DD hh:mm');
              const itemLeftPosition = (idx + 2) * perBgSize;
              // console.log('itemLeftPosition', itemLeftPosition);
              if (idx + 1 === filterDateTimeLine.length) return null;
              return (
                <div
                  key={idx}
                  className={cx('stageTimeLine__step_item', {
                    prev: prevStageStatus,
                    on: containStageStatus,
                    current: !isCreatePage && equalState,
                    project_designer: !isCreatePage && !isProjectClient,
                    project_client: isCreatePage || isProjectClient,
                  })}
                  style={{
                    left: `${itemLeftPosition}%`,
                  }}
                >
                  <CustomTooltip
                    className="tooltip__box"
                    disableHoverListener={!item.dueDate}
                    title={moDate}
                    placement="bottom"
                    interactive={false}
                    baseStyle
                    // customStyle={{ top: `15px`, right: `-10px` }}
                  >
                    <span className="stageTimeLine__step_text">
                      {/* {item.title} */}
                      {t(`PROJECT_PROGRESS_${item.number}`)}
                    </span>
                  </CustomTooltip>
                </div>
              );
            })}
            {/* <div className="stageTimeLine__bar back"></div> */}
          </div>
        </div>
        <div
          className={cx('stageTimeLine__box_outer front', {
            project_designer: !isCreatePage && !isProjectClient,
            project_client: isCreatePage || isProjectClient,
          })}
        >
          <div
            className={cx('stageTimeLine__box front', {
              project_designer: !isCreatePage && !isProjectClient,
              project_client: isCreatePage || isProjectClient,
            })}
          >
            <div className="stageTimeLine__bar front">
              <img src={step_circle} alt="circle" className="stageTimeLine__circle"></img>
            </div>
          </div>
        </div>
      </div>
    </Styled.StageTimeLine>
  );
});

const Styled = {
  StageTimeLine: styled.div`
    margin: 0 auto;
    padding-top: 60px;
    padding-bottom: 7px;
    .stageTimeLine__box_outer_wrapper {
      position: relative;
      /* width: 1280px; */
      margin: 0 auto;
    }
    .stageTimeLine__box_outer {
      position: relative;
      width: 100%;
      height: 27px;
      padding: 5px 8px 5.5px;
      border-radius: 25px;
      &.back {
        position: absolute;
        top: 0;
        left: 0;
        /* width: 100%; */
      }
      &.front {
        background: #c7c7c7;
        background: linear-gradient(to top, #f5f5f5 0%, #c7c7c7 100%);
        &.project_designer {
        }
        &.project_client {
          background: #000d58;
          background: linear-gradient(to top, #0e2081 0%, #000d58 100%);
        }
      }
    }
    .stageTimeLine__box {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 15px;
      &.front {
        &.project_client {
          background-color: #040c4d;
        }
        &.project_designer {
          background: #d6d6d6;
          background: linear-gradient(to top, #d6d6d6 0%, #9e9e9e 100%);
        }
      }
      .stageTimeLine__bar {
        position: relative;
        ${({ bgSize }) => bgSize && `width: ${bgSize}%;`};
        height: 100%;
        border-radius: 15px;
        text-align: right;
        &.front {
          background: #0697cb;
          background: linear-gradient(to right, #0697cb 0%, #0079a4 100%);
        }
        .stageTimeLine__circle {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(50%, -50%);
        }
      }
    }
    .stageTimeLine__step_item {
      position: absolute;
      display: inline-block;
      padding: 8px 30px;
      top: -58px;
      transform: translateX(-50%);
      color: #fff;
      &:not(.current) {
        &:after {
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          bottom: -55px;
          height: 41px;
          transform: translateX(-50%);
          border-left: 1px dotted #fff;
        }
      }
      &.current {
        top: -64px;
        border-radius: 5px;
        background-color: #fff;
        color: ${color.blue};
        /* background-color: ${color.blue};
        color: #fff; */
        &:before {
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          bottom: -19px;
          transform: translateX(-50%);
          width: 1px;
          border: 10px solid transparent;
          border-top-color: #fff;
        }
      }
      .stageTimeLine__step_text {
        font-size: 15px;
      }
      &.project_designer {
        color: #8b8b8b;
        &:not(.current) {
          &:after {
            border-left: 1px dotted #ccc;
          }
        }
        &.current {
          background-color: ${color.blue};
          color: #fff;
          &:before {
            border-top-color: ${color.blue};
          }
        }
      }
    }

    //
    .stageTimeLine__temp {
      width: 100%;
      height: 100%;
      background-color: #040c4d;
      border-radius: 15px;
      position: relative;
      width: 100%;
      &.dim {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        ${({ bgSize }) => bgSize && `width: ${bgSize}%;`};
        border-radius: 20px;
        background: #0697cb;
        background: linear-gradient(to right, #0697cb 0%, #0079a4 100%);
      }
      &.box {
        display: inline-flex;
        ${floatClear};
        overflow: hidden;
        background: ${color.gray_border};
        border-radius: 20px;
      }
      &.item {
        /* padding: 8px 8px 8px 200px; */
        text-align: right;
        padding: 8px;
        text-shadow: 2px 2px 2px rgba(51, 51, 51, 0.25);
        ${font(14, color.white)};
        &.on {
          color: white;
        }
        &.prev {
          opacity: 0.5;
        }
        &.current {
          font-weight: bold;
          &.tx {
            text-shadow: 2px 2px 2px rgba(51, 51, 51, 0.25);
          }
        }
      }
      &.tx {
        margin-right: 15px;
      }
    }
    /* .tooltip__box {
      width: ${({ length }) => `calc(100% / ${length + 1})`};
    } */
  `,
};
