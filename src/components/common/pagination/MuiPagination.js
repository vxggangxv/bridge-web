import React from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import { Pagination } from '@material-ui/lab';
import { useDidUpdateEffect } from 'lib/utils';
import PropTypes from 'prop-types';

export default function MuiPagination(props) {
  const { page } = props;

  // page클릭시 scroll top
  useDidUpdateEffect(() => {
    // window.scrollTo(0, 0);
  }, [page]);

  return (
    <Styled.MuiPagination data-component-name="MuiPagination">
      {/* {children} */}
      <Pagination {...props} />
    </Styled.MuiPagination>
  );
}

MuiPagination.propsTypes = {
  page: PropTypes.number.isRequired,
};

const Styled = {
  MuiPagination: styled.div`
    .MuiPaginationItem-root {
      font-size: 16px;
      color: #333;
    }
    .MuiPaginationItem-page:hover,
    .MuiPaginationItem-page.Mui-selected:hover {
      background-color: #ececec;
    }
    .MuiPaginationItem-page.Mui-selected,
    .MuiPaginationItem-page.Mui-selected.Mui-focusVisible {
      background-color: transparent;
    }
    .MuiPaginationItem-page.Mui-selected {
      color: ${color.blue};
    }
    .MuiPaginationItem-icon {
      font-size: 22px;
    }
  `,
};
