import React from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';

export default function CustomPagination(props) {
  const { matchUrl = '', url = '', onClick = () => {}, pagingData = {}, className = '' } = props;

  return (
    <Styled.CustomPagination
      data-component-name="CustomPagination"
      className={`pagination ${className}`}
    >
      {/* <Pagination
        itemClass="pagenation__item"
        linkClass="pagination__link"
        hideFirstLastPages
        activePage={parseInt(pagingData.page, 10)}
        totalItemsCount={pagingData.totalPage || 0}
        onChange={onClick}
        itemsCountPerPage={1}
        pageRangeDisplayed={5}
        getPageUrl={i => `/pageTest/${i}`}
        innerClass="pagination"
        activeLinkClass="active"
        prevPageText={
          <span className="page__list">
            <span className="txt">〈</span>
          </span>
        }
        nextPageText={
          <span className="page__list">
            <span className="txt">〉</span>
          </span>
        }
        /> */}
    </Styled.CustomPagination>
  );
}
// hideNavigation
// firstPageText={<span className="page__list"><span className="txt">first</span></span>}
// lastPageText={<span className="page__list"><span className="txt">last</span></span>}

const Styled = {
  CustomPagination: styled.div`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pagination__link {
      display: inline-block;
      padding: 10px;
      font-size: 15px;
      color: ${color.black};

      &.active {
        color: ${color.blue};
      }
    }

    .pagenation__item {
      &:hover {
        background: #ececec;
      }
      &.active {
        font-weight: 700;
      }
      &.disabled {
        opacity: 0.5;
        &:hover {
          background: transparent;
        }
      }
    }
  `,
};
