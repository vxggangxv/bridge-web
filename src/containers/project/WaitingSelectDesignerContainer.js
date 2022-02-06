import { Grid } from '@material-ui/core';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import AttendingDesignerCard from 'components/project/AttendingDesignerCard';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { DesignerActions, ProjectActions } from 'store/actionCreators';
import styled from 'styled-components';
import { color, paper, paperSubtitle } from 'styles/utils';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import MuiButton from 'components/common/button/MuiButton';
import { pageUrl } from 'lib/mapper';
import moment from 'moment';
import _ from 'lodash';
import useInput from 'lib/hooks/useInput';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default function WaitingSelectDesignerContainer(props) {
  const {
    // user,
    // projectData,
    selectDesignerList,
    fetchSelectDesignersSuccess,
  } = useShallowSelector(state => ({
    // user: state.user.user,
    // projectData: state.project.project.data,
    selectDesignerList: state.designer.selectDesigners.data?.selectDesigner,
    fetchSelectDesignersSuccess: state.designer.selectDesigners.success,
  }));
  const { pcode: projectCode } = useParams();
  // isOnline
  // isInvite
  // likeStatus

  // SECTION: init request
  useEffect(() => {
    DesignerActions.fetch_select_designers_request({ projectCode });
    return () => {
      DesignerActions.fetch_select_designers_clear();
    };
  }, []);

  const { isFetchSuccess } = useFetchLoading({ fetchSelectDesignersSuccess });
  return (
    <WaitingSelectDesigner
      isFetchSuccess={isFetchSuccess}
      selectDesignerList={selectDesignerList}
    />
  );
}

