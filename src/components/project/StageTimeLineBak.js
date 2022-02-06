import React, { useEffect } from 'react';
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
  // timeline: { create: 1609389887, working: null, completed: null }
  // let { stage = null, dateTime = { create: undefined } } = props;
  // let { stage = null, dateTime = { waiting: undefined } } = props;
  const { pathname } = useLocation();
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  let { stage = 0, timeline = { create: undefined } } = props;
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
      className={props.className}
      bgSize={bgGradientWidth}
      length={filterDateTimeLine.length}
    >
      <div className="StageTimeLine__box box">
        <div className="StageTimeLine__box dim"></div>
        {/* TODO: api data enrollDate 드록 */}
        <CustomTooltip
          className="tooltip__box"
          disableHoverListener={true}
          // title={moDate}
          placement="bottom-end"
          interactive={false}
          baseStyle
          _style={{ top: `15px`, right: `-10px` }}
        >
          <div
            className={cx('StageTimeLine__box item', {
              on: true,
              // prev: prevStageStatus,
              // on: containStageStatus,
              // current: equalState,
            })}
          >
            <span className="StageTimeLine__box tx">New</span>
          </div>
        </CustomTooltip>
        {filterDateTimeLine.map((item, idx) => {
          const containStageStatus = item.id <= stage;
          const prevStageStatus = item.id < stage;
          const equalState = item.id === stage;
          const moDate = moment.unix(item.dueDate).format('YYYY-MM-DD hh:mm');
          return (
            <CustomTooltip
              className="tooltip__box"
              disableHoverListener={!item.dueDate}
              key={idx}
              title={moDate}
              placement="bottom-end"
              interactive={false}
              baseStyle
              _style={{ top: `15px`, right: `-10px` }}
            >
              <div
                className={cx('StageTimeLine__box item', {
                  prev: prevStageStatus,
                  on: containStageStatus,
                  current: equalState,
                })}
              >
                <span className="StageTimeLine__box tx">{item.title}</span>
              </div>
            </CustomTooltip>
          );
        })}
      </div>
    </Styled.StageTimeLine>
  );
});

const Styled = {
  StageTimeLine: styled.div`
    & {
      .StageTimeLine__box {
        position: relative;
        width: 100%;
        &.dim {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: ${color.time_line_bg_gradient};
          ${({ bgSize }) => bgSize && `width: ${bgSize}%;`};
          /* width: 100%; */
          border-radius: 20px;
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
      .tooltip__box {
        width: ${({ length }) => `calc(100% / ${length + 1})`};
      }
    }
  `,
};
