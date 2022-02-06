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
import { useHistory, useParams } from 'react-router-dom';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { beforeDash, color } from 'styles/utils';
import CustomSpan from 'components/common/text/CustomSpan';
import MuiPagination from 'components/common/pagination/MuiPagination';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import useInput from 'lib/hooks/useInput';
import { PointActions, StoreActions } from 'store/actionCreators';
import { addCommas, isPositive } from 'lib/library';
import DateConverter from 'components/common/convert/DateConverter';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import StorePaymentDetailContainer from 'containers/store/StorePaymentDetailContainer';

import PlainModal from 'components/common/modal/PlainModal';
import AppModal from 'components/common/modal/AppModal';
import { currencyList } from 'lib/mapper';

export default function PointHistoryContainer() {
  const {
    historiesData,
    fetchHistoriesSuccess,
    historyStatusData,
    fetchHistoryStatusSuccess,
    paymentOrders,
    fetchPaymentOrdersSuccess,
  } = useShallowSelector(state => ({
    historiesData: state.point.histories.data,
    fetchHistoriesSuccess: state.point.histories.success,
    historyStatusData: state.point.status.data,
    fetchHistoryStatusSuccess: state.point.status.success,
    paymentOrders: state.store.storeOrders.data,
    fetchPaymentOrdersSuccess: state.store.storeOrders.success,
  }));
  const historyList = historiesData?.list;
  const pagingData = historiesData?.pagingData;
  const paymentOrderList = paymentOrders?.list;
  const paymentPagingData = paymentOrders?.pagingData;
  const projectStatusCount = historyStatusData?.projectStatusCount;
  const pointStatus = historyStatusData?.pointStatus;
  const page = useInput(1);
  const paymentPage = useInput(1);

  const historyListParams = useMemo(() => ({ page: page.value }), [page.value]);
  const paymentListParams = useMemo(() => ({ page: paymentPage.value }), [paymentPage.value]);
  const isOpenPaymentDetailPopup = useInput(false);
  const orderNo = useInput('');

  // SECTION: init
  useEffect(() => {
    PointActions.fetch_histories_request(historyListParams);
    PointActions.fetch_status_request();
    StoreActions.fetch_store_orders_request(paymentListParams);
  }, []);

  // SECTION: onChange
  useDidUpdateEffect(() => {
    PointActions.fetch_histories_request(historyListParams);
  }, [historyListParams]);

  useDidUpdateEffect(() => {
    StoreActions.fetch_store_orders_request(paymentListParams);
  }, [paymentListParams]);

  const test123 = () => {
    console.log('test123123123123132');
  };

  const handleCloseAccountDetaildModal = () => {
    isOpenPaymentDetailPopup.setValue(false);
  };

  // SECTION: when success fetch
  const { isFetchSuccess } = useFetchLoading({
    fetchHistoriesSuccess,
    fetchHistoryStatusSuccess,
    fetchPaymentOrdersSuccess,
  });
  if (!isFetchSuccess) return null;
  return (
    <PointHistory
      projectStatusCount={projectStatusCount}
      pointStatus={pointStatus}
      historyList={historyList}
      paymentOrderList={paymentOrderList}
      pagingData={pagingData}
      page={page}
      paymentPagingData={paymentPagingData}
      paymentPage={paymentPage}
      test123={test123}
      isOpenPaymentDetailPopup={isOpenPaymentDetailPopup}
      orderNo={orderNo}
      onCloseModal={handleCloseAccountDetaildModal}
    />
  );
}