export const WaitingSelectDesigner = React.memo(({ isFetchSuccess, selectDesignerList }) => {
  const { pcode: projectCode } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  // attendStatus - 1: reject, 3: select, 12: select expired
  // const selectAttendStatusList = [1, 3, 12];
  // const selectDesignerList = selectDesignerList?.filter(item =>
  //   selectAttendStatusList.includes(item.attendStatus),
  // );
  // TEST:
  // useEffect(() => {
  //   console.log('selectDesignerList', selectDesignerList);
  // }, [selectDesignerList]);

  // 실시간 반영을 위해 state에 담기
  const [selectDesignerItems, setAttendDesignerItems] = useState([]);
  // const selectDesignerItems = useInput([]);

  // selectDesigners가 전부 isPast인지 확인
  const isPastSelectDesigners = useMemo(() => {
    // console.log(
    //   'isPastSelectDesigners',
    //   selectDesignerItems.every(item => !!item.isPast),
    // );
    const isPast = selectDesignerItems?.every(item => !!item.isPast);
    console.log('isPast', isPast);
    return isPast === undefined ? true : isPast;
  }, [selectDesignerItems]);

  const convertWaitingDesignerTimeList = useCallback(() => {
    setAttendDesignerItems(() => {
      const selectDesignerItemsValue = selectDesignerList.reduce((acc, curr, idx) => {
        const { designerCode, expiredDate } = curr;
        const currentDiff = moment(moment.unix(expiredDate)).diff(moment());
        const isPast = currentDiff < 0;
        const diffMinutes = Math.floor(moment.duration(currentDiff).asMinutes());
        const diffSeconds = Math.floor(moment.duration(currentDiff).asSeconds());
        const isMinute = diffMinutes >= 1;
        const diffTime = isMinute
          ? `${diffMinutes} ${t('GLOBAL_MINUTES')}`
          : `${diffSeconds} ${t('GLOBAL_SECONDS')}`;
        // let diffTime = Math.floor(moment.duration(currentDiff).asMinutes());
        console.log('diffTime', diffTime);
        // let diffTime = moment.unix(expiredDate).fromNow();

        let obj = {
          ...curr,
          isPast,
          diffTime,
        };
        // if (idx !== 0) {
        //   obj = {
        //     ...obj,
        //     isPast: false,
        //   };
        // }
        // console.log('obj', obj);

        return acc.concat(obj);
      }, []);
      return _.orderBy(selectDesignerItemsValue, 'expiredDate', 'asc');
    });
  }, [selectDesignerList]);

  // SECTION: init 실시간 selectDesignerItems 갱신, clear함수 실행
  let setRealtimeDiff;
  let setRealtimeDiffTest;
  // selectDesignerList에 시간 속성을 추가
  useEffect(() => {
    console.log('selectDesignerList', selectDesignerList);

    // length 통해서 한번 실행 되도록 설정
    if (!!selectDesignerList?.length) {
      // console.log('set convertDiffTime');
      // convertDiffTime({});
      convertWaitingDesignerTimeList();

      // const expiredDateList = selectDesignerList.map(item => item.expiredDate);
      // if (expiredDateList.every(item => moment(moment.unix(item)).diff(moment()) < 0)) {
      //   console.log('clear setRealtimeDiff');
      //   // refetch, projectStatus
      //   ProjectActions.fetch_project_request({ projectCode });
      //   clearInterval(setRealtimeDiff);
      // }
    }
    // return () => {
    //   console.log('clear setRealtimeDiff');
    //   clearInterval(setRealtimeDiff);
    // };
  }, [!!selectDesignerList?.length]);

  // 매초 갱신된 designer의 isPast값을 확인해서 전체 만료시 종료
  useEffect(() => {
    // const expiredDateList = selectDesignerList.map(item => item.expiredDate);
    console.log('isPastSelectDesigners', isPastSelectDesigners);
    // realtimeDiff 실행
    if (!isPastSelectDesigners) {
      console.log('set convertDiffTime');
      setRealtimeDiff = setInterval(() => {
        console.log('start setRealtimeDiff');
        convertWaitingDesignerTimeList();
      }, 1000);
    } else {
      // realtimeDiff 종료
      console.log('clear setRealtimeDiff');
      // refetch, projectStatus
      ProjectActions.fetch_project_request({ projectCode });
      clearInterval(setRealtimeDiff);
    }
    return () => {
      console.log('clear setRealtimeDiff');
      clearInterval(setRealtimeDiff);
    };
  }, [isPastSelectDesigners]);

  // useEffect(() => {
  //   setRealtimeDiffTest = setInterval(() => {
  //     console.log('set RealtimeDiffTest');
  //   }, 1000);
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('clear setRealtimeDiffTest');
  //     clearInterval(setRealtimeDiffTest);
  //   }, 5000);
  // }, []);

  useEffect(() => {
    console.log('selectDesignerItems', selectDesignerItems);
    // // 첫번째거를 찾음 -> 현재 시간 보여줌
    // console.log(selectDesignerItems?.find(item => !item.isPast));
  }, [selectDesignerItems]);

  return isFetchSuccess ? (
    <Styled.WaitingSelectDesigner data-component-name="WaitingSelectDesigner">
      <Grid container justify="space-between" className="waitingSelectDesigner__content_title_box">
        <Grid item xs={6}>
          <h1 className="waitingSelectDesigner__content_title">
            <T>PROJECT_WAITING_DESIGNER</T>
          </h1>
        </Grid>
        <Grid item xs={6} container alignItems="center" justify="flex-end">
          {/* <button className="waitingSelectDesigner__delete_btn btn-reset" onClick={onDeleteProject}>
            Project Delete
          </button> */}
        </Grid>
      </Grid>

      <div className="waitingSelectDesigner__interval_card_grid_wrapper">
        <IntervalGrid
          width={820}
          padding={10}
          hasPaddingGridContainer={false}
          className="waitingSelectDesigner__interval_card_grid_container"
        >
          {!!selectDesignerItems?.length &&
            selectDesignerItems.map((item, index) => {
              // 추가 된 state
              // isPast, diffTime
              // isPast가 false인 첫번째
              const isCurrentOrderId = selectDesignerItems.find(i => !i.isPast)?.designerCode;

              return (
                <Grid key={index} item xs={3} className="waitingSelectDesigner__card_grid_item">
                  <AttendingDesignerCard
                    item={item}
                    isMatching={true}
                    isCurrentOrderId={isCurrentOrderId}
                    // matchingOrderItem={matchingOrderItem}
                    // isCurrentOrderItem={isCurrentOrderItem}
                    className="waitingSelectDesigner__card"
                  />
                </Grid>
              );
            })}
        </IntervalGrid>
      </div>

      <div className="waitingSelectDesigner__submit_container">
        <div className="waitingSelectDesigner__submit_notice">
          <ErrorOutlineOutlinedIcon htmlColor="inherit" />
          <T>PROJECT_DESIGNER_NOTIFY_SEQUENTIALLY</T>
        </div>
        <Grid container justify="space-between" className="waitingSelectDesigner__submit_grid_box">
          <Grid item xs={3} className="waitingSelectDesigner__submit_grid_item">
            <MuiButton
              disableElevation
              variant="outlined"
              color="primary"
              className="waitingSelectDesigner__submit_btn"
              onClick={() => history.push(pageUrl.project.list)}
            >
              <T>GLOBAL_PROJECT_LIST</T>
            </MuiButton>
          </Grid>

          <Grid
            item
            xs={9}
            container
            justify="flex-end"
            className="waitingSelectDesigner__submit_grid_item"
          >
            <MuiButton
              disableElevation
              variant="contained"
              color="primary"
              className="waitingSelectDesigner__submit_btn"
              disabled
            >
              <T>PROJECT_WAITING</T>
            </MuiButton>
          </Grid>
        </Grid>
      </div>
    </Styled.WaitingSelectDesigner>
  ) : (
    <Styled.WaitingSelectDesigner data-component-name="WaitingSelectDesigner" />
  );
});

const Styled = {
  WaitingSelectDesigner: styled.section`
    ${paper};
    padding-bottom: 30px;
    min-height: 445px;
    .waitingSelectDesigner__content_title_box {
      padding-right: 50px;
    }
    .waitingSelectDesigner__content_title {
      ${paperSubtitle};
    }
    .waitingSelectDesigner__delete_btn {
      margin-left: 40px;
      color: ${color.gray_font2};
      text-decoration: underline;
    }
    .waitingSelectDesigner__interval_card_grid_wrapper {
      margin: 0px 45px;
      height: 280px;
      /* overflow-y: auto;
      overflow-x: hidden; */
    }
    .waitingSelectDesigner__interval_card_grid_container {
      padding: 6px 0;
    }
    .waitingSelectDesigner__submit_container {
      margin: 35px 50px 0;
      .waitingSelectDesigner__submit_notice {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: ${color.gray_week_font};
        svg {
          font-size: 18px;
          margin-right: 5px;
        }
      }
      .waitingSelectDesigner__submit_grid_box {
        margin-top: 15px;
        .waitingSelectDesigner__submit_grid_item {
          .button:not(:first-child) {
            margin-left: 10px;
          }
        }
        .waitingSelectDesigner__submit_btn {
          min-width: 130px;
        }
      }
    }
  `,
};
