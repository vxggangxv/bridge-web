import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import useInput from 'lib/hooks/useInput';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import SearchIcon from '@material-ui/icons/Search';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import ProjectCard from 'components/common/card/ProjectCard';
import { pageUrl, project, projectOrderList, stageList } from 'lib/mapper';
import MuiPagination from 'components/common/pagination/MuiPagination';
import CustomTitle from 'components/common/text/CustomTitle';
import { UserActions, UtilActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import moment from 'moment';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import queryString from 'query-string';
import { useHistory, useLocation, useParams } from 'react-router';
import { beforeDash, color } from 'styles/utils';
import MuiCheckbox from 'components/common/checkbox/MuiCheckbox';
import { cutUrl } from 'lib/library';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';

export default function UserProjectListContainer(props) {
  const { userProjectsData, fetchProjectsSuccess, deleteProjectSuccess } = useShallowSelector(
    state => ({
      userProjectsData: state.user.projects.data,
      fetchProjectsSuccess: state.user.projects.success,
      deleteProjectSuccess: state.project.deleteProject.success,
    }),
  );
  const history = useHistory();
  const { uid } = useParams();
  const { pathname, search } = useLocation();
  const queryParse = queryString.parse(search);
  const queryStage = Number(queryParse.stage) || 0;
  const queryUserType = queryParse.userType || 0;

  const currentPage = cutUrl(pathname, 2);
  // const { tid } = useParams();
  const userProjectList = userProjectsData?.list;
  const pagingData = userProjectsData?.pagingData;
  // const language = useInput([]);
  // 0 ~ 6
  // const stage = useInput([0]);
  const checkStage = useCheckSetInput(new Set([queryStage]));
  const userType = useInput(0);
  const keyword = useInput('');
  // 0: latest, 1 : 평점 높은순, 2: 이름 내림차순, 3: 이름 오름차순
  const order = useInput(0);
  const page = useInput(1);

  const searchUserType = useMemo(() => {
    // console.log('currentPage', currentPage);
    if (currentPage === 'applied-project') return 2;
    if (currentPage === 'made-project') return 1;
  }, [currentPage]);

  // page=1&stage=0&keyword=&order=0
  let searchParams = {
    // languageGroup: language.value?.join('%'),
    stage: [...checkStage.value]?.join('%'),
    order: order.value,
    page: page.value,
    keyword: keyword.value,
    userType: searchUserType,
  };

  // SECTION: init
  useEffect(() => {
    UserActions.fetch_projects_request(searchParams);
    UtilActions.fetch_teeth_indication_format_request({ language: 'EN' });
  }, []);

  // url에 맞게 userType 적용
  // useEffect(() => {
  //   UserActions.fetch_projects_request({ ...searchParams, userType: queryUserType });
  //   userType.setValue(queryUserType);
  // }, [queryUserType]);
  useEffect(() => {
    // console.log('tid', tid);
    UserActions.fetch_projects_request({ ...searchParams, userType: searchUserType, page: 1 });
    userType.setValue(searchUserType);
    page.setValue(1);
  }, [searchUserType]);

  // SECTION: onChange
  useDidUpdateEffect(() => {
    console.log('searchParams', searchParams);
    UserActions.fetch_projects_request({ ...searchParams, page: 1 });
    page.setValue(1);
  }, [order.value, checkStage.value]);

  useDidUpdateEffect(() => {
    // console.log('page.value change');
    // if (page.value === 1) return;
    UserActions.fetch_projects_request(searchParams);
  }, [page.value]);

  // userType url 적용, 사용 X
  // useDidUpdateEffect(() => {
  // history.replace(`/@${uid}/projects?userType=${userType.value}`);
  // history.replace(`/@${uid}/projects/${userType.value}`);
  // }, [userType.value]);

  // "projectId": "20200601_새하얀치과_환자이름 event 등록new12_200601",
  // "companyName": "receiver company",
  // "enrollDate": 1609389886,
  // "applyCount": 0,
  // "programGroup": null,
  // "projectCode": "20201231-71fd76ab-0906-4d12-b84f-59e5cf6b133c",
  // "stage": 0,
  // "toothInfo": {
  //     "toothNumberGroup": "21,22,23",
  //     "indicationGroup": "1,2,2",
  //     "bridgeGroup": "2122"
  // }

  const handleSearch = () => {
    console.log('searchParams', searchParams);
    // request api
    UserActions.fetch_projects_request({ ...searchParams, page: 1 });
    page.setValue(1);
  };

  // SECTION: saga api response check
  useDidUpdateEffect(() => {
    if (deleteProjectSuccess) {
      console.log('삭제 성공');
      UserActions.fetch_projects_request(searchParams);
    }
  }, [!!deleteProjectSuccess]);

  const { isFetchSuccess } = useFetchLoading({ fetchProjectsSuccess });
  if (!isFetchSuccess) return null;
  return (
    <ProjectList
      checkStage={checkStage}
      userType={userType}
      keyword={keyword}
      order={order}
      page={page}
      pagingData={pagingData}
      userProjectList={userProjectList}
      onSearch={handleSearch}
    />
  );
}

export const ProjectList = React.memo(
  ({ checkStage, userType, keyword, order, page, pagingData, userProjectList, onSearch }) => {
    const userTypeList = [
      { id: 0, label: 'All' },
      { id: 1, label: 'Client' },
      { id: 2, label: 'Designer' },
    ];
    const { t } = useTranslation();
    return (
      <Styled.UserProjectList data-component-name="UserProjectList">
        <div className="projectList__title_box">
          <h1 className="projectList__title page-title">
            <T>GLOBAL_PROJECT</T>
          </h1>

          <div className="projectList__filter_order_box">
            {/* <MuiWrapper className="projectList__select_wrapper sm order">
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
                  name="userType"
                  value={userType.value}
                  onChange={userType.onChange}
                  className="radius-sm"
                >
                  {!!userTypeList?.length &&
                    userTypeList.map(item => (
                      <MenuItem key={item.id} value={String(item.id)}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </MuiWrapper> */}
            <MuiWrapper className="projectList__search_wrapper sm">
              <TextField
                className="radius-sm"
                variant="outlined"
                fullWidth
                // placeholder="Search for the Project"
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
            <MuiWrapper className="projectList__select_wrapper sm order">
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
                  {projectOrderList?.length > 0 &&
                    projectOrderList.map(item => (
                      <MenuItem key={item.id} value={String(item.id)}>
                        {/* {item.label} */}
                        {t(`GLOBAL_SELECT_${item.label}`)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </MuiWrapper>
          </div>
        </div>

        <div className="projectList__card_wrapper">
          <div className="projectList__filter_stage_box">
            {project.processFlagList.map((item, index) => (
              <div className="projectList__filter_stage_label_box" key={index}>
                <FormControlLabel
                  className="projectList__filter_stage_label"
                  key={index}
                  control={
                    <MuiCheckbox
                      checked={checkStage.value.has(item.id)}
                      color={item.color}
                      size="small"
                      onChange={e => {
                        console.log('e', e);
                        checkStage.onChange({ e, value: item.id });
                      }}
                      className="projectList__filter_stage_checkbox"
                    />
                  }
                  label={<span className="projectList__filter_stage_text">{item.title}</span>}
                  labelPlacement="end"
                />
              </div>
              // <div
              //   className={cx('projectList__filter_stage_tab', {
              //     active: checkStage.value.has(item.value),
              //   })}
              //   key={index}
              //   data-value={item.value}
              //   onClick={checkStage.onChange}
              // >
              //   {item.label}
              // </div>
            ))}
          </div>
          <IntervalGrid
            width={904}
            padding={8}
            hasPaddingGridContainer={false}
            className="projectList__card_container"
          >
            {!!userProjectList?.length &&
              userProjectList.map(item => (
                <Grid item xs={6} className="projectList__card_grid_item" key={item.projectCode}>
                  <ProjectCard
                    {...item}
                    typeId={2}
                    // link={`${pageUrl.project.detail}?projectCode=${item.projectCode}`}
                    link={`/project/detail/${item.projectCode}`}
                    hasBoxShadow={false}
                    projectCardSize="small"
                    teethBoxSize={80}
                    teethBoxPadding={0}
                    className="projectList__card"
                  />
                </Grid>
              ))}
            {/* {Array.from({ length: 16 }).map((_, index) => (
          <Grid item xs={6} className="projectList__card_grid_item" key={index}>
            <ProjectCard
              typeId={2}
              link={`${pageUrl.project.detail}?caseCode=20201210-d3c26fe5-87c4-402d-989f-e83f7b80cf41&status=load`}
              stage={``}
              className="projectList__card"
            />
          </Grid>
        ))} */}
          </IntervalGrid>
          <div className="pagination__container">
            <MuiPagination
              count={pagingData?.totalPage}
              page={page.value}
              onChange={(e, value) => page.setValue(value)}
            />
          </div>
        </div>
      </Styled.UserProjectList>
    );
  },
);

const Styled = {
  UserProjectList: styled.section`
    .page-title {
      ${beforeDash({})};
    }
    .projectList__title_box {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding-bottom: 20px;
      padding-right: 25px;
      border-bottom: 1px dashed ${color.gray_border};
    }
    .projectList__filter_stage_box,
    .projectList__filter_order_box {
      display: flex;
    }
    .projectList__filter_order_box {
      > *:not(:first-child) {
        margin-left: 10px;
      }
    }
    .projectList__filter_btn {
      padding: 0 15px;
      height: 34px;
      &.button {
        text-transform: capitalize;
      }
    }
    .projectList__search_wrapper {
      width: 300px;
      height: 34px;
    }
    .projectList__select_wrapper {
      height: 34px;
      font-size: 14px;
      &.language {
        width: 140px;
      }
      &.order {
        width: 120px;
      }
    }

    .projectList__card_wrapper {
      padding: 0 25px;
      .projectList__filter_stage_box {
        display: flex;
        justify-content: flex-end;
        margin-top: 25px;
        > *:not(:first-child) {
          margin-left: 5px;
        }
        .projectList__filter_stage_label_box {
          &:not(:first-child) {
            margin-left: 10px;
          }
          .projectList__filter_stage_label {
            margin-left: 0px;
            margin-right: 0px;
          }
        }
      }
      .projectList__card_container {
        margin-top: 35px;
        .projectList__card {
          /* width: 710px; */
        }
      }
      .projectList__card_grid_item {
        /* padding: 10px; */
      }
    }
    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
};
