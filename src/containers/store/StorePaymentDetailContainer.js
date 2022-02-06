import { Grid } from '@material-ui/core';
import DateConverter from 'components/common/convert/DateConverter';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { beforeDash, color, paper } from 'styles/utils';
import _ from 'lodash';
import { complete_check_shadow, complete_fail_shadow } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { useTranslation, Trans } from 'react-i18next';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { StoreActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { addCommas } from 'lib/library';
import { useParams } from 'react-router-dom';
import { currencyList } from 'lib/mapper';

const testFailData = {
  jsonType: 'store.payletter.payment.get.res.json',
  status: 200,
  receipt_url: null,
  purchaseData: {
    purchase: {
      purchaseIdx: 447,
      orderNo: 'J7210614090687525482',
      status: 2,
      currency: 'KRW',
      msg: null,
      enrollDate: 1623661945,
    },
    purchaseItemList: [
      {
        count: 1,
        point: 100,
        price: 119000,
        productCode: 'BRIDGE_POINT_CHARGE_100',
        productName: 'Point 100',
        purchaseItemIdx: 1092,
      },
    ],
    payletterPurchase: {
      taxfree_amount: 0,
      tax_amount: 0,
      amount: 119000,
      email_flag: 'Y',
      email_addr: 'receiver@doflab.com',
      receipt_flag: 'Y',
    },
    payletterPurchaseResponse: null,
    payletterReceipt: null,
    payletterVirtualaccount: {
      account_no: '30122416402747',
      account_name: '테스터',
      account_holder: 'DOF Inc.',
      bank_code: '88',
      bank_name: '신한은행',
      issue_tid: 'IniTechPG_inivacct01202111221809',
      expire_date: '20211129',
      expire_time: '',
    },
  },
};

const testSucAccountData = {
  jsonType: 'store.payletter.payment.get.res.json',
  status: 200,
  receipt_url: null,
  purchaseData: {
    purchase: {
      purchaseIdx: 1068,
      orderNo: 'J7211130031142660107',
      status: 1,
      currency: 'KRW',
      msg: null,
      enrollDate: 1638241519,
    },
    purchaseItemList: [
      {
        purchaseItemIdx: 1097,
        price: 1200,
        count: 1,
        productCode: 'BRIDGE_POINT_CHARGE_100',
        productName: 'Point 100',
        point: 100,
      },
    ],
    payletterPurchase: {
      taxfree_amount: 0,
      tax_amount: 0,
      amount: 1200,
      email_flag: 'Y',
      email_addr: 'receiver@doflab.com',
      receipt_flag: 'Y',
    },
    payletterPurchaseResponse: {
      pgcodeIdx: 2,
      pay_info: '56211101380912',
      transaction_date: '2021-11-30 12:07:54',
      install_month: 0,
      card_info: '',
    },
    payletterReceipt: {
      cash_receipt_code: '0',
      cash_receipt_message: '',
      cash_receipt_type: '01',
      cash_receipt_issue_type: '1',
      cash_receipt_cid: '101110942',
      cash_receipt_payer_sid: '01084784171',
      cash_receipt_deal_no: 'J7211130031142660107',
    },
    payletterVirtualaccount: {
      account_no: '56211101380912',
      account_name: '곽영훈',
      account_holder: 'DOF Inc.',
      bank_code: '88',
      bank_name: '신한은행',
      issue_tid: 'IniTechPG_inivacct01202111301205',
      expire_date: '20211207',
      expire_time: '',
    },
  },
};

const testCardData = {
  jsonType: 'store.payletter.payment.get.res.json',
  status: 200,
  receipt_url: null,
  purchaseData: {
    purchase: {
      purchaseIdx: 743,
      orderNo: 'J7210701140779694135',
      status: 1,
      currency: 'USD',
      msg: null,
      enrollDate: 1625115936,
    },
    purchaseItemList: [
      {
        purchaseItemIdx: 775,
        price: 1,
        count: 1,
        productCode: 'BRIDGE_POINT_CHARGE_100',
        productName: 'Point 100',
        point: 100,
      },
    ],
    payletterPurchase: {
      taxfree_amount: 0,
      tax_amount: 0,
      amount: 100,
      email_flag: 'Y',
      email_addr: 'receiver@doflab.com',
      receipt_flag: 'N',
    },
    payletterPurchaseResponse: {
      pgcodeIdx: 3,
      pay_info: '신한',
      transaction_date: '2021-06-22 16:15:16',
      card_info: '1234********1234',
    },
    payletterReceipt: {
      cash_receipt_code: '0',
      cash_receipt_message: '성공!',
      cash_receipt_type: '1',
      cash_receipt_issue_type: '1',
      cash_receipt_cid: null,
      cash_receipt_payer_sid: null,
      cash_receipt_deal_no: null,
    },
  },
};

const testAccountData = {
  jsonType: 'store.payletter.payment.get.res.json',
  status: 200,
  receipt_url: null,
  purchaseData: {
    purchase: {
      purchaseIdx: 447,
      orderNo: 'J7210614090687525482',
      status: 0,
      currency: 'KRW',
      msg: null,
      enrollDate: 1623661945,
    },
    purchaseItemList: [
      {
        count: 1,
        point: 100,
        price: 119000,
        productCode: 'BRIDGE_POINT_CHARGE_100',
        productName: 'Point 100',
        purchaseItemIdx: 1092,
      },
    ],
    payletterPurchase: {
      taxfree_amount: 0,
      tax_amount: 0,
      amount: 119000,
      email_flag: 'Y',
      email_addr: 'receiver@doflab.com',
      receipt_flag: 'Y',
    },
    // payletterPurchase: null,
    payletterPurchaseResponse: null,
    payletterReceipt: null,
    payletterVirtualaccount: {
      account_no: '30122416402747',
      account_name: '테스터',
      account_holder: 'DOF Inc.',
      bank_code: '88',
      bank_name: '신한은행',
      issue_tid: 'IniTechPG_inivacct01202111221809',
      expire_date: '20211129',
      expire_time: '',
    },
  },
};

export default React.memo(function StorePaymentDetailContainer({ onClose, orderNo }) {
  const {
    fetchReceipt,
    fetchPaymentOrder,
    fetchOrderSuccess,
    fetchReceiptSuccess,
  } = useShallowSelector(state => ({
    fetchReceipt: state.store.receiptInfo,
    fetchPaymentOrder: state.store.paymentDetail?.data,
    fetchOrderSuccess: state.store.paymentDetail?.success,
    fetchReceiptSuccess: state.store.receiptInfo?.success,
  }));

  const { oid } = useParams();
  const paymentOrder = fetchPaymentOrder?.purchaseData;
  // const paymentOrder = testCardData.purchaseData;
  // const paymentOrder = testFailData.purchaseData;
  // const paymentOrder = testSucAccountData.purchaseData;
  // const paymentOrder = testAccountData.purchaseData;

  const purchase = paymentOrder?.purchase;
  const purchaseList = paymentOrder?.purchaseItemList;
  const payletterPurchase = paymentOrder?.payletterPurchase;
  const payletterVirtualaccount = paymentOrder?.payletterVirtualaccount;
  const receiptUrl = fetchReceipt?.data?.receipt_url;

  const purchaseResult = paymentOrder?.payletterPurchaseResponse;
  const order_no = !orderNo ? oid : orderNo;
  const { t } = useTranslation();

  const invoice_test_url =
    'https://testpg.payletter.com/PGSVC/AllTheGate/Receipt_All.asp?id=72720c6d230e662b|001|4|32303139303431313133333130333933633933353730353463667840e437916d87688f911fe7e47d0e95a93d9df938db9aaccd46be0c2c79ea5cc2d44409da94db829bf8e93a4cc4ae33f1f6b5385ec5ea26cebed254970d01b6519b';

  useEffect(() => {
    StoreActions.fetch_payment_detail_request({ order_no });
  }, []);

  const handleInvoice = () => {
    // window.open(receiptUrl);
    // StoreActions.make_payment_receipt_info_request({ order_no: oid });
    StoreActions.make_payment_receipt_info_request({ order_no });
  };

  const handleCashInvoice = () => {
    //order_no=WR210617030600614878&type=1&tax_flag=N&return_url=
    const submitData = {
      order_no: oid,
      type: 1,
      tax_flag: 'N',
      return_url: '',
    };
    StoreActions.make_payment_cash_receipt_request(submitData);
  };

  useDidUpdateEffect(() => {
    if (fetchReceiptSuccess) {
      window.open(receiptUrl);
      // window.open(invoice_test_url);
      // StoreActions.make_payment_receipt_info_request({ order_no: oid });
    }
  }, [fetchReceiptSuccess === true]);

  // const { isFetchSuccess } = useFetchLoading({ fetchOrderSuccess });
  // if (!isFetchSuccess) return null;
  return (
    <StorePaymentDetail
      orderNo={orderNo}
      purchase={purchase}
      purchaseList={purchaseList}
      payletterPurchase={payletterPurchase}
      payletterVirtualaccount={payletterVirtualaccount}
      purchaseResult={purchaseResult}
      handleInvoice={handleInvoice}
    />
  );
});
export const StorePaymentDetail = React.memo(
  ({
    orderNo,
    purchase,
    purchaseList,
    payletterPurchase,
    payletterVirtualaccount,
    purchaseResult,
    handleInvoice,
  }) => {
    const { t } = useTranslation();
    return (
      <Styled.StorePaymentDetail data-component-name="StorePaymentDetail">
        <h1 className="storePaymentDetail__title page-title">{!!orderNo ? orderNo : `Payment`}</h1>

        <section className="storePaymentDetail__content_wrapper">
          <h2 className="sr-only">Payment State</h2>
          {/* 결제 에러 */}
          {!purchaseResult && purchase?.status === 2 && (
            <div className="storePaymentDetail__content_box payment">
              <div className="storePaymentDetail__payment_wrapper">
                <img
                  src={complete_fail_shadow}
                  className="storePaymentDetail__status_icon_checkbox"
                />
                <div className="storePaymentDetail__status_content_box">
                  <div className="storePaymentDetail__status_content orderState">
                    <T>USER_POINT_PAYMENT_FAIL</T>
                  </div>
                  <div className="storePaymentDetail__status_content fail">
                    <span className="error_dashed"></span>
                    <T>USER_POINT_PAYMENT_FAIL_DETAIL</T>
                  </div>
                  <div className="storePaymentDetail__status_content expire">
                    <Trans
                      defaults="USER_POINT_PAYMENT_ACCOUNT_TIME"
                      components={[
                        <span></span>,
                        <span className="underline font16 marginLeft15">
                          {{
                            date:
                              payletterVirtualaccount.expire_date.substr(0, 4) +
                              '-' +
                              payletterVirtualaccount.expire_date.substr(4, 2) +
                              '-' +
                              payletterVirtualaccount.expire_date.substr(6, 8) +
                              ' ' +
                              payletterVirtualaccount.expire_time,
                          }}
                        </span>,
                      ]}
                    />
                  </div>
                  <div className="storePaymentDetail__status_content detail">
                    <p>
                      <T>USER_POINT_PAYMENT_ID</T> : {purchase.orderNo}
                    </p>
                    <p>
                      <T>USER_POINT_BANK</T> : {payletterVirtualaccount.bank_name}
                    </p>
                    <p>
                      <T>USER_POINT_EXCHANGE_ACCOUNT_NUMBER</T> :{' '}
                      {payletterVirtualaccount.account_no}
                    </p>
                    <p>
                      <T>USER_POINT_HISTORY_AMOUNT</T> :{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: currencyList.find(item => item.type === purchase.currency)
                            ?.symbol,
                        }}
                      ></span>{' '}
                      {addCommas(payletterPurchase.amount)}
                    </p>
                  </div>
                </div>
                <div className="storePaymentDetail__content_invoice_box"></div>
              </div>
            </div>
          )}
          {/* 결제 성공 */}
          {!!purchaseResult && purchase.status !== 2 && (
            <div className="storePaymentDetail__content_box payment">
              <div className="storePaymentDetail__payment_wrapper">
                <img
                  src={complete_check_shadow}
                  className="storePaymentDetail__status_icon_checkbox"
                />
                <div className="storePaymentDetail__status_content_box">
                  <div className="storePaymentDetail__status_content orderState">
                    <T>USER_POINT_PAYMENT</T>
                    <div className="orderState__text_box">
                      <div className="underline">
                        {payletterPurchase.amount} {purchase.currency}
                      </div>
                      <div>
                        <T>USER_POINT_PAYMENT_SUCCESS</T>
                      </div>
                    </div>
                    {/* <Trans
                      defaults="USER_POINT_PAYMENT_SUCCESS"
                      components={[
                        <span></span>,
                        <span className="underline lineHeight32">
                          {{
                            price: `${payletterPurchase.amount} `,
                          }}
                        </span>,
                        <span className="underline lineHeight32 marginRight5 fontSize20 verticalMiddle">
                          {{
                            type: purchase.currency,
                          }}
                        </span>,
                      ]}
                    /> */}
                  </div>
                  <div className="storePaymentDetail__status_content detail">
                    {purchaseResult?.pgcodeIdx === 2 ? (
                      // pgcodeIdx === 2 => 계좌이체 인경우, 나머지는 카드
                      <>
                        <p>
                          <T>USER_POINT_PAYMENT_ID</T> : {purchase.orderNo}
                        </p>
                        <p>
                          <T>GLOBAL_DATE</T> : {purchaseResult.transaction_date}
                        </p>

                        <p>
                          <T>USER_POINT_STORE_PAYMENT_2</T> : {payletterVirtualaccount.bank_name}
                          {', '}
                          {purchaseResult.pay_info}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <T>USER_POINT_PAYMENT_ID</T> : {purchase.orderNo}
                        </p>
                        <p>
                          <T>GLOBAL_DATE</T> : {purchaseResult.transaction_date}
                        </p>

                        <p>
                          <T>USER_POINT_HISTORY_PAYMENT_TYPE</T> : {purchaseResult.pay_info}
                          {', '}
                          {purchaseResult.card_info}
                        </p>

                        <p>
                          <T>USER_POINT_HISTORY_PAYMENT_INSTALLMENT</T> :{' '}
                          {!purchaseResult.install_month ? (
                            <T>USER_POINT_HISTORY_PAYMENT_INSTALLMENT_NONE</T>
                          ) : (
                            <>
                              {purchaseResult.install_month} <T>GLOBAL_MONTH</T>
                            </>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="storePaymentDetail__content_invoice_box">
                  <MuiButton
                    disableElevation
                    color="primary"
                    variant="contained"
                    className="storePaymentDetail__content_invoice_button sm"
                    onClick={handleInvoice}
                  >
                    <T>USER_POINT_PAYMENT_INVOICE</T>
                  </MuiButton>
                </div>
              </div>
            </div>
          )}
          {/* 결제 입금 대기 */}
          {!!payletterVirtualaccount && !purchaseResult && purchase.status !== 2 && (
            <div className="storePaymentDetail__content_box payment">
              <div className="storePaymentDetail__payment_wrapper">
                <img
                  src={complete_check_shadow}
                  className="storePaymentDetail__status_icon_checkbox"
                />
                <div className="storePaymentDetail__status_content_box">
                  <div className="storePaymentDetail__status_content orderState">
                    <T>USER_POINT_PAYMENT_ORDER_SUCCESS</T>
                  </div>
                  <div className="storePaymentDetail__status_content expire">
                    <Trans
                      defaults="USER_POINT_PAYMENT_ACCOUNT_TIME"
                      components={[
                        <span></span>,
                        <span className="underline font16 marginLeft15">
                          {{
                            date:
                              payletterVirtualaccount.expire_date.substr(0, 4) +
                              '-' +
                              payletterVirtualaccount.expire_date.substr(4, 2) +
                              '-' +
                              payletterVirtualaccount.expire_date.substr(6, 8) +
                              ' ' +
                              payletterVirtualaccount.expire_time,
                          }}
                        </span>,
                      ]}
                    />
                  </div>

                  <div className="storePaymentDetail__status_content detail">
                    <p>
                      <T>USER_POINT_PAYMENT_ID</T> : {purchase.orderNo}
                    </p>
                    <p>
                      <T>USER_POINT_BANK</T> : {payletterVirtualaccount.bank_name}
                    </p>
                    <p>
                      <T>USER_POINT_EXCHANGE_ACCOUNT_NUMBER</T> :{' '}
                      {payletterVirtualaccount.account_no}
                    </p>
                    <p>
                      <T>USER_POINT_HISTORY_AMOUNT</T> :{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: currencyList.find(item => item.type === purchase?.currency)
                            ?.symbol,
                        }}
                      ></span>{' '}
                      {addCommas(payletterPurchase?.amount)}
                    </p>
                  </div>
                </div>
                <div className="storePaymentDetail__content_invoice_box"></div>
              </div>
            </div>
          )}
        </section>

        <section className="storePaymentDetail__content_wrapper">
          <h1 className="storePaymentDetail__content_title product">
            <T>USER_POINT_PAYMENT_INVOICE</T>
          </h1>
          <div className="storePaymentDetail__content_box product">
            <Grid container className="storePaymentDetail__product_wrapper productTable">
              <Grid container item className="productTable_row header">
                <Grid item className="productTable_row_item">
                  <T>USER_POINT_PAYMENT_INVOICE_PRODUCT</T>
                </Grid>
                <Grid item className="productTable_row_item">
                  <T>USER_POINT_HISTORY_AMOUNT</T>
                </Grid>
                <Grid item className="productTable_row_item">
                  <T>USER_POINT_HISTORY_PAYMENT_STATUS</T>
                </Grid>
                <Grid item className="productTable_row_item">
                  <T>GLOBAL_DATE</T>
                </Grid>
              </Grid>
              {!!purchaseList?.length &&
                purchaseList.map(item => (
                  <Grid container item className="productTable_row body" key={item.purchaseItemIdx}>
                    <Grid item className="productTable_row_item">
                      {item.productName}
                    </Grid>
                    <Grid item className="productTable_row_item">
                      {'$'} {addCommas(item.point)}
                      {purchase.currency !== 'USD' && (
                        <>
                          {' '}
                          (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: currencyList.find(item => item.type === purchase.currency)
                                ?.symbol,
                            }}
                          ></span>{' '}
                          {addCommas(item.price)})
                        </>
                      )}
                    </Grid>
                    <Grid item className="productTable_row_item">
                      {t(`USER_POINT_PAYMENT_STEP_${purchase.status}`)}
                    </Grid>
                    <Grid item className="productTable_row_item">
                      <DateConverter timestamp={purchase.enrollDate} />
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </div>
        </section>
      </Styled.StorePaymentDetail>
    );
  },
);

const Styled = {
  StorePaymentDetail: styled.section`
    ${paper};
    width: 940px;
    padding-top: 47px;
    .strong {
      font-weight: 700;
    }

    .underline {
      text-decoration: underline;
      /* padding: 0 2px; */
    }
    .lineHeight32 {
      line-height: 32px;
    }
    .verticalMiddle {
      vertical-align: middle;
    }
    .font16 {
      font-size: 16px;
    }
    .fontSize20 {
      font-size: 20px;
    }
    .paddingRight5 {
      padding-right: 5px;
    }
    .marginLeft15 {
      margin-left: 15px;
    }
    .marginRight5 {
      margin-right: 5px;
    }
    .page-title {
      ${beforeDash({})};
    }
    .storePaymentDetail__title {
      padding-bottom: 20px;
    }

    .storePaymentDetail__content_wrapper {
      .storePaymentDetail__content_title {
        ${beforeDash({ width: 25, height: 2, marginRight: 10, fontSize: 18 })};
        text-transform: capitalize;
        margin: 40px 0 20px 25px;
      }
      .storePaymentDetail__content_box {
        padding: 0 60px;
        .storePaymentDetail__payment_wrapper {
          width: 770px;
          background-color: ${color.navy_blue};
          margin-left: 50px;
          margin-top: 70px;
          position: relative;
          border-radius: 10px;
          display: flex;
          padding: 20px 0;
          .storePaymentDetail__status_icon_checkbox {
            position: absolute;
            top: -60px;
            left: -60px;
          }
          .storePaymentDetail__status_content_box {
            width: calc(100% - 240px);
            padding: 30px 55px 30px;
            display: flex;
            flex-direction: column;
            color: ${color.white};
            border-right: 1px dashed ${color.white};

            .storePaymentDetail__status_content {
              position: relative;
              &.orderState {
                font-size: 24px;
                font-weight: 700;
                line-height: 46px;
                margin-bottom: 30px;
                word-break: break-word;
                white-space: break-spaces;
                .orderState__text_box {
                  display: flex;
                  column-gap: 10px;
                }
              }
              &.expire {
                font-size: 14px;
                font-weight: 400;
                margin-bottom: 35px;
                /* margin-bottom: 20px; */
              }
              &.fail {
                font-size: 15px;
                font-weight: 400;
                line-height: 25px;
                margin-bottom: 35px;
              }
              &.detail {
                line-height: 25px;
                p {
                  font-size: 14px;
                  font-weight: 400;
                }
              }
              .error_dashed {
                position: absolute;
                left: -55px;
                top: 10px;
                ${beforeDash({
                  width: 45,
                  height: 2,
                  // marginRight: 10,
                  // fontSize: 18,
                  backgroundColor: 'red',
                })};
              }
            }
          }
          .storePaymentDetail__content_invoice_box {
            width: 240px;
            /* padding-bottom: 15px; */
            display: flex;
            justify-content: center;
            align-items: flex-end;
            .storePaymentDetail__content_invoice_button {
              width: 200px;
              height: 35px;
              border-radius: 18px;
              background-color: #023b90;
              font-size: 12px;
              font-weight: 400;
            }
          }

          .storePaymentDetail__status_content {
          }
        }

        .storePaymentDetail__product_wrapper {
          .productTable_row {
            display: flex;
            align-items: center;
            border-top: 1px solid #bababa;
            &.header {
              height: 40px;
              font-size: 14px;
              font-weight: 400;
            }
            &.body {
              height: 50px;
              font-size: 12px;
              font-weight: 300;
              background-color: #fbfbfb;
            }
            .productTable_row_item {
              &:nth-child(1) {
                width: 160px;
                padding-left: 55px;
              }
              &:nth-child(2) {
                width: 390px;
              }
              &:nth-child(3) {
                width: 100px;
              }
              &:nth-child(4) {
                width: 120px;
              }
            }
          }
        }
      }
    }
  `,
};
