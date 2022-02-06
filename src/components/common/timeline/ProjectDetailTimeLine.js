import React from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import styled from 'styled-components';
import cx from 'classnames';
import { mapper } from 'lib/mapper';
import { CustomTooltip, S_CustomCasePartner } from 'components/common/tooltip';
import { font, color, floatClear, time_line_bg_gradient } from 'styles/__utils';

/**
 * NOTE:
*  <ProjectDetailTimeLine
    stage={informationFormat.stage} // number
    items={timeLineList} // array
    className=""
  />
 * @param {*} props
    @param {number} stage
    @param {items} array
 */

const mapTimeLine = mapper.project.processFlagList;

function ProjectDetailTimeLine(props) {
  let { stage = null, dateTime = {} } = props;
  if (dateTime.create === undefined) {
    dateTime = _.reduce(
      mapTimeLine,
      (acc, item) => {
        acc[item.name] = null;
        return acc;
      },
      {},
    );
  }
  let filterDateTimeLine = _.reduce(
    dateTime,
    (acc, value, key) => {
      const findObj = mapTimeLine.find(item => item.name === key);
      return acc.concat({
        number: acc.length + 1,
        name: key,
        id: findObj?.id,
        title: findObj?.title,
        dueDate: value,
      });
    },
    [],
  );

  const rolePercent = stage === null ? 40 : 100;
  const perBgSize = rolePercent / filterDateTimeLine.length;
  const findStageItem = filterDateTimeLine.find(i => i.id === Number(stage));
  let bgGradientWidth = perBgSize * findStageItem?.number;

  return (
    <Styled.ProjectDetailTimeLine className={props.className} bgSize={bgGradientWidth}>
      <div className="ProjectDetailTimeLine__box box">
        <div className="ProjectDetailTimeLine__box dim"></div>
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
                className={cx('ProjectDetailTimeLine__box item', {
                  prev: prevStageStatus,
                  on: containStageStatus,
                  current: equalState,
                })}
              >
                <span className="ProjectDetailTimeLine__box tx">{item.title}</span>
              </div>
            </CustomTooltip>
          );
        })}
      </div>
    </Styled.ProjectDetailTimeLine>
  );
}

export default ProjectDetailTimeLine;

const Styled = {
  ProjectDetailTimeLine: styled.div`
    & {
      .ProjectDetailTimeLine__box {
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
          display: inline-block;
          ${floatClear};
          overflow: hidden;
          background: ${color.gray_border};
          border-radius: 20px;
        }
        &.item {
          float: left;
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
        width: calc(100% / 4);
      }
    }
  `,
};
