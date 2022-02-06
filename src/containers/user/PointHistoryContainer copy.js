import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import CustomTitle from 'components/common/text/CustomTitle';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { beforeDash, color } from 'styles/utils';
import CustomSpan from 'components/common/text/CustomSpan';
import MuiPagination from 'components/common/pagination/MuiPagination';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import useInput from 'lib/hooks/useInput';
import { PointActions } from 'store/actionCreators';
import { addCommas, isPositive } from 'lib/library';
import DateConverter from 'components/common/convert/DateConverter';
import useFetchLoading from 'lib/hooks/useFetchLoading';

export default function PointHistoryContainer() {
  const {
    historiesData,
    fetchHistoriesSuccess,
    historyStatusData,
    fetchHistoryStatusSuccess,
  } = useShallowSelector(state => ({
    historiesData: state.point.histories.data,
    fetchHistoriesSuccess: state.point.histories.success,
    historyStatusData: state.point.status.data,
    fetchHistoryStatusSuccess: state.point.status.success,
  }));
  const historyList = historiesData?.list;
  const pagingData = historiesData?.pagingData;
  const projectStatusCount = historyStatusData?.projectStatusCount;
  const pointStatus = historyStatusData?.pointStatus;
  const page = useInput(1);

  const historyListParams = useMemo(() => ({ page: page.value }), [page.value]);

  // SECTION: init
  useEffect(() => {
    PointActions.fetch_histories_request(historyListParams);
    PointActions.fetch_status_request();
  }, []);

  // SECTION: onChange
  useDidUpdateEffect(() => {
    PointActions.fetch_histories_request(historyListParams);
  }, [historyListParams]);

  // SECTION: when success fetch
  const { isFetchSuccess } = useFetchLoading({ fetchHistoriesSuccess, fetchHistoryStatusSuccess });
  if (!isFetchSuccess) return null;
  return (
    <PointHistory
      projectStatusCount={projectStatusCount}
      pointStatus={pointStatus}
      historyList={historyList}
      pagingData={pagingData}
      page={page}
    />
  );
}

export const PointHistory = React.memo(
  ({ projectStatusCount, pointStatus, historyList, pagingData, page }) => {
    return (
      <Styled.PointHistory data-component-name="History">
        {/* <div className="sub-layout">
          <CustomTitle fontSize={30} marginTop={80} marginBottom={80} fontWeight={700}>
            My history
          </CustomTitle>
        </div> */}
        <h1 className="history__title page-title">Point History</h1>
        <IntervalGrid
          width={820}
          padding={10}
          hasPaddingGridContainer={false}
          hasCardBorder={true}
          className="history__card_container total"
        >
          <Grid item xs={6} className="history__card_grid_item project">
            <div className="history__card project">
              <p className="history__card_info_row">
                <CustomSpan fontColor={color.blue} fontWeight={700}>
                  Total Projects
                </CustomSpan>
                <CustomSpan fontSize={40} fontWeight={700} fontColor={color.black_font}>
                  {projectStatusCount.totalProject}
                </CustomSpan>
              </p>
              <p className="history__card_info_row">
                <span>Project in progress</span>
                <CustomSpan fontSize={24} fontWeight={700}>
                  {projectStatusCount.inprogressProject}
                </CustomSpan>
              </p>
              <p className="history__card_info_row">
                <span>Completed project</span>
                <CustomSpan fontSize={24} fontWeight={700}>
                  {projectStatusCount.completeProject}
                </CustomSpan>
              </p>
            </div>
          </Grid>
          <Grid item xs={6} className="history__card_grid_item point">
            <div className="history__card point">
              <p className="history__card_info_row">
                <CustomSpan fontColor={color.blue} fontWeight={700}>
                  Total Point
                </CustomSpan>
                <CustomSpan fontSize={40} fontWeight={700} fontColor={color.black_font}>
                  {addCommas(pointStatus.currentPoint)} <CustomSpan fontSize={24}>point</CustomSpan>
                </CustomSpan>
              </p>
              <p className="history__card_info_row">
                <span>Waiting for payment</span>
                <CustomSpan fontSize={24} fontWeight={700}>
                  {addCommas(pointStatus.lockPoint)}{' '}
                  <CustomSpan fontSize={18} marginLeft={5} marginRight={14}>
                    point
                  </CustomSpan>
                </CustomSpan>
              </p>
              <p className="history__card_info_row">
                <span>Completed project</span>
                <CustomSpan fontSize={24} fontWeight={700}>
                  {addCommas(pointStatus.paymentPoint + pointStatus.rewardPoint)}{' '}
                  <CustomSpan fontSize={18} marginLeft={5} marginRight={14}>
                    point
                  </CustomSpan>
                </CustomSpan>
              </p>
            </div>
          </Grid>
        </IntervalGrid>
        <div className="">
          <TableContainer className="history__table_container">
            <Table aria-label="history point table">
              <TableHead className="history__table_head">
                <TableRow>
                  <TableCell align="center">Change points</TableCell>
                  <TableCell align="center">Before points</TableCell>
                  <TableCell align="center">After points</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!!historyList?.length &&
                  historyList.map(item => (
                    <TableRow key={item.pointHistoryIdx}>
                      <TableCell align="center">
                        {isPositive(item.changePoint)
                          ? `+${addCommas(Math.abs(item.changePoint))}`
                          : `-${addCommas(Math.abs(item.changePoint))}`}
                      </TableCell>
                      <TableCell align="center">{addCommas(item.beforePoint)}</TableCell>
                      <TableCell align="center">{addCommas(item.afterPoint)}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell align="center">
                        <DateConverter timestamp={item.enrollDate} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="pagination__container">
          <MuiPagination
            count={pagingData?.totalPage}
            page={page.value}
            onChange={(e, value) => page.setValue(value)}
          />
        </div>
      </Styled.PointHistory>
    );
  },
);

const Styled = {
  PointHistory: styled.section`
    .page-title {
      ${beforeDash({})};
    }
    .history__title {
      padding-bottom: 20px;
    }
    .history__card_container {
      /* .history__card_grid_item.project {
        max-width: 39.44%;
        flex-basis: 39.44%;
      }
      .history__card_grid_item.point {
        max-width: 60.56%;
        flex-basis: 60.56%;
      } */
      .history__card {
        border-radius: 5px;
        /* padding-top: 40px;
        padding-bottom: 40px; */
        &.project {
          padding-left: 40px;
          padding-right: 40px;
        }
        &.point {
          padding-left: 60px;
          padding-right: 60px;
        }
        .history__card_info_row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 18px;
          color: ${color.gray_font};
          &:not(:first-child) {
            margin-top: 20px;
          }
        }
      }
    }
    .history__table_container {
      margin-top: 50px;
      th,
      td {
      }
      th:nth-child(1),
      th:nth-child(2),
      th:nth-child(3) {
        width: 15%;
      }
      th:nth-child(4),
      td:nth-child(4) {
        padding-left: 50px;
      }
      td:nth-child(4) {
        text-transform: capitalize;
      }
      th:last-child {
        width: 20%;
      }
      .history__table_head {
        th {
          background-color: ${color.gray_bg1};
          font-weight: 700;
        }
      }
    }
    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
};
