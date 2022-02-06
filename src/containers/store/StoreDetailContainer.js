import CustomSpan from 'components/common/text/CustomSpan';
import StorePaymentDetailContainer from './StorePaymentDetailContainer';
import StoreUserCardContainer from './StoreUserCardContainer';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { beforeDash, color, font } from 'styles/utils';
import _ from 'lodash';
import T from 'components/common/text/T';
import { useShallowSelector } from 'lib/utils';
import { StoreActions, UserActions } from 'store/actionCreators';
import { Style } from '@material-ui/icons';

export default React.memo(function StoreDetailContainer(props) {
  const { user } = useShallowSelector(state => ({
    user: state.user.user,
  }));

  const userCompany = user.company;

  // const { isFetchSuccess } = useFetchLoading({ fetchOrderSuccess });
  // if (!isFetchSuccess) return null;
  return <StoreDetail userCompany={userCompany} />;
});

export const StoreDetail = React.memo(({ userCompany }) => {
  return (
    <Styled.StoreDetail data-component-name="StoreDetail">
      <div className="storeDetaill__container main-layout">
        <h2 className="storeDetaill__content_title">
          <T>USER_WELCOME</T>,{' '}
          <CustomSpan fontSize={25} fontWeigth={400} fontColor="#1DA7E0" fontStyle="italic">
            {userCompany}
          </CustomSpan>
        </h2>
        <div className="storeDetaill__main_container">
          <StorePaymentDetailContainer />
          <StoreUserCardContainer marginLeft={15} />
        </div>
      </div>
    </Styled.StoreDetail>
  );
});

const Styled = {
  StoreDetail: styled.section`
    .storeDetaill__content_title {
      padding-top: 65px;
      padding-bottom: 30px;
      font-size: 25px;
      font-weight: 500;
      color: #ffffff;
    }
    .storeDetaill__main_container {
      display: flex;
    }
  `,
};
