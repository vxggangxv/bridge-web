import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from '@material-ui/core';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import useInput from 'lib/hooks/useInput';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { beforeDash, color } from 'styles/utils';
import { regNumber } from 'lib/library';
import { picto_checklist } from 'components/base/images';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import { PointActions, AppActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import CustomFormHelperText from 'components/common/text/CustomFormHelperText';

export default function ExchangeContainer(props) {
  const { points, pointSuccess, exchangePointsSuccess } = useShallowSelector(state => ({
    points: state.point.points,
    pointSuccess: state.point.points.success,
    exchangePointsSuccess: state.point.exchangePoints.success,
  }));
  // TEMP:
  const currentPoint = points?.data?.pointExchangeInit.currentPoint;
  const point = useInput(0);
  const accountHolder = useInput('');
  const bank = useInput('');
  const accountNumber = useInput('');
  const refundAgreeRadio = useInput('disagree');
  const [isSubmit, setIsSubmit] = useState(false);
  const { t } = useTranslation();

  const isErrorPoint = useInput(false);
  const isErrorHolder = useInput(false);
  const isErrorBank = useInput(false);
  const isErrorAccount = useInput(false);

  const errorValid = { isErrorPoint, isErrorHolder, isErrorBank, isErrorAccount };

  const exchangeSuccessPopup = useCallback(() => {
    AppActions.add_popup({
      isOpen: true,
      // type: 'alert',
      title: <T>GLOBAL_SUCCESS</T>,
      content: t('ALARM_EXCHANGE_REQUEST_SUCCESS'),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        return;
      },
    });
  }, []);

  const handleSubmit = () => {
    //  "point" : 100,
    //  "bankAccountHolder" : "계좌소유주",
    //  "bankName" : "은행이름",
    //  "bankAccount" : "123-112-32222",
    //  "isAgree": 1
    setIsSubmit(true);

    isErrorPoint.setValue(point.value < 1 ? true : false);
    isErrorHolder.setValue(!accountHolder.value);
    isErrorBank.setValue(!bank.value);
    isErrorAccount.setValue(!accountNumber.value);

    const isPoint = point.value < 1 ? true : false;
    const isHolder = !accountHolder.value;
    const isBank = !bank.value;
    const isAccount = !accountNumber.value;

    let isValidCheckList = [isPoint, isHolder, isBank, isAccount];

    // console.log('isValidCheckList ____ ', isValidCheckList);
    const isFailureValid = isValidCheckList.some(item => item === true);
    if (isFailureValid) {
      return false;
    }

    const submitData = {
      point: point.value,
      bankAccountHolder: accountHolder.value,
      bankName: bank.value,
      bankAccount: accountNumber.value,
      isAgree: refundAgreeRadio.value === 'agree' ? 1 : 0,
    };
    PointActions.exchage_points_request(submitData);
  };

  useEffect(() => {
    if (isSubmit) {
      isErrorPoint.setValue(point.value < 1);
      isErrorHolder.setValue(!accountHolder.value);
      isErrorBank.setValue(!bank.value);
      isErrorAccount.setValue(!accountNumber.value);
    }
  }, [point.value, accountHolder.value, bank.value, accountNumber.value]);

  useEffect(() => {
    PointActions.fetch_points_request();
  }, []);

  useDidUpdateEffect(() => {
    if (exchangePointsSuccess) {
      exchangeSuccessPopup();
      point.setValue(0);
      accountHolder.setValue('');
      bank.setValue('');
      accountNumber.setValue('');
      refundAgreeRadio.setValue('disagree');
      setIsSubmit(false);
      PointActions.fetch_points_request();
    }
  }, [exchangePointsSuccess]);

  const { isFetchSuccess } = useFetchLoading({ pointSuccess });
  if (!isFetchSuccess) return null;
  return (
    <Refund
      errorValid={errorValid}
      currentPoint={currentPoint}
      refundAgreeRadio={refundAgreeRadio}
      point={point}
      accountHolder={accountHolder}
      bank={bank}
      accountNumber={accountNumber}
      isSubmit={isSubmit}
      onSubmit={handleSubmit}
    />
  );
}

