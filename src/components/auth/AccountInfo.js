import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { pageUrl } from 'lib/mapper';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default function AccountInfo(props) {
  return (
    <Styled.AccountInfo data-component-name="AccountInfo">
      <h1 className="page__title">
        <T>ACCOUNT_INFO</T>
      </h1>
      <div className="info__box">
        <b>account:</b> em***.doflab.com
      </div>
      <div className="submit__box">
        <Link to={pageUrl.auth.signIn}>
          <MuiButton
            disableElevation
            variant="contained"
            color="primary"
            className="submit__btn"
            // onClick={onSubmit}
          >
            <T>GLOBAL_GO_TO_LOGIN</T>
          </MuiButton>
        </Link>
      </div>
    </Styled.AccountInfo>
  );
}

const Styled = {
  AccountInfo: styled.div`
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .page__title {
      margin: 100px 0 120px;
      font-size: 30px;
      color: #333;
      text-align: center;
      font-weight: 700;
    }
    .info__box {
      font-size: 20px;
    }
    .submit__box {
      margin-bottom: 12px;
      margin-top: 155px;
      text-align: center;
      .submit__btn {
        width: 300px;
        font-size: 16px;
        font-weight: 700;
        text-transform: initial;
      }
    }
  `,
};
