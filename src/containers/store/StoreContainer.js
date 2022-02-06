import { FormControlLabel, FormGroup, Grid, Radio, RadioGroup } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import useInput from 'lib/hooks/useInput';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { beforeDash, color, opensansFont } from 'styles/utils';
import _ from 'lodash';
import cx from 'classnames';

import { icon_check_select_new, icon_check_no_new } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { AppActions, UtilActions, StoreActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import {
  store_coin_68,
  store_coin_69,
  store_coin_70,
  store_card_68,
  store_card_69,
  store_card_70,
  icon_pgcode_credit_card,
  icon_pgcode_account_transfer,
  icon_pgcode_global_card,
} from 'components/base/images';
import { useHistory, useLocation } from 'react-router-dom';
import { addCommas } from 'lib/library';
import CustomSpan from 'components/common/text/CustomSpan';
import StoreUserCardContainer from './StoreUserCardContainer';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import { pageUrl } from 'lib/mapper';

export default React.memo(function StoreContainer(props) {
  const { user, util, store, payment, fetchStoreSuccess, fetchPgCodeSuccess, fetchPaymentSuccess } =
    useShallowSelector(state => ({
      user: state.user.user,
      util: state.util.payletterPgcodes,
      store: state.store.storeProducts,
      payment: state.store.makePayment,
      fetchStoreSuccess: state.store.storeProducts?.success,
      fetchPgCodeSuccess: state.util.payletterPgcodes?.success,
      fetchPaymentSuccess: state.store.makePayment?.success,
    }));
  const history = useHistory();
  const { pathname } = useLocation();
  const userCompany = user.company;
  const pgcodeList = util?.data?.pgcodeList;
  const productList = store?.data?.list;
  const userEmail = user?.email;
  const selectedPoint = useInput(0);
  const product = useInput({});
  const paymentType = useInput(0);
  const payletterResultUrl = payment?.data?.payletterResult?.online_url;
  const paymentResultOrderNo = payment?.data?.paymentResult?.order_no;
  const [newWindow, setNewWindow] = useState();
  const clickBlock = useInput('none');

  const newWindowMessage = useInput('');
  const { t } = useTranslation();

  const [newWindowFlag, setNewWindowFlag] = useState(false);
  const [isWindowClosed, setIsWindowClosed] = useState(false);

  /** UI상에서 product card를 만들때, product별로 img가 달라 해당 obj array로 맵핑 */
  const coinIconList = [
    { id: 68, src: store_coin_68, circle: store_card_68 },
    { id: 69, src: store_coin_69, circle: store_card_69 },
    { id: 70, src: store_coin_70, circle: store_card_70 },
  ];

  const pgcodeIconList = [
    { id: 1, src: icon_pgcode_credit_card },
    { id: 2, src: icon_pgcode_account_transfer },
    { id: 3, src: icon_pgcode_global_card },
    { id: 4, src: icon_pgcode_credit_card },
  ];

  const paymentCancelPopup = useCallback(() => {
    AppActions.add_popup({
      isOpen: true,
      type: 'alert',
      title: <T>GLOBAL_ALERT</T>,
      content: t('ALARM_PAYMENT_CANCELED'),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        return;
      },
    });
  }, []);

  useEffect(() => {
    UtilActions.fetch_payletter_pgcodes_request();
    StoreActions.fetch_store_products_request();
  }, []);

  // window refresh 전 이벤트 체크 후, sessionStorage에 isRefresh 등록하여 리프레쉬 여부 등록
  const handleRefreshAction = event => {
    event.preventDefault();
    if (!!newWindow) {
      sessionStorage.setItem('isRefresh', true);
      newWindow.close();
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleRefreshAction);
    return () => {
      window.removeEventListener('beforeunload', handleRefreshAction, false);
    };
  }, [newWindow]);

  useEffect(() => {
    //sessionStorage에 isRefresh 여부를 확인하여, 결제취소 팝업창 팝업
    if (sessionStorage.getItem('isRefresh')) {
      paymentCancelPopup();
      sessionStorage.removeItem('isRefresh');
    }
  }, []);

  const handleSubmit = () => {
    const submitParams = {
      pgcodeIdx: paymentType.value,
      productList: [
        {
          productIdx: selectedPoint.value,
          count: 1,
        },
      ],
      emailFlag: 'Y',
      emailAddr: userEmail,
    };

    StoreActions.make_payment_payletter_request(submitParams);
    return;
  };

  useDidUpdateEffect(() => {
    if (fetchPaymentSuccess === true) {
      setNewWindow(
        window.open(payletterResultUrl, 'payletterChild', 'width=770,height=400,top=500,left=500'),
      );
      setNewWindowFlag(true);
      clickBlock.onChange({ value: 'block' });
    }
  }, [fetchPaymentSuccess === true]);

  const windowInitStatus = () => {
    newWindowMessage.onChange({
      value: '',
    });
    setNewWindow('');
    setNewWindowFlag(false);
    clickBlock.onChange({ value: 'none' });
  };

  useDidUpdateEffect(() => {
    if (!!newWindow) {
      // PaymentContainer에서 넘어온 postMessgae 처리 부분
      // PostMessgae로 넘어온 데이터를 받아서 저장 failure <= cancel, success <= success
      window.addEventListener(
        'message',
        e => {
          // console.info('postMassage ___ ', e);
          if (
            e.origin == 'https://www.dofbridge.com' ||
            e.origin == 'https://dofbridge.com' ||
            e.origin == 'http://15.164.27.98:28030' ||
            e.origin == 'http://localhost:3000'
          ) {
            // console.info('e.data.result ______ ', e.data.result);
            newWindowMessage.setValue(e.data.result || '');
          }
        },
        false,
      );
    }
  }, [newWindow]);

  useDidUpdateEffect(() => {
    // postMessage 로 받아온 데이터가 변하면
    if (!!newWindowMessage.value) {
      // child window를 0.3초 뒤에 parent에서 직접 close, 기존 -> child window에서 close || 변경 -> parent window에서 close
      if (newWindow?.close()) {
        newWindow.close();
      }
      // setTimeout(function () {}, 300);
    }
  }, [newWindowMessage.value]);

  useDidUpdateEffect(() => {
    // newWindow closed check interval
    if (!!newWindowFlag && !isWindowClosed) {
      const checkNewWindow = setInterval(function () {
        // console.info('checkNewWindow interval _____ ', newWindow?.closed);
        if (newWindow?.closed) {
          setIsWindowClosed(!!newWindow?.closed);
          clearInterval(checkNewWindow);
        }
      }, 500);
    }
  }, [newWindow?.closed]);

  useDidUpdateEffect(() => {
    if (!!isWindowClosed) {
      // window closed 감지 시, 후처리 newWindowMessage가 success가 아닌경우 모두 failure 처리
      setIsWindowClosed(false);
      if (newWindowMessage.value === 'success') {
        // console.info("newWindowMessage.value === 'success'");
        setTimeout(function () {
          windowInitStatus();
          history.push(`/store/detail/${paymentResultOrderNo}`);
        }, 300);
      } else {
        // console.info("newWindowMessage.value === 'failure'");
        setTimeout(function () {
          paymentCancelPopup();
          windowInitStatus();
        }, 300);
      }
    }
  }, [isWindowClosed]);

  useDidUpdateEffect(() => {
    if (fetchStoreSuccess === true) {
      selectedPoint.setValue(productList[0].productIdx);
      product.setValue(productList[0]);
    }
  }, [fetchStoreSuccess === true]);

  useDidUpdateEffect(() => {
    if (fetchPgCodeSuccess === true) {
      paymentType.setValue(String(pgcodeList[0].pgcodeIdx));
    }
  }, [fetchPgCodeSuccess === true]);

  const handleProduct = e => {
    const value = e.target.value;
    selectedPoint.onChange({ value });
    const selected_product = productList.filter(function (obj) {
      return Number(obj.productIdx) === Number(value);
    })[0];
    product.onChange({ value: selected_product });
  };

  const localWindowOpenTest = url => {
    setNewWindow(window.open(url, 'payletterChild', 'width=474,height=745,top=500,left=500'));
    clickBlock.onChange({ value: 'block' });
    setNewWindowFlag(true);
  };

  const { isFetchSuccess } = useFetchLoading({ fetchStoreSuccess, fetchPgCodeSuccess });
  if (!isFetchSuccess) return null;
  return (
    <Store
      userCompany={userCompany}
      coinIconList={coinIconList}
      pgcodeIconList={pgcodeIconList}
      selectedPoint={selectedPoint}
      product={product}
      paymentType={paymentType}
      productList={productList}
      pgcodeList={pgcodeList}
      clickBlock={clickBlock}
      handleProduct={handleProduct}
      onSubmit={handleSubmit}
      localWindowOpenTest={localWindowOpenTest}
    />
  );
});

