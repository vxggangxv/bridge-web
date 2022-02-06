import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import cx from 'classnames';
import ImgCrop from 'components/common/images/ImgCrop';
import {
  icon_paper_plane,
  icon_user_circle,
  icon_tool,
  icon_earth,
  icon_dollar,
  icon_calendar,
} from 'components/base/images';
import StarScore from 'components/common/score/StarScore';
import { color, opensansFont } from 'styles/utils';
import { pageUrl } from 'lib/mapper';
import moment from 'moment';
import Color from 'color';
import PropTypes from 'prop-types';
import BookmarkIcon from 'components/base/icons/BookmarkIcon';

/**
 * @param {object} item : 해당 data
 * @param {boolean} isWaiting : waiting stage
 * @param {boolean} isMatching : matching stage
 * @param {number} designerPushOrder : waiting stage, selectDesigner시 사용되는 UI표시
 * @param {function} onClickDesigner : waiting stage, selectDesigner시 사용되는 함수
 * @param {array} waitingDesignerTimeList : matching stage, waitingDesigner시 사용되는 함수
 */
export const AttendingDesignerCard = React.memo(
  ({
    className,
    item,
    isWaiting,
    designerPushOrder,
    onClickDesigner = () => {},
    isMatching,
    isCurrentOrderId,
  }) => {
    const history = useHistory();

    // attendStatus - 1: reject, 3: select, 12: select expired
    const isCurrent = isCurrentOrderId === item.designerCode;
    const isReject = item.attendStatus === 1;
    const isExpired = item.isPast;
    let waitStatusText = '';

    if (isMatching) {
      if (isCurrent) {
        waitStatusText = item.diffTime;
      } else if (isReject) {
        waitStatusText = `Reject`;
      } else if (isExpired) {
        waitStatusText = `Expired`;
      } else {
        waitStatusText = `Next`;
      }
    }

    return (
      <Styled.AttendingDesignerCard
        data-component-name="AttendingDesignerCard"
        className={`attendingDesigner__card box-shadow-default ${className}`}
        onClick={() => {
          if (isWaiting) onClickDesigner({ userCode: item.designerCode, company: item.company });
        }}
      >
        {isMatching && (
          <div
            className={cx('attendDesigner__wait_status', {
              current: isCurrent,
              reject: isReject || isExpired,
            })}
          >
            <div className="attendDesigner__wait_status_number">{item.pushOrder}</div>
            <div className="attendDesigner__wait_status_text">{waitStatusText}</div>
          </div>
        )}
        <span className="attendingDesigner__card_like">
          {!!item.likeStatus && <BookmarkIcon width={11.5} />}
        </span>
        <div className="attendingDesigner__card_content">
          <div
            className="attendingDesigner__card_row user"
            onClick={() =>
              history.push(`${pageUrl.designer.index}/@${item.designerCode}/portfolio`)
            }
          >
            <div className="attendingDesigner__card_cell label">
              <figure
                className={cx('attendingDesigner__card_cell_profile_figure', {
                  online: !!item.isOnline,
                })}
              >
                {item.profileImg ? (
                  <ImgCrop isCircle src={item.profileImg} className="box-shadow-default" />
                ) : (
                  <img
                    src={icon_user_circle}
                    alt="user"
                    className="box-shadow-default radius-circle"
                  />
                )}
              </figure>
            </div>
            <div className="attendingDesigner__card_cell text" title={item.company}>
              <div className="attendingDesigner__card_cell_company_box">
                <span className="attendingDesigner__card_cell_company">{item.company}</span>
                {!!item.isInvite && (
                  <img
                    src={icon_paper_plane}
                    alt="airplain"
                    className="attendingDesigner__card_cell_airplain_icon"
                  />
                )}
              </div>
              <div className="attendingDesigner__card_cell_score">
                <StarScore score={item.grade} size={11} gutter={3} hideText={true} />
              </div>
            </div>
          </div>
          <div className="attendingDesigner__card_row program">
            <div className="attendingDesigner__card_cell label">
              <img src={icon_tool} alt="tool" className="attendingDesigner__card_cell_tool_icon" />
            </div>
            <div className="attendingDesigner__card_cell text">{item.program}</div>
          </div>
          <div className="attendingDesigner__card_row language">
            <div className="attendingDesigner__card_cell label">
              <img
                src={icon_earth}
                alt="earth"
                className="attendingDesigner__card_cell_earth_icon"
              />
            </div>
            <div className="attendingDesigner__card_cell text">{item.languageGroup}</div>
          </div>
          <div className="attendingDesigner__card_row dollar">
            <div className="attendingDesigner__card_cell label">
              <img
                src={icon_dollar}
                alt="dollar"
                className="attendingDesigner__card_cell_dollar_icon"
              />
            </div>
            <div className="attendingDesigner__card_cell text">{item.workPoint} $</div>
          </div>
          <div className="attendingDesigner__card_row time">
            <div className="attendingDesigner__card_cell label">
              <img
                src={icon_calendar}
                alt="calendar"
                className="attendingDesigner__card_cell_calendar_icon"
              />
            </div>
            <div className="attendingDesigner__card_cell text">
              {moment.unix(item.deliveryDate).format('YY-MM-DD')},{' '}
              {moment.unix(item.deliveryDate).format('HH:mm')}
            </div>
          </div>
        </div>
        {designerPushOrder && (
          <div className="attendingDesigner__card_select">{designerPushOrder}</div>
        )}
      </Styled.AttendingDesignerCard>
    );
  },
);

AttendingDesignerCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default AttendingDesignerCard;

const Styled = {
  AttendingDesignerCard: styled.div`
    &.attendingDesigner__card {
      position: relative;
      width: 100%;
      min-height: 200px;
      padding: 25px 12px 20px;
      border-radius: 5px;
      .attendDesigner__wait_status {
        position: absolute;
        left: 0;
        top: 0;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
        width: 85px;
        height: 30px;
        padding: 3px;
        border-radius: 15px;
        background-color: ${color.gray_font2};
        color: ${color.gray_font2};
        line-height: 0;
        &.current {
          background-color: ${color.blue};
          color: ${color.blue};
        }
        &.reject {
          background-color: ${color.navy_blue_deep};
          color: ${color.navy_blue_deep};
          flex-direction: row-reverse;
        }
        .attendDesigner__wait_status_number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background-color: #fff;
          border-radius: 50%;
          font-size: 17px;
        }
        .attendDesigner__wait_status_text {
          width: calc(100% - 24px);
          text-align: center;
          font-size: 12px;
          color: #fff;
        }
      }
      .attendingDesigner__card_like {
        position: absolute;
        top: 0;
        right: 10px;
        line-height: 0;
      }
      .attendingDesigner__card_select {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background-color: ${Color(color.blue).alpha(0.7)};
        font-family: ${opensansFont};
        font-size: 97px;
        color: #fff;
      }
      .attendingDesigner__card_row {
        display: flex;
        align-items: center;
        &:first-child {
          margin-bottom: 20px;
        }
        &:not(:first-child) {
          margin-top: 9px;
        }
        .attendingDesigner__card_cell {
          &.label {
            width: 34px;
            margin-right: 6px;
            text-align: center;
          }
          &.text {
            width: calc(100% - 40px);
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        &.user {
          font-size: 12px;
          cursor: pointer;
          .attendingDesigner__card_cell_profile_figure {
            position: relative;
            width: 34px;
            height: 34px;
            &:after {
              content: '';
              position: absolute;
              top: 1px;
              /* left: 1px; */
              right: 1px;
              display: block;
              width: 8px;
              height: 8px;
              background-color: ${color.gray_week_font};
              border-radius: 50%;
            }
            &.online {
              &:after {
                /* background-color: #00ff11; */
                background-color: ${color.blue};
              }
            }
          }
          .attendingDesigner__card_cell_company_box {
            position: relative;
            display: flex;
            align-items: center;
          }
          .attendingDesigner__card_cell_company {
            max-width: calc(100% - 15px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .attendingDesigner__card_cell_airplain_icon {
            margin-left: 4px;
            width: 11px;
          }
          .attendingDesigner__card_cell_score {
            margin-top: 5px;
          }
        }
        &.score {
        }
        &.program {
        }
        &.language {
        }
        &.dollar {
        }
        &.time {
        }
      }
    }
  `,
};
