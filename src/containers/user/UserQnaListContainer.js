import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { beforeDash, color } from 'styles/utils';
import useInput from 'lib/hooks/useInput';
import MuiButton from 'components/common/button/MuiButton';
import { useParams, useHistory } from 'react-router-dom';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { UserActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiPagination from 'components/common/pagination/MuiPagination';
import {
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import DateConverter from 'components/common/convert/DateConverter';
import SearchIcon from '@material-ui/icons/Search';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default React.memo(function UserQnaContainer() {
  const { fetchQnaListData, fetchQnaListSuccess } = useShallowSelector(state => ({
    fetchQnaListData: state.user.qnaList.data,
    fetchQnaListSuccess: state.user.qnaList.success,
  }));
  const { t } = useTranslation();
  // const qnaOrderList = [
  //   { id: 0, label: 'Latest' },
  //   { id: 1, label: 'Earliest' },
  //   // { id: 1, label: 'Oldest' },
  // ];
  const qnaOrderList = [
    { id: 0, label: t('GLOBAL_SELECT_LATEST') },
    { id: 1, label: t('GLOBAL_SELECT_EARLIEST') },
    // { id: 1, label: 'Oldest' },
  ];

  const history = useHistory();
  const { uid } = useParams();
  const keyword = useInput('');
  // 0: latest, 1 : 평점 높은순, 2: 이름 내림차순, 3: 이름 오름차순
  const order = useInput(0);

  const page = useInput(1);
  const qnaList = fetchQnaListData?.list;
  const pagingData = fetchQnaListData?.pagingData;

  const submitParams = useMemo(
    () => ({
      page: page.value,
      keyword: keyword.value,
      order: order.value,
    }),
    [page.value, order.value, keyword.value],
  );
  useEffect(() => {
    // console.log('searchParams', submitParams);
    UserActions.fetch_qna_list_request(submitParams);
  }, [page.value]);

  useDidUpdateEffect(() => {
    UserActions.fetch_qna_list_request({ ...submitParams, page: 1 });
    page.setValue(1);
  }, [order.value]);

  const handleSearch = () => {
    UserActions.fetch_qna_list_request({ ...submitParams, page: 1 });
    page.setValue(1);
  };

  const { isFetchSuccess } = useFetchLoading({ fetchQnaListSuccess });
  if (!isFetchSuccess) return null;

  return (
    <UserQnaList
      uid={uid}
      history={history}
      keyword={keyword}
      order={order}
      pagingData={pagingData}
      page={page}
      qnaList={qnaList}
      qnaOrderList={qnaOrderList}
      handleSearch={handleSearch}
    />
  );
});

export const UserQnaList = React.memo(
  ({
    uid,
    history,
    keyword,
    order,
    pagingData,
    page,
    qnaList,
    qnaOrderList,
    handleSearch = () => {},
  }) => {
    const { t } = useTranslation();
    return (
      <Styled.UserQnaList data-component-name="UserQnaList">
        <div className="userQna__header_box">
          <h1 className="sr-only">User Q&amp;A</h1>

          <div className="userQna__header_title">
            <T>USER_MENU_QNA</T>
          </div>
          <div className="userQna__header_search">
            <div className="userQna__header_search_bar">
              <MuiWrapper className="userQna__header_search_box sm">
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder={t('PLACEHOLDER_SEARCH_QNA')}
                  value={keyword.value}
                  onChange={keyword.onChange}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  className="userQnaList__search_textfield"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon
                          color="primary"
                          fontSize="default"
                          className="cursor"
                          onClick={handleSearch}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </MuiWrapper>
            </div>

            <div className="userQna__header_select_bar">
              <MuiWrapper className="userQna__header_select_wrapper order sm">
                <FormControl fullWidth variant="outlined">
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                      marginThreshold: 10,
                    }}
                    displayEmpty
                    name="order"
                    value={order.value}
                    onChange={order.onChange}
                    className="radius-sm"
                  >
                    {qnaOrderList?.length > 0 &&
                      qnaOrderList.map(item => (
                        <MenuItem key={item.id} value={String(item.id)}>
                          {item.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </div>
          </div>
        </div>
        <section className="userQnaList__container">
          <h1 className="sr-only">QNA List</h1>

          <TableContainer className="userQnaList__table_container">
            <Table aria-label="userQnaList_table table">
              <TableHead className="userQnaList_table_header">
                <TableRow className="userQnaList__table_row">
                  <TableCell align="center">
                    <T>GLOBAL_NO</T>
                  </TableCell>
                  <TableCell>
                    <T>GLOBAL_TITLE</T>
                  </TableCell>
                  <TableCell align="center">
                    <T>GLOBAL_COMMENT</T>
                  </TableCell>
                  <TableCell align="center">
                    <T>GLOBAL_DATE</T>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="userQnaList_table_body">
                {qnaList?.length > 0 &&
                  qnaList.map((item, index) => (
                    <TableRow
                      key={item.bridgeQnaIdx}
                      className="userQnaList__table_row"
                      onClick={() => {
                        history.push(`/@${uid}/qnas/detail/${item.bridgeQnaIdx}`);
                      }}
                    >
                      <TableCell align="center">{item.bridgeQnaIdx}</TableCell>
                      <TableCell className="userQnaList__table_cell_title">
                        <span>{item.title}</span>
                      </TableCell>
                      <TableCell align="center">{item.replyCount}</TableCell>
                      <TableCell align="center">
                        <DateConverter timestamp={item.enrollDate} format="YYYY-MM-DD" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="button_box_wrapper">
            <Grid container spacing={1} className="button_box">
              <Grid item xs={2}>
                <MuiButton
                  disableElevation
                  color="primary"
                  variant="contained"
                  className="sm"
                  onClick={() => {
                    history.push(`/@${uid}/qnas/create`);
                  }}
                >
                  <T>GLOBAL_WRITE</T>
                </MuiButton>
              </Grid>
            </Grid>
          </div>
          <div className="pagination__container">
            <MuiPagination
              count={pagingData?.totalPage}
              page={page.value}
              onChange={(e, value) => page.setValue(value)}
            />
          </div>
        </section>
      </Styled.UserQnaList>
    );
  },
);

const Styled = {
  UserQnaList: styled.div`
    background-color: ${color.white};
    .userQna__header_box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-right: 60px;
      padding-bottom: 20px;
      height: 100%;
      border-bottom: 1px dotted ${color.gray_border};

      .userQna__header_title {
        ${beforeDash({})};
      }
      .userQna__header_search {
        display: flex;
        .userQna__header_search_bar {
          .userQna__header_search_box {
            width: 300px;
          }
        }

        .userQna__header_select_bar {
          margin-left: 10px;
          .userQna__header_select_wrapper {
            &.order {
              width: 120px;
            }
          }
        }
      }
    }

    .userQnaList__container {
      width: 850px;
      margin: 50px auto 0 auto;

      .userQnaList__table_container {
        font-size: 12px;

        .userQnaList_table_body {
          .userQnaList__table_row {
            &:hover {
              cursor: pointer;
            }

            .userQnaList__table_cell_title {
              display: flex;
              align-items: center;
              img {
                margin-left: 10px;
              }
            }
          }
        }

        .userQnaList__table_row {
          td {
            border: none;
            padding-top: 15px;
            padding-bottom: 15px;
          }
          &:nth-of-type(even) {
            background-color: ${color.gray_table};
          }
          .notification__table_cell_title {
            overflow: hidden;
            div {
              align-items: center;
              display: flex;
              img {
                margin-left: 10px;
              }
            }
          }
        }
        th {
          border-top: 1px solid ${color.gray_border};
          border-bottom: 1px solid ${color.gray_border};
          padding-top: 10px;
          padding-bottom: 10px;
        }
        th:nth-child(1) {
          width: 5%;
        }
        th:nth-child(2) {
          width: 65%;
        }
        th:nth-child(3) {
          width: 15%;
        }
        th:nth-child(4) {
          width: 15%;
        }
      }
    }
    .button_box_wrapper {
      padding: 25px 0;
      .button_box {
        display: flex;
        justify-content: flex-end;
        button {
          width: 100%;
        }
      }
    }

    .pagination__container {
      display: flex;
      justify-content: center;
    }
  `,
};