export function Refund({
  errorValid,
  currentPoint,
  refundAgreeRadio,
  point,
  accountHolder,
  bank,
  accountNumber,
  isSubmit,
  onSubmit,
}) {
  const { t } = useTranslation();

  const { isErrorPoint, isErrorHolder, isErrorBank, isErrorAccount } = errorValid;

  // TEST:
  // const totalPoint = 1554;
  // const fees = point.value / 10;
  // const remainingPoint = totalPoint - point.value + fees;
  const fees = point.value;
  const remainingPoint = currentPoint - point.value;

  return (
    <Styled.Refund data-component-name="Refund">
      <h1 className="refund__title page-title">
        <T>USER_POINT_EXCHANGE_TITLE</T>
      </h1>
      <div className="refund__content_wrapper">
        <div className="refund__caution_box">
          <figure className="refund__caution_figure">
            <img src={picto_checklist} alt="checklist" />
          </figure>
          <div className="refund__caution">
            <h2 className="refund__caution_title">
              <ErrorOutlineOutlinedIcon htmlColor="inherit" /> <T>USER_POINT_EXCHANGE_NOTES</T>
            </h2>

            <div className="refund__caution_text">
              <ol>
                <li>
                  <T>USER_POINT_EXCHANGE_NOTE_REQUIRED</T>{' '}
                  <T>USER_POINT_EXCHANGE_NOTE_REQUIRED_DETAIL</T>
                </li>
                <li>
                  <T>USER_POINT_EXCHANGE_NOTE_PURPOSE</T>{' '}
                  <T>USER_POINT_EXCHANGE_NOTE_PURPOSE_DETAIL</T>
                </li>
                <li>
                  <T>USER_POINT_EXCHANGE_NOTE_PERIOD</T>{' '}
                  <T>USER_POINT_EXCHANGE_NOTE_PERIOD_DETAIL</T>
                </li>

                <br />
                <li>
                  <T>USER_POINT_EXCHANGE_NOTE_AGREEMENT</T>
                </li>
              </ol>
            </div>
            <div className="refund__caution_agree_box">
              <MuiWrapper>
                <RadioGroup
                  aria-label="refund agree"
                  name="refund"
                  value={refundAgreeRadio.value}
                  onChange={refundAgreeRadio.onChange}
                  className="refund__caution_agree_group"
                >
                  <FormControlLabel
                    value="agree"
                    control={<Radio size="small" color="primary" />}
                    label={t('USER_POINT_AGREE')}
                  />
                  <FormControlLabel
                    value="disagree"
                    control={<Radio size="small" color="primary" />}
                    // label="Do not agree"
                    label={t('USER_POINT_NOT_AGREE')}
                  />
                </RadioGroup>
              </MuiWrapper>
            </div>
          </div>
        </div>
        <h2 className="refund__table_title point">
          <T>USER_POINT</T>
        </h2>
        <TableContainer className="refund__table_container point">
          <Table aria-label="refund point table">
            <TableBody>
              <TableRow>
                <TableCell component="th">
                  <T>USER_POINT_EXCHANGE_AVAILABLE</T>
                </TableCell>
                <TableCell>
                  {currentPoint}
                  <CustomSpan fontSize={20} marginLeft={15}>
                    <T>USER_POINT</T>
                  </CustomSpan>{' '}
                  {/* <i>최소 100point부터 정산 가능합니다.</i> */}
                  {/* <CustomSpan fontSize={12} marginLeft={15} fontColor={'#BEBEBE'}>
                    <T>USER_POINT_EXCHANGE_TRANSACTION_MIN</T>
                  </CustomSpan> */}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">
                  <T>USER_POINT_EXCHANGE_AMOUNTS</T>
                </TableCell>
                <TableCell>
                  <MuiWrapper>
                    <TextField
                      disabled={refundAgreeRadio.value !== 'agree' ? true : false}
                      className="refund__input"
                      id="point"
                      name="point"
                      variant="outlined"
                      autoComplete="off"
                      // error={isSubmit ? !point.value : false}
                      error={isErrorPoint.value}
                      value={Number(point.value)}
                      onChange={e => {
                        // 숫자만 입력, currentPoint 이하 입력
                        if (!!e.target.value && !regNumber(e.target.value)) return;
                        if (Number(e.target.value) > currentPoint) return;
                        point.onChange(e);
                      }}
                    />
                  </MuiWrapper>
                  <CustomSpan fontSize={20} marginLeft={15} fontColor={color.blue}>
                    <T>USER_POINT</T>
                  </CustomSpan>
                  <CustomFormHelperText
                    className={cx(`helperText error`, {
                      active: isErrorPoint.value,
                    })}
                  >
                    * <T>USER_POINT_EXCHANGE_TRANSACTION_MIN</T>
                  </CustomFormHelperText>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">
                  <T>USER_POINT_EXCHANGE_PRICE</T>
                </TableCell>
                <TableCell>
                  {!fees ? 0 : fees}
                  <CustomSpan fontSize={20} marginLeft={15}>
                    $
                  </CustomSpan>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">
                  <T>USER_POINT_EXCHANGE_REMAINED</T>
                </TableCell>
                <TableCell>
                  {remainingPoint}
                  <CustomSpan fontSize={20} marginLeft={15}>
                    <T>USER_POINT</T>
                  </CustomSpan>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <h2 className="refund__table_title account">
          <T>USER_POINT_BANK_ACCOUNT</T>
        </h2>
        <TableContainer className="refund__table_container account">
          <Table aria-label="refund account table">
            <TableBody>
              <TableRow>
                <TableCell component="th">
                  <T>USER_POINT_EXCHANGE_ACCOUNT_HOLDER</T>
                </TableCell>
                <TableCell>
                  <MuiWrapper>
                    <TextField
                      disabled={refundAgreeRadio.value !== 'agree' ? true : false}
                      className="refund__input"
                      id="accountHolder"
                      name="accountHolder"
                      variant="outlined"
                      autoComplete="off"
                      // error={isSubmit ? !accountHolder.value : false}
                      error={isErrorHolder.value}
                      value={accountHolder.value}
                      onChange={accountHolder.onChange}
                    />
                  </MuiWrapper>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">
                  <T>USER_POINT_EXCHANGE_ACCOUNT_BANK</T>
                </TableCell>
                <TableCell>
                  <MuiWrapper>
                    <TextField
                      disabled={refundAgreeRadio.value !== 'agree' ? true : false}
                      className="refund__input"
                      id="bank"
                      name="bank"
                      variant="outlined"
                      autoComplete="off"
                      // error={isSubmit ? !bank.value : false}
                      error={isErrorBank.value}
                      value={bank.value}
                      onChange={bank.onChange}
                    />
                  </MuiWrapper>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">
                  <T>USER_POINT_EXCHANGE_ACCOUNT_NUMBER</T>
                </TableCell>
                <TableCell>
                  <MuiWrapper>
                    <TextField
                      disabled={refundAgreeRadio.value !== 'agree' ? true : false}
                      className="refund__input"
                      id="accountNumber"
                      name="accountNumber"
                      variant="outlined"
                      autoComplete="off"
                      placeholder={t('PLACEHOLDER_WITHOUT_DASH')}
                      // error={isSubmit ? !accountNumber.value : false}
                      error={isErrorAccount.value}
                      value={accountNumber.value}
                      onChange={accountNumber.onChange}
                    />
                  </MuiWrapper>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <div className="checkout__btn_box">
          <MuiButton
            disableElevation
            disabled={
              refundAgreeRadio.value !== 'agree' ||
              !accountHolder.value ||
              !bank.value ||
              !accountNumber.value
            }
            variant="contained"
            color="primary"
            className="checkout__btn"
            onClick={onSubmit}
            // onClick={() => checkSubmit()}
          >
            <T>USER_POINT_CHECK_OUT</T>
            {/* <T>store.checkout</T> */}
          </MuiButton>
        </div>
      </div>
    </Styled.Refund>
  );
}

