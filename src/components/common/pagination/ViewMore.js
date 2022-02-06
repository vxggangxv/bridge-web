import React from 'react';
import styled from 'styled-components';
import T from 'components/common/text/T';

/**
 * @param {number} count : 총 페이지 갯수
 * @param {object} page : value, setValue 를 가진 object
 */
export default React.memo(
  ({ className, style, count, page = { value: 0, setValue: () => {} }, padding }) => {
    const isMaxCurrentPage = page.value === count;

    return (
      <Styled.ViewMore data-component-name="ViewMore" className={className} style={style}>
        <div className="viewMore__btn_box">
          {!isMaxCurrentPage && (
            <button
              onClick={() => page.setValue(draft => draft + 1)}
              className="viewMore__btn btn-reset"
            >
              + <T>GLOBAL_VIEW_MORE</T>
            </button>
          )}
        </div>
      </Styled.ViewMore>
    );
  },
);

const Styled = {
  ViewMore: styled.div`
    padding: 40px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .viewMore__btn_box {
      height: 26px;
    }
    .viewMore__btn {
      &:not(:disabled) {
        color: #00a6e2;
      }
      font-size: 19px;
      text-decoration: underline;
      height: 100%;
    }
  `,
};
