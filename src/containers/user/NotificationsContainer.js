import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import CustomTitle from 'components/common/text/CustomTitle';
import {
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import { beforeDash, color } from 'styles/utils';
import CustomSpan from 'components/common/text/CustomSpan';
import MuiPagination from 'components/common/pagination/MuiPagination';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { DesignerActions, EventActions, UtilActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import DateConverter from 'components/common/convert/DateConverter';
import SearchIcon from '@material-ui/icons/Search';
import MuiButton from 'components/common/button/MuiButton';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import useInput from 'lib/hooks/useInput';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { notificationsEventTypeList, pageUrl } from 'lib/mapper';
import { PrivateSocketContext } from 'contexts/PrivateSocketContext';
import Autocomplete from '@material-ui/lab/Autocomplete';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default function NotificationsContainer(props) {
  const { eventData, fetchEventsSuccess, readEventsSuccess, deleteEventsSuccess } =
    useShallowSelector(state => ({
      eventData: state.event.events.data,
      fetchEventsSuccess: state.event.events.success,
      readEventsSuccess: state.event.readEvents.success,
      deleteEventsSuccess: state.event.deleteEvents.success,
    }));
  const { isChangeNewEvents } = useContext(PrivateSocketContext);
  const history = useHistory();
  const eventList = eventData?.list;
  const pagingData = eventData?.pagingData;
  const page = useInput(1);
  // Number , 1~15 이벤트 종류, 0이면 모두
  const eventType = useInput('ALL');
  // Number , 검색 종류 0: 두개 모두 , 1: 보낸사람, 2: project id
  const searchType = useInput(0);
  const keyword = useInput('');
  // Number, 0: 최신순,1: 나중순, 2: 안읽은 순서, 3: 읽은 내용
  const order = useInput(0);
  // check state
  const checkList = useInput([]);
  const eventTypeList = notificationsEventTypeList;

  // TEST:
  useEffect(() => {
    console.log('eventList', eventList);
  }, [eventList]);

  const searchParams = useMemo(
    () => ({
      page: page.value,
      order: order.value,
      eventType: eventType.value,
      searchType: searchType.value,
      keyword: keyword.value,
    }),
    [page.value, order.value, eventType.value, searchType.value, keyword.value],
  );

  const handleChangePage = value => {
    EventActions.fetch_events_request({ ...searchParams, page: value });
    page.setValue(value);
  };

  // SECTION: method
  const handleCheck = id => {
    if (checkList.value.includes(id)) {
      checkList.setValue(draft => draft.filter(item => item !== id));
    } else {
      checkList.setValue(draft => [...draft, id]);
    }
  };

  const handleRead = eventId => {
    // request api
    if (!!eventId) {
      EventActions.read_events_request({ eventIdArr: [eventId] });
    } else {
      EventActions.read_events_request({ eventIdArr: checkList.value });
    }
    // EventActions.read_events_request({ eventIdArr });
  };
  const handleDelete = () => {
    // request api
    EventActions.delete_events_request({ eventIdArr: checkList.value });
  };
  const handleAccept = (projectCode, eventId) => {
    // request api
    // history.push(
    //   `${pageUrl.project.detail}?projectCode=${item.projectCode}`,
    // );
    // EventActions.delete_events_request({ eventIdArr });
    console.log('projectCode-', projectCode);
    console.log('eventId-', eventId);
    EventActions.read_events_request({ eventIdArr: [eventId] });
    DesignerActions.accept_project_request({ projectCode });
  };

  // SECTION: DidMount
  // page=1&order=0&eventType=0&searchType=0&keyword=sender
  useEffect(() => {
    console.log('searchParams', searchParams);
    EventActions.fetch_events_request(searchParams);
    // UtilActions.fetch_event_types_request();
  }, []);

  // SECTION: DidUpdate
  useDidUpdateEffect(() => {
    console.log('searchParams', searchParams);
    EventActions.fetch_events_request({ ...searchParams, page: 1 });
    page.setValue(1);
  }, [order.value, eventType.value]);

  // notification페이지에서 socket notification이 발생했을 경우 fetch요청
  useDidUpdateEffect(() => {
    if (isChangeNewEvents) {
      EventActions.fetch_events_request(searchParams);
      isChangeNewEvents.setValue(false);
    }
  }, [isChangeNewEvents]);

  const handleSearch = () => {
    console.log('search');
    // request api
    EventActions.fetch_events_request(searchParams);
  };

  // SECTION: reponse api
  useDidUpdateEffect(() => {
    if (readEventsSuccess || deleteEventsSuccess) {
      EventActions.fetch_events_request(searchParams);
      EventActions.fetch_new_events_request();
      checkList.setValue([]);
    }
  }, [readEventsSuccess === true, deleteEventsSuccess === true]);

  // TEST:
  useEffect(() => {
    console.log('checkList', checkList.value);
  }, [checkList.value]);

  const { isFetchSuccess } = useFetchLoading({ fetchEventsSuccess });
  if (!isFetchSuccess) return null;
  return (
    <Notifications
      pagingData={pagingData}
      page={page}
      eventTypeList={eventTypeList}
      eventList={eventList}
      eventType={eventType}
      searchType={searchType}
      keyword={keyword}
      order={order}
      checkList={checkList}
      onCheck={handleCheck}
      onRead={handleRead}
      onDelete={handleDelete}
      onSearch={handleSearch}
      onChangePage={handleChangePage}
    />
  );
}

export function Notifications({
  pagingData,
  page,
  eventTypeList,
  eventList,
  eventType,
  searchType,
  keyword,
  order,
  checkList,
  onCheck,
  onRead,
  onDelete,
  onSearch,
  onChangePage,
}) {
  const checkAll = useCheckOneInput(false);
  const eventIdList = eventList?.map(item => item._id) || [];
  const history = useHistory();
  // doc/eventType.json 참고
  // const exceptViewPageIdxList = [14];
  // const viewPageIdxList = [1, 2, 5, 6, 7, 10, 11, 9];
  // const viewPageIdxList = eventTypeList?.filter(
  //   item => !exceptViewPageIdxList.includes(item.eventType),
  // );

  const { t } = useTranslation();
  // const searchTypeList = [
  //   { id: 0, label: 'All' },
  //   { id: 1, label: 'From' },
  //   { id: 2, label: 'Project name' },
  // ];

  // const notificationOrderList = [
  //   { id: 0, label: 'Latest' },
  //   { id: 1, label: 'Earliest' },
  //   { id: 2, label: 'Not read' },
  //   { id: 3, label: 'Read' },
  // ];
  const searchTypeList = [
    { id: 0, label: t('GLOBAL_SELECT_ALL') },
    { id: 1, label: t('GLOBAL_SELECT_FROM') },
    { id: 2, label: t('GLOBAL_SELECT_PROJECT_NAME') },
  ];

  const notificationOrderList = [
    { id: 0, label: t('GLOBAL_SELECT_LATEST') },
    { id: 1, label: t('GLOBAL_SELECT_EARLIEST') },
    { id: 2, label: t('GLOBAL_SELECT_NOT_READ') },
    { id: 3, label: t('GLOBAL_SELECT_READ') },
  ];

  // checkAll
  const handleCheckAll = e => {
    const checkedValue = e.target.checked;
    checkAll.onChange(e);

    if (checkedValue) {
      checkList.setValue(eventIdList);
    } else {
      checkList.setValue([]);
    }
  };

  // 리스트 체크박스 변경 됐을 경우 checkAll 변경, if check all
  useDidUpdateEffect(() => {
    if (checkList.value.length && checkList.value.length === eventList.length) {
      checkAll.setValue(true);
    } else {
      checkAll.setValue(false);
    }
  }, [checkList.value]);

  return (
    <Styled.Notifications data-component-name="Notification">
      <div className="notifications__title_box">
        <h1 className="notifications__title page-title">
          <T>USER_MENU_NOTIFICATIONS</T>
        </h1>

        <div className="notifications__filter_order_box">
          <MuiWrapper className="notifications__select_wrapper sm ">
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
                name="searchType"
                value={searchType.value}
                onChange={searchType.onChange}
                className="radius-sm"
              >
                {!!searchTypeList?.length &&
                  searchTypeList.map(item => (
                    <MenuItem key={item.id} value={String(item.id)}>
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </MuiWrapper>

          {/* <Autocomplete
              id="searchTypeAuto "
              size="small"
              // options={!!searchTypeList?.length ? searchTypeList.map(option => option) : []}
              options={searchTypeList}
              getOptionLabel={option => {
                // console.log('option', option);
                // return option ? 'All' : option.label;
                return option.label;
                // return option?.label ? 'All' : option.label;
                // return searchTypeList?.option?.label;
                // return option.label;
              }}
              style={{ fontSize: '14px' }}
              value={searchType.value}
              defaultValue={searchTypeList[0]}
              onChange={(e, newVal) => searchType.setValue(newVal)}
              renderInput={params => (
                <MuiWrapper className="notifications__select_wrapper sm ">
                  <TextField
                    id="searchType"
                    {...params}
                    onChange={searchType.onChange}
                    variant="outlined"
                  />
                </MuiWrapper>
              )}
            /> */}
          {/* 
              <MuiWrapper className="notifications__select_wrapper sm ">
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
                  name="searchType"
                  value={searchType.value}
                  onChange={searchType.onChange}
                  className="radius-sm"
                >
                  {!!searchTypeList?.length &&
                    searchTypeList.map(item => (
                      <MenuItem key={item.id} value={String(item.id)}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl> 
              </MuiWrapper>
              */}
          <MuiWrapper className="notifications__search_wrapper sm">
            <TextField
              className="radius-sm"
              variant="outlined"
              fullWidth
              // placeholder="Search for the Designer"
              placeholder={t('PLACEHOLDER_SEARCH_PROJECT')}
              value={keyword.value}
              onChange={keyword.onChange}
              onKeyPress={e => e.key === 'Enter' && onSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      color="primary"
                      fontSize="default"
                      className="cursor"
                      onClick={onSearch}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </MuiWrapper>
          <MuiWrapper className="notifications__select_wrapper sm order">
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
                {!!notificationOrderList?.length &&
                  notificationOrderList.map(item => (
                    <MenuItem key={item.id} value={String(item.id)}>
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </MuiWrapper>
          <MuiWrapper className="notifications__select_wrapper sm event">
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
                name="eventType"
                value={eventType.value}
                onChange={eventType.onChange}
                className="radius-sm"
              >
                <MenuItem value={'ALL'}>Event Type</MenuItem>
                {!!eventTypeList?.length &&
                  eventTypeList.map(item => (
                    <MenuItem key={item.eventType} value={item.eventType}>
                      {/* {item.eventTitle} */}
                      {t(`NOTIFICATION_EVENT_TYPE_${item.eventType}`)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </MuiWrapper>
        </div>
      </div>

      <div className="notifications__content_wrapper">
        <div className="notifications__filter_bar">
          <div className="notifications__filter_btn_box">
            <MuiButton
              disableElevation
              variant="contained"
              color="primary"
              className="sm"
              onClick={() => onRead()}
            >
              <T>GLOBAL_READ</T>
            </MuiButton>
            <MuiButton
              disableElevation
              variant="outlined"
              color="primary"
              className="sm"
              onClick={onDelete}
            >
              <T>GLOBAL_DELETE</T>
            </MuiButton>
          </div>
        </div>

        <TableContainer className="notifications__table_container">
          <Table aria-label="notification table">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="notifications__table_cell_checkbox">
                  <MuiWrapper data-type="default">
                    <Checkbox
                      checked={checkAll.value}
                      color="primary"
                      style={{ padding: 0 }}
                      onChange={handleCheckAll}
                    />
                  </MuiWrapper>
                </TableCell>
                {/* <TableCell>Type</TableCell> */}
                <TableCell>
                  <T>GLOBAL_FROM</T>
                </TableCell>
                <TableCell>
                  <T>GLOBAL_DATE</T>
                </TableCell>
                <TableCell>
                  <T>GLOBAL_MESSAGE</T>
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventList?.length > 0 &&
                eventList.map((item, index) => (
                  // <TableRow key={item._id} className="notifications__table_row read">
                  <TableRow
                    key={item._id}
                    className={cx('notifications__table_row', { read: !!item.isRead })}
                  >
                    <TableCell align="center" className="notifications__table_cell_checkbox">
                      <MuiWrapper data-type="default">
                        <Checkbox
                          checked={checkList.value.includes(item._id)}
                          color="primary"
                          style={{ padding: 0 }}
                          onChange={e => onCheck(item._id)}
                        />
                      </MuiWrapper>
                    </TableCell>
                    {/* <TableCell>Project</TableCell> */}
                    <TableCell title={item.senderCompany}>{item.senderCompany}</TableCell>
                    <TableCell>
                      <DateConverter timestamp={item.enrollDate} format="YYYY-MM-DD" />
                    </TableCell>
                    <TableCell>
                      {/* {item.projectId && `${item.projectId}.`} {item.eventTitle} */}
                      {item.projectId && `${item.projectId}.`}{' '}
                      {t(`NOTIFICATION_EVENT_TITLE_${item.eventType}`)}
                    </TableCell>
                    <TableCell align="center" className="notifications__table_cell_btn">
                      {item.projectCode && (
                        <MuiButton
                          config={{
                            color: item.isRead ? color.gray_b5 : color.blue,
                          }}
                          disableElevation
                          variant="outlined"
                          className="xs"
                          onClick={() => {
                            onRead(item._id);
                            history.push(`/project/detail/${item.projectCode}`);
                          }}
                        >
                          <T>GLOBAL_VIEW</T>
                        </MuiButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="pagination__container">
        <MuiPagination
          count={pagingData?.totalPage}
          page={page.value}
          onChange={(e, value) => onChangePage(value)}
        />
      </div>
    </Styled.Notifications>
  );
}

const Styled = {
  Notifications: styled.section`
    .page-title {
      ${beforeDash({})};
    }
    .notifications__title_box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-right: 60px;
      padding-bottom: 20px;
      border-bottom: 1px dashed ${color.gray_border};
    }
    .notifications__title {
    }
    .notifications__filter_btn_box,
    .notifications__filter_order_box {
      display: flex;
    }
    .notifications__filter_btn_box {
      button {
        min-width: 70px;
      }
      > *:not(:first-child) {
        margin-left: 5px;
      }
    }
    .notifications__filter_order_box {
      > *:not(:first-child) {
        margin-left: 10px;
      }
    }
    .notifications__filter_bar {
      display: flex;
    }
    .notifications__filter_btn {
      padding: 0 15px;
      height: 34px;
    }
    .notifications__search_wrapper {
      width: 250px;
      height: 34px;
    }
    .notifications__select_wrapper {
      height: 34px;
      font-size: 14px;
      width: 120px;
      /* &.event {
        width: 140px;
      } */
      &.language {
        width: 140px;
      }
      &.order {
        width: 120px;
      }
    }

    .notifications__content_wrapper {
      padding: 0 60px;
      margin-top: 50px;
    }
    .notifications__table_container {
      margin-top: 10px;
      table {
        table-layout: fixed;
        overflow-x: initial;
      }
      col:nth-child(1) {
        width: 6%;
      }
      col:nth-child(2) {
        width: 14.5%;
      }
      col:nth-child(3) {
        width: 11.5%;
      }
      col:nth-child(4) {
        width: 59%;
      }
      col:last-child {
        width: 9%;
      }

      tr {
        &:nth-of-type(even) {
          background-color: ${color.gray_table};
        }
      }
      th,
      td {
        padding: 10px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      thead {
        border-top: 1px solid ${color.gray_border2};
        border-top-width: 2px;
        th {
          border-bottom-width: 2px;
          font-weight: 700;
        }
      }
      tbody {
        .notifications__table_cell_btn {
          .button {
            & + .button {
              margin-left: 5px;
            }
          }
        }
      }
      .notifications__table_cell_checkbox {
        .muiWrapper {
          display: inline-block;
        }
      }
      .notifications__table_row {
        &.read {
          background-color: #f0f0f0;
        }
      }
    }
    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
};
