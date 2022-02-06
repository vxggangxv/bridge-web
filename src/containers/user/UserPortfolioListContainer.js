import React, { useEffect } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import UserPortfolioPagingSlick from 'components/common/swiper/UserPortfolioPagingSlick';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { BinActions, DesignerActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { setFormData } from 'lib/library';
import { useParams } from 'react-router-dom';
import useInput from 'lib/hooks/useInput';

export default React.memo(function UserPortfolioListContainer({ padding }) {
  const {
    portfolioData,
    fetchPortfolioSuccess,
    editPortfolioSuccess,
    editPortfolioFileSuccess,
  } = useShallowSelector(state => ({
    portfolioData: state.designer.portfolio.data,
    fetchPortfolioSuccess: state.designer.portfolio.success,
    editPortfolioSuccess: state.designer.editPortfolio.success,
    editPortfolioFileSuccess: state.bin.editPortfolioFile.success,
    // editPortfolioSuccess: state.bin.editPortfolioFile.success,
  }));
  const { uid } = useParams();
  const page = useInput(1);
  const isEdit = useInput(false);
  const isDelete = useInput(false);
  const portfolioList = portfolioData?.list;

  let submitParams = {
    page: page.value,
    userCode: uid,
  };

  useEffect(() => {
    // init portfolio load
    DesignerActions.fetch_portfolio_request(submitParams);
  }, []);

  const { isFetchSuccess } = useFetchLoading({ fetchPortfolioSuccess });
  if (!isFetchSuccess) return null;

  return <UserPortfolioList portfolioList={portfolioList} padding={padding} />;
});

export const UserPortfolioList = React.memo(({ portfolioList, padding }) => {
  return (
    <Styled.UserPortfolioList data-component-name="UserPortfolioDefault" padding={padding}>
      <div className="userPortfolioDefault__contents_container">
        <div className="userPortfolioDefault__slider_box">
          <UserPortfolioPagingSlick
            portfolioList={portfolioList}
            height={362}
            backgroundColor="light"
          />
        </div>
      </div>
    </Styled.UserPortfolioList>
  );
});

const Styled = {
  UserPortfolioList: styled.div`
    background-color: ${color.white};
    /* margin-bottom: 100px; */
    padding-bottom: ${({ padding }) => (padding ? `${padding}px` : `99px`)};
  `,
};
