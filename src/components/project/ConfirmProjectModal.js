import CustomText from 'components/common/text/CustomText';
import T from 'components/common/text/T';
import React, { useEffect, useState } from 'react';
import { Trans, Translation, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { color } from 'styles/utils';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import cx from 'classnames';
import CustomSpan from 'components/common/text/CustomSpan';
import { addCommas } from 'lib/library';
import { useShallowSelector } from 'lib/utils';
import { ProjectActions } from 'store/actionCreators';

function ConfirmProjectModal() {
  const { company, confirmProject } = useShallowSelector(state => ({
    company: state.user.user?.company,
    confirmProject: state.project.confirmProject.data?.projectConfirm,
  }));
  const point = confirmProject?.rewardPoint;
  const holdingPoint = confirmProject?.currentPoint;
  const [unfoldPoint, setUnfoldPoint] = useState(false);

  return (
    <Styled.ConfirmProjectModal data-component-name="ConfirmProjectModal">
      <div className="confirmProjectModal__middle_box">
        <div className="confirmProjectModal__text_box">
          <CustomText fontSize={22} fontWeight={700}>
            <T>PROJECT_CONFIRM_AND_PAY</T>
          </CustomText>
          <div className="confirmProjectModal__line"></div>
          <p className="confirmProjectModal__current_points">
            <Trans
              defaults="PROJECT_PAYMENT_PAY_QUESTION"
              components={[<b>{{ point }}</b>, <b></b>]}
            />
          </p>
        </div>

        {/* <button
          className={cx('btn-reset confirmProjectModal__point_btn', { on: true })}
        >
          <T>PROJECT_POINT_STATUS</T>
        </button> */}
        <div className="confirmProjectModal__point_box">
          <Grid
            container
            alignItems="center"
            justify="space-between"
            className="confirmProjectModal__holding_point"
          >
            <Grid item>
              <CustomSpan fontSize={13} fontColor={color.gray_b5}>
                <Trans
                  defaults="PROJECT_HOLDING_POINT"
                  components={[
                    <CustomSpan fontColor={color.black_font}>{{ user: company }}</CustomSpan>,
                  ]}
                />
              </CustomSpan>
            </Grid>
            <Grid item>
              <CustomSpan fontSize={22}>
                {addCommas(holdingPoint)}{' '}
                <CustomSpan fontSize={23} fontWeight={300}>
                  P
                </CustomSpan>
              </CustomSpan>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="confirmProjectModal__seperator"></div>

      <div className="confirmProjectModal__bottom_box">
        <T>PROJECT_PAYMENT_PAY_ALERT</T>
      </div>
    </Styled.ConfirmProjectModal>
  );
}

ConfirmProjectModal.propTypes = {
  // point: PropTypes.number.isRequired,
};

export default React.memo(ConfirmProjectModal);

const Styled = {
  ConfirmProjectModal: styled.div`
    .confirmProjectModal__current_points {
      font-size: 20px;
      font-weight: 500;
      b {
        font-size: 21px;
        font-weight: 500;
        color: ${color.blue};
      }
    }
    .confirmProjectModal__line {
      display: block;
      margin: 10px auto 25px;
      width: 80px;
      border-top: 2px solid ${color.blue};
    }
    .confirmProjectModal__seperator {
      width: 100%;
      border-top: 1px dashed ${color.gray_b5};
    }
    .confirmProjectModal__middle_box {
      padding: 30px 40px 15px;
      .confirmProjectModal__text_box {
        text-align: center;
      }
      .confirmProjectModal__point_btn {
        position: relative;
        display: block;
        margin: 0 auto;
        margin-top: 50px;
        width: 130px;
        height: 24px;
        background-color: white;
        border: 1px solid ${color.gray_da};
        font-size: 12px;
        color: ${color.gray_b5};
        border-radius: 15px;
        &.on {
          background-color: ${color.gray_b5};
          border-color: ${color.gray_b5};
          color: white;
        }
      }
      .confirmProjectModal__point_box {
        margin-top: 40px;
        border: 1px solid ${color.gray_da};
        padding: 25px 30px;
        border-radius: 5px;
      }
    }
    .confirmProjectModal__bottom_box {
      padding: 10px 40px 60px;
      text-align: center;
      font-size: 13px;
      color: ${color.gray_b5};
      font-weight: 300;
      line-height: 1.5;
    }
  `,
};