export const Store = React.memo(
  ({
    userCompany,
    coinIconList,
    pgcodeIconList,
    selectedPoint,
    product,
    paymentType,
    productList,
    pgcodeList,
    clickBlock,
    handleProduct = () => {},
    onSubmit,
    localWindowOpenTest = () => {},
  }) => {
    const { t } = useTranslation();
    return (
      <Styled.Store data-component-name="Store" clickBlock={clickBlock.value}>
        <h1 className="sr-only">Store</h1>
        <div className="store__popup_click_blocker"></div>
        <div className="store__container_wrapper main-layout">
          <h2 className="store__welcome_text">
            <T>USER_WELCOME</T>,{' '}
            <CustomSpan fontSize={25} fontWeigth={400} fontColor="#1DA7E0" fontStyle="italic">
              {userCompany}
            </CustomSpan>
          </h2>
          <div className="store__container">
            <section className="store__main_card">
              <h1 className="store__title">
                <T>USER_MENU_POINT_STORE</T>
              </h1>
              {/* <------------------------------------------------------------------------------------------> */}
              <div className="store__note_box">
                <h2 className="store__note_title">
                  <T>USER_POINT_STORE_NOTE</T>
                </h2>
                <ul className="store__note_detail">
                  <li>
                    <T>USER_POINT_STORE_NOTE_PURCHASE_DETAIL_1</T>
                  </li>
                  <li>
                    <T>USER_POINT_STORE_NOTE_PURCHASE_DETAIL_2</T>
                  </li>
                  <li>
                    <T>USER_POINT_STORE_NOTE_PURCHASE_DETAIL_3</T>
                  </li>
                </ul>
              </div>
              {/* <------------------------------------------------------------------------------------------> */}
              <div className="store__point_product_list_box">
                <h2 className="store__point_product_title point">
                  <T>GLOBAL_POINTS</T>
                </h2>
                <FormGroup row className="store__point_product_card_group">
                  {productList?.length > 0 &&
                    productList.map((item, key) => {
                      const checked = Number(selectedPoint.value) === item.productIdx;
                      const checkIcon = checked ? icon_check_select_new : icon_check_no_new;
                      const store_coin = coinIconList.filter(function (obj) {
                        return Number(obj.id) === Number(item.productIdx);
                      })[0];

                      return (
                        <label
                          className={cx('store__point_product_card', { active: checked })}
                          key={item.productIdx}
                        >
                          <input
                            type="checkbox"
                            className="store__point_product_input"
                            name="selectedPoint"
                            value={item.productIdx}
                            checked={checked}
                            onChange={e => {
                              handleProduct(e);
                            }}
                          />
                          <img
                            src={checkIcon}
                            alt="check icon"
                            className="store__point_product_check_box"
                          />
                          <div className="store__point_product_info_box">
                            <Grid container className="store__point_product_box">
                              <Grid container item className="store__point_product_row">
                                <Grid item className="store__point_product_row_item image">
                                  <img src={store_coin.src} />
                                </Grid>
                                <Grid item className="store__point_product_row_item point">
                                  <CustomSpan fontSize={33} fontWeight={700}>
                                    {addCommas(item.point)}
                                  </CustomSpan>
                                  <div className="point_text">
                                    <T>USER_POINT</T>
                                  </div>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid className="store__point_product_price">
                              $ {addCommas(item.price)}
                            </Grid>
                          </div>
                          <img className="store__point_product_circle" src={store_coin.circle} />
                        </label>
                      );
                    })}
                </FormGroup>
              </div>
              {/* <------------------------------------------------------------------------------------------> */}
              <div className="store__payment_list_box">
                <h2 className="store__payment_list_title payment">
                  <T>USER_POINT_PAYMENT</T>
                </h2>

                <MuiWrapper className="store__payment_list_group_wrapper">
                  <RadioGroup
                    className="store__payment_list_group"
                    aria-label="refund"
                    name="refund"
                    value={paymentType.value}
                    onChange={e => {
                      paymentType.onChange(e);
                    }}
                  >
                    {pgcodeList?.length > 0 &&
                      pgcodeList.map((item, key) => {
                        const icon_pgcode = pgcodeIconList.filter(function (obj) {
                          return Number(obj.id) === Number(item.pgcodeIdx);
                        })[0];
                        if (!!icon_pgcode) {
                          return (
                            <FormControlLabel
                              key={item.pgcodeIdx}
                              value={String(item.pgcodeIdx)}
                              control={<Radio color="primary" />}
                              className="store__payment_label"
                              label={
                                <div className="payment_label_wrapper">
                                  <div className="payment_label_icon">
                                    <img src={icon_pgcode.src} />
                                  </div>
                                  <div className="payment_label_detail">
                                    <div className="payment_label_detail_name">
                                      {t('USER_POINT_STORE_PAYMENT_' + item.pgcodeIdx)}
                                    </div>
                                    <div className="payment_label_detail_option_box">
                                      {/* <span className="payment_label_detail_option">
                                        {icon_pgcode.option}
                                      </span> */}
                                      {t('USER_POINT_STORE_PAYMENT_INFO_' + item.pgcodeIdx)}
                                    </div>
                                  </div>
                                </div>
                              }
                            />
                          );
                        }
                      })}
                  </RadioGroup>
                </MuiWrapper>
              </div>
              {/* <------------------------------------------------------------------------------------------> */}
              <StyledPlainButtonOuter
                backgroundColor={color.navy_blue}
                left="50%"
                width={390}
                height={56}
                className="store__payment_button_box"
              >
                <MuiButton
                  type="submit"
                  config={{
                    width: '370px',
                  }}
                  disableElevation
                  color="primary"
                  variant="contained"
                  disablebackground={color.navy_blue}
                  disablefontcolor="#ffffff"
                  onClick={onSubmit}
                  className="store__payment_button"
                >
                  <CustomSpan fontSize={15} fontWeight={700}>
                    <T>GLOBAL_PAY</T>
                  </CustomSpan>
                  <span className="partition_line"></span>
                  <CustomSpan fontSize={15} fontWeight={700} marginRight={10}>
                    $ {addCommas(product.value.price)}
                  </CustomSpan>
                  <CustomSpan fontSize={15} fontWeight={300}>
                    {product.value.currencySub && (
                      <span className="currencySub">
                        ( &#8361; {addCommas(product.value.priceSub)} )
                      </span>
                    )}
                  </CustomSpan>
                </MuiButton>
              </StyledPlainButtonOuter>

              {/* 하단 로컬 팝업 테스트용 */}
              {/* <div className="payment_test">
                <br />
                <MuiButton
                  disableElevation
                  variant="contained"
                  color="primary"
                  className="checkout__btn"
                  onClick={() => {
                    // localWindowOpenTest(pageUrl.payment.success);
                    localWindowOpenTest(pageUrl.payment.paymentTestPopupUrl);
                  }}
                >
                  <T>GLOBAL_PAY</T>&nbsp;<span className="checkout__btn_price"> Test</span>
                </MuiButton>
              </div> */}
            </section>
            <StoreUserCardContainer marginLeft={15} />
          </div>
        </div>
      </Styled.Store>
    );
  },
);

const Styled = {
  Store: styled.section`
    background-color: ${color.navy_blue};
    position: relative;
    .store__popup_click_blocker {
      position: fixed;
      background-color: #000000;
      opacity: 0.3;
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      height: 1417px;
      overflow: hidden;
      display: ${({ clickBlock }) => clickBlock};
    }

    .store__welcome_text {
      color: #ffffff;
      padding: 45px 0;
      font-weight: 500;
      font-size: 25px;
    }
    .store__container {
      display: flex;
      margin-bottom: 64px;
    }
    .store__main_card {
      position: relative;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.13);
      width: 940px;
      padding-bottom: 80px;
      .store__title {
        ${beforeDash({ width: 50, height: 4, marginRight: 10, fontSize: 25 })}
        margin: 40px 0 16px;
      }
      /************************* store noete start *************************/
      .store__note_box {
        width: 820px;
        margin: 0 auto;
        border-radius: 5px;
        background-color: #b5b7c113;
        padding: 27px 40px;
        .store__note_title {
          font-size: 16px;
          font-weight: 700;
          color: #303030;
          margin-bottom: 16px;
        }
        .store__note_detail {
          list-style: decimal;
          padding-left: 14px;
          li {
            font-size: 13px;
            font-weight: 300;
            color: #0f0f0f;
            line-height: 25px;
          }
        }
      }

      /************************* store point product start *************************/
      .store__point_product_list_box {
        margin-top: 20px;
        .store__point_product_title {
          ${beforeDash({ width: 25, height: 2, marginRight: 10, fontSize: 18 })};
          text-transform: capitalize;
          /* margin: 20px 0; */
          padding-left: 25px;
        }
        .store__point_product_card_group {
          margin: 20px 60px 0;
          display: flex;
          justify-content: space-between;
          .store__point_product_card {
            background-color: #00155e;
            width: 250px;
            height: 150px;
            border-radius: 5px;
            position: relative;
            font-size: 15px;
            &:hover {
              cursor: pointer;
            }
            .store__point_product_input {
              position: absolute;
              top: 0;
              left: 0;
              height: 0;
              width: 0;
              overflow: hidden;
            }
            .store__point_product_check_box {
              position: absolute;
              display: block;
              top: 10px;
              right: 10px;
            }
            .store__point_product_info_box {
              font-family: ${opensansFont};
              position: relative;
              z-index: 10;
              width: calc(100% - 20px - 20px);
              height: calc(100% - 30px - 15px);
              margin: 30px 20px 15px;
              color: #ffffff;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .store__point_product_box {
                .store__point_product_row {
                  .store__point_product_row_item {
                    &.image {
                      margin-right: 15px;
                      display: flex;
                      align-items: flex-end;
                    }
                    &.point {
                      position: relative;
                      .point_text {
                        line-height: 20px;
                        position: absolute;
                        bottom: -30px;
                        padding-left: 10px;
                        left: 0;
                      }
                    }
                  }
                }
              }
              .store__point_product_price {
                text-align: right;
                color: #ffffff;
                font-size: 20px;
                font-weight: 400;
              }
            }
            .store__point_product_circle {
              position: absolute;
              right: 0;
              bottom: 0;
              z-index: 1;
            }
          }
        }
      }
    }

    /************************* store payment list start *************************/
    .store__payment_list_box {
      margin-top: 45px;
      .store__payment_list_title {
        ${beforeDash({ width: 25, height: 2, marginRight: 10, fontSize: 18 })};
        text-transform: capitalize;
        /* margin: 20px 0; */
        padding-left: 25px;
      }

      .store__payment_list_group_wrapper {
        margin: 20px 60px 0;
        height: 100%;
        .store__payment_list_group {
          display: flex;
          flex-direction: column;
          .store__payment_label {
            height: 80px;
            .payment_label_wrapper {
              margin-left: 20px;
              display: flex;
              .payment_label_icon {
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .payment_label_detail {
                margin-left: 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                row-gap: 10px;
                .payment_label_detail_name {
                  font-size: 16px;
                  font-weight: 500;
                }
                .payment_label_detail_option_box {
                  font-size: 10px;
                  font-weight: 400;
                  color: #b5b7c1;
                  .payment_label_detail_option {
                    margin-right: 5px;
                    img {
                      width: 75px;
                      height: 19px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    /************************* store pay button start *************************/
    .store__payment_button_box {
      .store__payment_button {
        border-radius: 20px;
        .partition_line {
          width: 2px;
          height: 15px;
          background-color: #ffffff;
          margin: 0 10px;
        }
      }
    }
  `,
};
