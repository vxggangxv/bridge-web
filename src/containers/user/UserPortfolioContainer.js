import React, { useEffect } from 'react';
import styled from 'styled-components';
import { beforeDash, color } from 'styles/utils';
import useInput from 'lib/hooks/useInput';
import MuiButton from 'components/common/button/MuiButton';
import { useParams } from 'react-router-dom';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { DesignerActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import UserPortfolioListContainer from './UserPortfolioListContainer';
import UserPortfolioEditContainer from './UserPortfolioEditContainer';
import T from 'components/common/text/T';

export default React.memo(function UserPortfolioContainer({ isHiddenEdit, padding }) {
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

  useDidUpdateEffect(() => {
    if (editPortfolioFileSuccess || editPortfolioSuccess) {
      if (isDelete.value) {
        isDelete.setValue(false);
      } else {
        isEdit.setValue(false);
      }
      //portfolio data reload
      DesignerActions.fetch_portfolio_request(submitParams);
    }
  }, [editPortfolioFileSuccess === true, editPortfolioSuccess === true]);

  const { isFetchSuccess } = useFetchLoading({ fetchPortfolioSuccess });
  if (!isFetchSuccess) return null;

  return (
    <UserPortfolio
      isHiddenEdit={isHiddenEdit}
      padding={padding}
      isEdit={isEdit}
      isDelete={isDelete}
      portfolioList={portfolioList}
    />
  );
});

export const UserPortfolio = React.memo(
  ({ isHiddenEdit, padding, isEdit, isDelete, portfolioList }) => {
    return (
      <Styled.UserPortfolio data-component-name="UserPortfolio">
        <div className="userPortfolio__title_wrapper">
          <h1 className="sr-only">User Portfolio</h1>

          <div className="userPortfolio__title">
            <T>GLOBAL_PORTFOLIO</T>
          </div>
          {!isHiddenEdit && (
            <div className="userPortfolio__edit_btn_box button_box">
              {!isEdit.value && (
                <MuiButton
                  disableElevation
                  color="primary"
                  className="sm"
                  variant="outlined"
                  onClick={() => {
                    isEdit.setValue(true);
                  }}
                >
                  <T>GLOBAL_EDIT</T>
                </MuiButton>
              )}
            </div>
          )}
        </div>

        {!isEdit.value ? (
          <UserPortfolioListContainer portfolioList={portfolioList} padding={padding} />
        ) : (
          <UserPortfolioEditContainer
            isEdit={isEdit}
            isDelete={isDelete}
            portfolioList={portfolioList}
          />
        )}
      </Styled.UserPortfolio>
    );
  },
);

const Styled = {
  UserPortfolio: styled.div`
    background-color: ${color.white};
    .button_box {
      display: flex;
      justify-content: flex-end;
      /* margin-right: 65px; */
      margin-right: 63px;
    }
    .userPortfolio__title_wrapper {
      display: flex;
      justify-content: space-between;
      .userPortfolio__title {
        ${beforeDash({})};
        margin-bottom: 35px;
      }
    }
  `,
};