export const PointHistory = React.memo(
  ({
    projectStatusCount,
    pointStatus,
    historyList,
    pagingData,
    page,
    paymentOrderList,
    paymentPagingData,
    paymentPage,
    isOpenPaymentDetailPopup,
    orderNo,
    onCloseModal,
    test123 = () => {},
  }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { uid, oid } = useParams();
    return (
      <Styled.PointHistory data-component-name="History">
        {/* <div className="sub-layout">
          <CustomTitle fontSize={30} marginTop={80} marginBottom={80} fontWeight={700}>
            My history
          </CustomTitle>
        </div> */}

        <PlainModal isOpen={isOpenPaymentDetailPopup.value} onClick={onCloseModal} width={960}>
          <AppModal
            title=""
            content={
              <StorePaymentDetailContainer onCloseModal={onCloseModal} orderNo={orderNo.value} />
            }
            contentCardStyle={{
              // padding: '0 0 30px 0',
              padding: 0,
              backgroundColor: 'transparent',
            }}
            isCloseIcon={true}
            onClick={onCloseModal}
            onCancel={onCloseModal}
            hideButton={true}
          />
        </PlainModal>

        <h1 className="history__title page-title">
          <T>USER_MENU_POINT_HISTORY</T>
        </h1>

        <h2 className="sr-only">Point Status</h2>
        <IntervalGrid
          width={830}
          padding={10}
          hasPaddingGridContainer={false}
          hasCardBorder={true}
          className="history__card_container total"
        >
          <Grid item xs={6} className="history__card_grid_item project">
            <div className="history__card project">
              <h3 className="history__card_info_title">
                <T>GLOBAL_PROJECT</T>
              </h3>
              <p className="history__card_info_row">
                <span>
                  <T>USER_POINT_IN_PROGRESS</T>
                </span>
                <CustomSpan>
                  {projectStatusCount.inprogressProject}
                  <CustomSpan fontColor={color.gray_font2} marginLeft={15}>
                    <T>GLOBAL_CASE</T>
                  </CustomSpan>
                </CustomSpan>
              </p>
              <p className="history__card_info_row">
                <span>
                  <T>PROJECT_COMPLETED</T>
                </span>
                <CustomSpan>
                  {projectStatusCount.completeProject}
                  <CustomSpan fontColor={color.gray_font2} marginLeft={15}>
                    <T>GLOBAL_CASE</T>
                  </CustomSpan>
                </CustomSpan>
              </p>
              <p className="history__card_info_row total">
                <CustomSpan fontColor={color.blue}>
                  <T>GLOBAL_TOTAL_PROJECTS</T>
                </CustomSpan>
                <CustomSpan fontColor={color.blue} fontSize={20}>
                  {projectStatusCount.totalProject}
                  <CustomSpan fontColor={color.gray_font2} marginLeft={15} fontSize={14}>
                    <T>GLOBAL_CASE</T>
                  </CustomSpan>
                </CustomSpan>
              </p>
            </div>
          </Grid>
          <Grid item xs={6} className="history__card_grid_item point">
            <div className="history__card point">
              <h3 className="history__card_info_title">
                <T>USER_POINT_PAYMENT</T>
              </h3>
              <p className="history__card_info_row">
                <span>
                  <T>USER_POINT_STATUS_WAITING</T>
                </span>
                <CustomSpan>
                  {addCommas(pointStatus.lockPoint)}{' '}
                  <CustomSpan fontColor={color.gray_font2} marginLeft={15}>
                    <T>USER_POINT</T>
                  </CustomSpan>
                </CustomSpan>
              </p>
              <p className="history__card_info_row">
                <span>
                  <T>USER_POINT_STATUS_COMPLETED</T>
                </span>
                <CustomSpan>
                  {addCommas(pointStatus.paymentPoint + pointStatus.rewardPoint)}{' '}
                  <CustomSpan fontColor={color.gray_font2} marginLeft={15}>
                    <T>USER_POINT</T>
                  </CustomSpan>
                </CustomSpan>
              </p>
              <p className="history__card_info_row total">
                <CustomSpan fontColor={color.blue}>
                  <T>USER_POINT_HISTORY_TOTAL_PAYMENT</T>
                </CustomSpan>
                <CustomSpan fontColor={color.blue} fontSize={20}>
                  {addCommas(pointStatus.currentPoint)}{' '}
                  <CustomSpan fontColor={color.gray_font2} marginLeft={15} fontSize={14}>
                    <T>USER_POINT</T>
                  </CustomSpan>
                </CustomSpan>
              </p>
            </div>
          </Grid>
        </IntervalGrid>

        <div className="history__table_wrapper">
          <h2 className="history__table_title">
            <T>USER_POINT_HISTORY_TRANSACTION</T>
          </h2>
          <TableContainer className="history__table_container">
            <Table aria-label="history point table">
              <TableHead className="history__table_head">
                <TableRow>
                  <TableCell>
                    <T>USER_POINT_HISTORY_TRAFFIC</T>
                  </TableCell>
                  <TableCell align="center">
                    <T>USER_POINT_HISTORY_AMOUNT</T>{' '}
                    <CustomSpan fontWeight="normal">
                      (<T>USER_POINT</T>)
                    </CustomSpan>
                  </TableCell>
                  <TableCell>
                    <T>GLOBAL_STATUS</T>
                  </TableCell>
                  <TableCell>
                    <T>GLOBAL_DATE</T>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!!historyList?.length &&
                  historyList.map((item, index) => {
                    console.log('history item ______ ', item);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {isPositive(item.changePoint) ? (
                            <T>USER_POINT_INCOMING</T>
                          ) : (
                            <T>USER_POINT_OUTGOING</T>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Grid container>
                            <Grid item xs={4}>
                              {!isPositive(item.changePoint)
                                ? `-${addCommas(Math.abs(item.changePoint))}p`
                                : `-`}
                            </Grid>
                            <Grid item xs={4}>
                              {isPositive(item.changePoint) ? (
                                <CustomSpan fontColor={color.blue}>
                                  +{addCommas(Math.abs(item.changePoint))}p
                                </CustomSpan>
                              ) : (
                                `-`
                              )}
                            </Grid>
                            <Grid item xs={4}>
                              {addCommas(item.afterPoint)}p
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <DateConverter timestamp={item.enrollDate} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

        <div className="history__payment_table_wrapper">
          <h2 className="history__payment_table_title">
            <T>USER_POINT_HISTORY_ACCOUNT</T>
          </h2>
          <TableContainer className="history__payment_table_container">
            <Table aria-label="history point table">
              <TableHead className="history__payment_table_head">
                <TableRow>
                  <TableCell>
                    <T>USER_POINT_HISTORY_PAYMENT_NO</T>
                  </TableCell>
                  <TableCell>
                    <T>USER_POINT_HISTORY_PAYMENT_TYPE</T>
                  </TableCell>
                  <TableCell>
                    <T>USER_POINT_HISTORY_PAYMENT_STATUS</T>
                  </TableCell>
                  <TableCell align="center">
                    <T>USER_POINT_HISTORY_PAYMENT_PRICE</T>
                  </TableCell>
                  <TableCell>
                    <T>GLOBAL_DATE</T>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!!paymentOrderList?.length &&
                  paymentOrderList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <CustomSpan fontColor={color.blue}>
                          <span
                            className="history__payment_table_order_no"
                            onClick={() => {
                              // history.push(`/@${uid}/order/point-history/detail/${item.orderNo}`);
                              // test123();
                              isOpenPaymentDetailPopup.setValue(true);
                              orderNo.setValue(item.orderNo);
                            }}
                          >
                            {item.orderNo}
                          </span>
                        </CustomSpan>
                      </TableCell>
                      <TableCell>
                        {!!item.pgcodeIdx ? t(`USER_POINT_STORE_PAYMENT_${item.pgcodeIdx}`) : '-'}
                      </TableCell>
                      <TableCell>
                        {item.status !== null ? t(`USER_POINT_PAYMENT_STEP_${item.status}`) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: currencyList.find(i => i.type === item?.currency)?.symbol,
                          }}
                        ></span>{' '}
                        {addCommas(Math.abs(item.price))}
                      </TableCell>
                      <TableCell>
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
            count={paymentPagingData?.totalPage}
            page={paymentPage.value}
            onChange={(e, value) => paymentPage.setValue(value)}
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
      .history__card {
        border-radius: 5px;
        padding: 20px 33px 15px;
        .history__card_info_title {
          /* font-size: 18px; */
          position: relative;
          left: -33px;
          ${beforeDash({ width: 25, height: 2, marginRight: 10, fontSize: 18 })};
          padding-bottom: 10px;
        }
        .history__card_info_row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 14px;
          color: ${color.gray_font};
          &:not(:first-child) {
            margin-top: 15px;
          }
          &.total {
            padding-top: 15px;
            border-top: 1px dashed ${color.gray_border};
          }
        }
      }
    }
    .history__table_wrapper,
    .history__payment_table_wrapper {
      margin-top: 50px;
      padding: 0 60px;
    }
    .history__table_title,
    .history__payment_table_title {
      ${beforeDash({ width: 25, height: 2, marginRight: 10, fontSize: 18 })};
    }
    .history__table_container {
      margin-top: 20px;
      tr {
        &:nth-of-type(even) {
          background-color: ${color.gray_table};
        }
      }
      th,
      td {
        padding: 10px;
        /* padding-left: 10px;
        padding-right: 10px; */
      }
      th:nth-child(1),
      td:nth-child(1) {
        padding-left: 35px;
      }
      th:nth-child(2) {
        width: 35%;
      }
      th:nth-child(3) {
        width: 30%;
      }
      th:nth-child(3),
      td:nth-child(3) {
        padding-left: 20px;
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
        border-top: 1px solid ${color.gray_border2};
        border-top-width: 2px;
        th {
          border-bottom-width: 2px;
          font-weight: 700;
        }
      }
    }

    .history__payment_table_container {
      margin-top: 20px;
      tr {
        &:nth-of-type(even) {
          background-color: ${color.gray_table};
        }
      }
      th,
      td {
        padding: 10px;
        /* padding-left: 10px;
        padding-right: 10px; */
      }
      th:nth-child(1),
      td:nth-child(1) {
        padding-left: 35px;
        width: 32%;
      }
      th:nth-child(2) {
        /* width: 35%; */
        width: 23%;
      }
      th:nth-child(3) {
        /* width: 30%; */
        /* width: 25%; */
      }
      th:nth-child(3),
      td:nth-child(3) {
        /* padding-left: 20px; */
        width: 16%;
      }
      th:nth-child(4),
      td:nth-child(4) {
        padding-right: 20px;
        width: 16%;
      }
      td:nth-child(4) {
        text-transform: capitalize;
      }
      th:last-child {
        /* width: 20%; */
        width: 14%;
      }
      .history__payment_table_head {
        border-top: 1px solid ${color.gray_border2};
        border-top-width: 2px;
        th {
          border-bottom-width: 2px;
          font-weight: 700;
        }
      }
      .history__payment_table_order_no {
        &:hover {
          cursor: pointer;
          text-decoration: underline;
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
