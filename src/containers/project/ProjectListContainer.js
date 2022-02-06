import { Checkbox, FormControl, Grid, MenuItem, Select, TextField } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import useInput from 'lib/hooks/useInput';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import ProjectCard from 'components/common/card/ProjectCard';
import { projectProcessFlagList } from 'lib/mapper';
import { ProjectActions, UtilActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { color } from 'styles/utils';
import ViewMore from 'components/common/pagination/ViewMore';
import { useTranslation } from 'react-i18next';
import { icon_magnifier, project_list } from 'components/base/images';
import T from 'components/common/text/T';
import CustomSpan from 'components/common/text/CustomSpan';
import { PrivateSocketContext } from 'contexts/PrivateSocketContext';

export default function ProjectListContainer() {
  const { projectListData, fetchProjectsSuccess, supportCountryList, deleteProjectSuccess } =
    useShallowSelector(state => ({
      projectListData: state.project.projects.data,
      fetchProjectsSuccess: state.project.projects.success,
      supportCountryList: state.util.supportCountries.data?.languageList,
      deleteProjectSuccess: state.project.deleteProject.success,
    }));
  const projectList = projectListData?.list;
  const pagingData = projectListData?.pagingData;
  // TODO: hasNewEvent
  const [projectItems, setProjectItems] = useState([]);
  const language = useInput([]);
  // const tool = useCheckSetInput(new Set(['Exocad']));
  // const tool = useCheckSetInput(new Set([]));
  const tool = useInput([]);
  const stage = useInput([]);
  const keyword = useInput('');
  // 0: latest, 1 : 평점 높은순, 2: 이름 내림차순, 3: 이름 오름차순
  // 0: latest, 1 : oldest
  const order = useInput('0');
  const page = useInput(1);

  const { realTimeChat, realTimeEvent } = useContext(PrivateSocketContext);

  // page=1&type=1&programGroup=Exocad&order=1&keyword=&languageGroup=KR%EN
  let searchParams = {
    // type: 0,
    // programGroup: [...tool.value]?.join('%'),
    // programGroup: '',
    // languageGroup: language.value?.join('%'),
    keyword: keyword.value?.trim(),
    order: +order.value,
    page: page.value,
    stage: stage.value?.length ? stage.value?.join('%') : '',
  };

  // "projectId": "20200601_새하얀치과_환자이름 event 등록new12_200601",
  // "companyName": "receiver company",
  // "enrollDate": 1609389886,
  // "applyCount": 0,
  // "programGroup": null,
  // "languageGroup": null,
  // "projectCode": "20201231-71fd76ab-0906-4d12-b84f-59e5cf6b133c",
  // "stage": 0,
  // "toothInfo": {
  //     "toothNumberGroup": "21,22,23",
  //     "indicationGroup": "1,2,2",
  //     "bridgeGroup": "2122"
  // }

  // SECTION: init
  useEffect(() => {
    UtilActions.fetch_support_countries_request();
    UtilActions.fetch_teeth_indication_format_request({ language: 'EN' });
    ProjectActions.fetch_projects_request(searchParams);
  }, []);

  // SECTION: onChange
  // filter 값 변경시 page 1로 자동 request
  useDidUpdateEffect(() => {
    // console.log(searchParams, 'searchParams');
    ProjectActions.fetch_projects_request({ ...searchParams, page: 1 });
    page.setValue(1);
    // setProjectItems([]);
  }, [order.value, stage.value]);

  // page.value 별도 onChange 처리, 1은 예외
  useDidUpdateEffect(() => {
    if (page.value === 1) return;
    ProjectActions.fetch_projects_request({ ...searchParams, page: page.value });
  }, [page.value]);

  // response api - projectList
  useDidUpdateEffect(() => {
    if (fetchProjectsSuccess) {
      // 자연스러운 랜더링을 위한 초기화 타이밍
      if (page.value === 1) {
        setProjectItems(projectList);
      } else {
        setProjectItems(draft => [...draft, ...projectList]);
      }
      // setProjectItems(draft => [...draft, ...projectList]);
    }
  }, [!!fetchProjectsSuccess, page.value]);

  // project newChatCount update
  useDidUpdateEffect(() => {
    if (realTimeChat?.projectCode) {
      setProjectItems(draft => {
        return draft.map((item, idx) => {
          const newChatCount = item?.newChatCount || 0;
          if (item.projectCode === realTimeChat.projectCode) {
            return {
              ...item,
              newChatCount: newChatCount + 1,
            };
          }
          return item;
        });
      });
    }
  }, [realTimeChat]);

  // project hasNewEvent update
  useDidUpdateEffect(() => {
    if (realTimeEvent?.projectCode) {
      setProjectItems(draft => {
        return draft.map((item, idx) => {
          if (item.projectCode === realTimeEvent.projectCode) {
            return {
              ...item,
              hasNewEvent: true,
            };
          }
          return item;
        });
      });
    }
  }, [realTimeEvent]);

  // dev mode
  useDidUpdateEffect(() => {
    if (deleteProjectSuccess) {
      console.log('삭제 성공');
      ProjectActions.fetch_projects_request(searchParams);
    }
  }, [!!deleteProjectSuccess]);

  const handleSearch = () => {
    // console.log(searchParams, 'searchParams');
    // if (!keyword.value?.trim()) return;
    // request api
    ProjectActions.fetch_projects_request(searchParams);
  };

  const { isFetchSuccess } = useFetchLoading({ fetchProjectsSuccess });
  if (!isFetchSuccess) return null;
  return (
    <ProjectList
      supportCountryList={supportCountryList}
      language={language}
      tool={tool}
      stage={stage}
      keyword={keyword}
      order={order}
      page={page}
      pagingData={pagingData}
      projectItems={projectItems}
      onSearch={handleSearch}
    />
  );
}

export const ProjectList = React.memo(
  ({
    supportCountryList,
    language,
    tool,
    stage,
    keyword,
    order,
    page,
    pagingData,
    projectItems,
    onSearch,
  }) => {
    const { t } = useTranslation();
    return (
      <Styled.ProjectList data-component-name="ProjectList" className="notranslate">
        <div className="projectList__top_box main-layout">
          <h2 className="projectList__content_title">
            <img src={project_list} alt="project" />
            Project List
          </h2>
          <div className="projectList__filter_bar">
            <div className="projectList__filter_box filter">
              {/* <MuiWrapper className="projectList__select_wrapper tool sm" isGlobalStyle={true}>
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
                    multiple
                    name="tool"
                    value={tool.value}
                    onChange={tool.onChange}
                    renderValue={selected => {
                      if (selected.length === 0) {
                        return 'Tool';
                      }
                      const selectedLabelList = toolList.reduce((acc, curr) => {
                        if (selected.includes(curr.id)) return acc.concat(curr.label);
                        return acc;
                      }, []);

                      return selectedLabelList.join(', ');
                    }}
                  >
                    {toolList?.length > 0 &&
                      toolList.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          <Checkbox color="primary" checked={tool.value.includes(item.id)} />
                          {item.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
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
                    value={order.value || ''}
                    onChange={order.onChange}
                    className="radius-sm"
                  >
                    {projectOrderList?.length > 0 &&
                      projectOrderList.map(item => (
                        <MenuItem key={item.id} value={String(item.id)}>
                          {t(`GLOBAL_SELECT_${item.label}`)}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper> */}

              {/* <MuiWrapper className="projectList__select_wrapper language sm" isGlobalStyle={true}>
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
                    multiple
                    name="language"
                    value={language.value}
                    onChange={language.onChange}
                    renderValue={selected => {
                      if (selected.length === 0) {
                        return 'Language';
                      }
                      const selectedLabelList = supportCountryList.reduce((acc, curr) => {
                        if (selected.includes(curr.language_idx)) return acc.concat(curr.language);
                        return acc;
                      }, []);

                      return selectedLabelList.join(', ');
                    }}
                  >
                    {supportCountryList?.length > 0 &&
                      supportCountryList.map((item, index) => (
                        // language_idx
                        // language
                        <MenuItem key={index} value={item.language_idx}>
                          <Checkbox
                            color="primary"
                            checked={language.value.includes(item.language_idx)}
                          />
                          {item.locale}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper> */}

              <div className="projectList__order_btn_box">
                <button
                  className={cx('btn-reset projectList__order_btn', {
                    active: order.value === '0',
                  })}
                  onClick={() => order.setValue('0')}
                >
                  <T>GLOBAL_SELECT_LATEST</T>
                </button>
                <CustomSpan marginLeft={5} marginRight={5}>
                  l
                </CustomSpan>
                <button
                  className={cx('btn-reset projectList__order_btn', {
                    active: order.value === '1',
                  })}
                  onClick={() => order.setValue('1')}
                >
                  <T>GLOBAL_SELECT_EARLIEST</T>
                </button>
              </div>

              <MuiWrapper
                className="projectList__search_wrapper sm"
                config={
                  {
                    // borderColor: 'transparent',
                    // activeBorderColor: 'transparent',
                    // hoverBorderColor: 'transparent',
                  }
                }
              >
                <>
                  <TextField
                    className="radius-md"
                    variant="outlined"
                    fullWidth
                    placeholder="Search for the Project"
                    value={keyword.value || ''}
                    onChange={keyword.onChange}
                    onKeyPress={e => e.key === 'Enter' && onSearch()}
                  />
                  <button className="btn-reset projectList__search_btn" onClick={onSearch}>
                    <img src={icon_magnifier} alt="search" />
                  </button>
                </>
              </MuiWrapper>
              <MuiWrapper className="projectList__select_wrapper stage sm" isGlobalStyle={true}>
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
                    multiple
                    name="stage"
                    value={stage.value}
                    onChange={stage.onChange}
                    renderValue={selected => {
                      if (selected.length === 0) {
                        return 'All';
                      }

                      const selectedLabelList = projectProcessFlagList.reduce((acc, curr) => {
                        if (selected.includes(curr.index)) return acc.concat(curr.title);
                        return acc;
                      }, []);

                      return selectedLabelList.join(', ');
                    }}
                  >
                    {projectProcessFlagList?.length > 0 &&
                      projectProcessFlagList.map((item, index) => (
                        <MenuItem key={index} value={item.index}>
                          <Checkbox color="primary" checked={stage.value.includes(item.index)} />
                          {item.title}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </div>

            {/* <div className="projectList__filter_box order">
              <MuiWrapper className="projectList__search_wrapper sm">
                <TextField
                  className="radius-sm"
                  variant="outlined"
                  fullWidth
                  // placeholder="Search for the Designer"
                  placeholder={t(`PLACEHOLDER_SEARCH_DESIGNER`)}
                  value={keyword.value || ''}
                  onChange={keyword.onChange}
                  onKeyPress={e => e.key === 'Enter' && onSearch()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon
                          htmlColor={color.blue}
                          fontSize="default"
                          className="cursor"
                          onClick={onSearch}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </MuiWrapper>
            </div> */}
          </div>
        </div>

        <IntervalGrid padding={15} className="projectList__card_container">
          {projectItems?.length > 0 &&
            projectItems.map(item => (
              <Grid item xs={6} className="projectList__card_grid_item" key={item.projectCode}>
                <ProjectCard
                  {...item}
                  typeId={1}
                  // link={`${pageUrl.project.detail}?projectCode=${item.projectCode}`}
                  link={`/project/detail/${item.projectCode}`}
                  className="projectList__card"
                />
              </Grid>
            ))}
          {/* {Array.from({ length: 16 }).map((_, index) => (
          <Grid item xs={6} className="projectList__card_grid_item" key={index}>
            <ProjectCard
              typeId={1}
              link={`${pageUrl.project.detail}?caseCode=20201210-d3c26fe5-87c4-402d-989f-e83f7b80cf41&status=load`}
              stage={'completed'}
              className="projectList__card"
            />
          </Grid>
        ))} */}
        </IntervalGrid>

        <ViewMore count={pagingData?.totalPage} page={page} />
        {/* <div className="pagination__container">
        <MuiPagination
          count={pagingData?.totalPage}
          page={page.value}
          onChange={(e, value) => page.setValue(value)}
        />
      </div> */}
      </Styled.ProjectList>
    );
  },
);

const Styled = {
  ProjectList: styled.div`
    .projectList__top_box {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    .projectList__content_title {
      display: flex;
      align-items: flex-end;
      padding: 30px 0;
      font-size: 27px;
      font-weight: 500;
      img {
        position: relative;
        top: 10px;
        margin-right: 20px;
      }
    }
    .projectList__filter_bar {
      display: inline-flex;
      justify-content: space-between;
      /* margin-top: 100px; */
      margin-bottom: 30px;
    }
    .projectList__filter_box {
      display: flex;
      align-items: center;
      margin-left: 5px;
      /* & > *:not(:first-child) {
        margin-left: 5px;
      }
      &.filter {
        & > *:not(:first-child) {
          margin-left: 5px;
        }
      }
      &.order {
        & > *:not(:first-child) {
          margin-left: 10px;
        }
      } 
    }
    .projectList__filter_btn {
      padding: 0 15px;
      height: 34px;
    } */

    .projectList__order_btn_box {
      font-size: 12px;
      color: #767676;
      .projectList__order_btn {
        &.active {
          /* border-bottom: 1px solid #767676; */
          color: ${color.blue};
          font-weight: 500;
        }
      }
    }

    .projectList__search_wrapper {
      margin-left: 30px;
      /* width: 625px; */
      width: 480px;
      height: 34px;
      .projectList__search_btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        top: 0;
        width: 34px;
        height: 34px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: ${color.gray_b5};
        img {
          width: 16px;
        }
      }
    }
    .projectList__select_wrapper {
      height: 34px;
      font-size: 14px;
      width: 140px;
      &:not(:first-child) {
        margin-left: 5px;
      }
      &.tool,
      &.language {
        width: 140px;
      }
      &.order {
        width: 120px;
      }
    }
    .projectList__card_container {
      .projectList__card {
        /* width: 710px; */
      }
    }
    .projectList__card_grid_item {
      padding: 10px;
    }
    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
};