const Styled = {
  Refund: styled.section`
    .Mui-disabled {
      background-color: rgb(244, 244, 244);
    }
    .page-title {
      ${beforeDash({})};
    }
    .refund__title {
      padding-bottom: 20px;
    }
    .refund__content_wrapper {
      padding: 0 60px;
    }
    .refund__caution_box {
      display: flex;
      padding: 25px 40px 5px;
      border-radius: 5px;
      border: 1px solid ${color.gray_border};
    }
    .refund__caution_figure {
      width: 137px;
      padding-right: 30px;
    }
    .refund__caution {
      width: calc(100% - 137px);
      font-size: 14px;
    }
    .refund__caution_title {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: ${color.blue};
      svg {
        margin-right: 5px;
      }
    }
    .refund__caution_text {
      margin-top: 20px;
      color: ${color.gray_font};
      line-height: 1.3;
      > i {
        color: ${color.red};
      }
      ol {
        list-style: decimal;
        padding-left: 18px;
        li {
          &:last-child {
            list-style: none;
            list-style-type: '* ';
            color: #bebebe;
            font-size: 12px;
          }
        }
      }
    }
    .refund__caution_agree_box {
      position: relative;
      padding-left: 5px;
      margin-top: 20px;
      &:before {
        content: '';
        display: block;
        width: calc(100% + 33px);
        position: absolute;
        top: 0;
        left: -33px;
        border-top: 1px dashed ${color.gray_border};
      }
      .muiWrapper {
        justify-content: center;
      }
      .refund__caution_agree_group {
        > :not(:first-child) {
          margin-left: 10px;
        }
      }
    }
    .refund__table_title {
      ${beforeDash({ width: 25, height: 2, marginRight: 10, fontSize: 18 })};
      &:first-of-type {
        margin-top: 40px;
      }
      &:not(:first-of-type) {
        margin-top: 15px;
        padding-top: 30px;
        border-top: 1px dashed ${color.gray_border};
      }
      &.point {
      }
      &.account {
      }
    }
    .refund__table_container {
      margin-top: 20px;
      &.point {
      }
      &.account {
      }
      th,
      td {
        height: 60px;
        vertical-align: middle;
        border-bottom: none;
        padding: 0;
        .muiWrapper {
          align-items: center;
        }
      }
      th {
        width: 240px;
        padding-left: 35px;
      }
      td {
        font-size: 20px;
        > i {
          margin-left: 10px;
          font-size: 12px;
          color: ${color.red};
        }
      }
      .refund__input {
        /* width: 300px; */
        width: 370px;
      }
    }

    .checkout__btn_box {
      text-align: center;
      .checkout__btn {
        width: 370px;
        height: 50px;
        margin-top: 80px;
        font-size: 18px;
        /* font-weight: 700; */
      }
    }
  `,
};
