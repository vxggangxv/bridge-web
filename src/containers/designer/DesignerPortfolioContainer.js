import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import CustomPagingSlick from 'components/common/swiper/CustomPagingSlick';
import MuiPagination from 'components/common/pagination/MuiPagination';
import { useParams } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import { color } from 'styles/utils';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import ProjectCard from 'components/common/card/ProjectCard';
import { Grid, IconButton } from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import { DesignerActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import DropzoneWrapper from 'components/common/dropzone/DropzoneWrapper';
import CloseIcon from '@material-ui/icons/Close';
import { DesignerContext } from './DesignerContext';

export default React.memo(function DesignerPortfolioContainer({ isEdit }) {
  console.log('render DesignerPortfolioContainer');
  const { portfolioData, fetchPortfolioSuccess } = useShallowSelector(state => ({
    portfolioData: state.designer.portfolio.data,
    fetchPortfolioSuccess: state.designer.portfolio.success,
  }));
  const { uid } = useParams();
  const page = useInput(1);
  const portfolioList = portfolioData?.list;
  const pagingData = portfolioData?.pagingData;
  const { deletePortfolio, portfolioFileList } = useContext(DesignerContext);

  let submitParams = {
    page: page.value,
    userCode: uid,
  };

  // init fetch
  useEffect(() => {
    DesignerActions.fetch_portfolio_request(submitParams);
  }, [page.value]);

  const handleAddLocalFiles = data => {
    console.log('data', data);
    const { dropFiles } = data;
    portfolioFileList.setValue(draft => draft.concat(dropFiles));
  };

  const handleDeleteLocalFiles = id => {
    console.log('id', id);
    portfolioFileList.setValue(draft => draft.filter(item => item.id !== id));
  };

  // useEffect(() => {
  //   console.log('portfolioData', portfolioData);
  // }, [portfolioData]);

  useEffect(() => {
    console.log(' portfolioFileList', portfolioFileList.value);
  }, [portfolioFileList.value]);

  // useEffect(() => {
  //   console.log('portfolioItems', portfolioItems);
  // }, [portfolioItems]);

  // TEMP:
  useDidUpdateEffect(() => {
    console.log('deletePortfolio', deletePortfolio.value);
  }, [deletePortfolio.value]);

  const { isFetchSuccess } = useFetchLoading({ fetchPortfolioSuccess });
  if (!isFetchSuccess) return null;
  return (
    <Styled.DesignerPortfolio
      data-component-name="DesignerPortfolio"
      className="designerPortfolio_container"
    >
      <div className="designerPortfolio__profile_slide_container">
        {/* {useMemo(() => {
          return (
            <CustomPagingSlick
              portfolioItems={portfolioItems}
              isEdit={isEdit}
              deletePortfolio={deletePortfolio}
            />
          );
        }, [portfolioItems, isEdit, deletePortfolio])} */}
        <div className="designerPortfolio__slider_box">
          <CustomPagingSlick
            portfolioList={portfolioList}
            isEdit={isEdit}
            deletePortfolio={deletePortfolio}
          />
          {isEdit && (
            <div className="designerPortfolio__dropzone_box">
              <DropzoneWrapper apiRequest={handleAddLocalFiles}>
                <div className="designerPortfolio__dropzone_file_list_box">
                  <p className="designerPortfolio__dropzone_notice">* 파일을 드래그해주세요.</p>
                  <div className="designerPortfolio__dropzone_content">
                    <p className="designerPortfolio__dropzone_title">File List</p>
                    <ul className="designerPortfolio__dropzone_list">
                      {portfolioFileList.value?.length > 0 &&
                        portfolioFileList.value.map(item => (
                          <li className="designerPortfolio__dropzone_item" key={item.id}>
                            {item.name}
                            <IconButton
                              // className={cx('designerPortfolio__dropzone_item_delete_btn', {})}
                              className="designerPortfolio__dropzone_item_delete_btn"
                              disableRipple
                              onClick={e => handleDeleteLocalFiles(item.id)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </DropzoneWrapper>
            </div>
          )}
        </div>

        <div className="pagination__container">
          <MuiPagination
            count={pagingData.totalPage}
            page={page.value}
            onChange={(e, value) => page.setValue(value)}
          />
        </div>
      </div>
    </Styled.DesignerPortfolio>
  );
});

export function DesignerProjectContainer({}) {
  const { uid } = useParams();
  const { projectsData, fetchProjectsSuccess } = useShallowSelector(state => ({
    projectsData: state.designer.projects.data,
    fetchProjectsSuccess: state.designer.projects.success,
  }));

  const page = useInput(1);
  const projectList = projectsData?.list;
  const pagingData = projectsData?.pagingData;

  let submitParams = {
    page: page.value,
    userCode: uid,
  };

  // init
  useEffect(() => {
    DesignerActions.fetch_projects_request(submitParams);
  }, [page.value]);

  // useEffect(() => {
  //   console.log(projectsData, 'projectsData');
  // }, [projectsData]);

  const { isFetchSuccess } = useFetchLoading({ fetchProjectsSuccess });
  if (!isFetchSuccess) return null;
  return (
    <Styled.DesignerProject
      data-component-name="DesignerProject"
      className="designerProject__container"
    >
      <IntervalGrid
        width={1150}
        padding={5}
        hasPaddingGridContainer={false}
        className="designerProject__card_container"
      >
        {/* {Array.from({ length: 8 }).map((item, index) => (
          <Grid item xs={6} className="designerProject__card_grid_item" key={index}>
          <ProjectCard
          typeId={2}
          link={`${pageUrl.designer.index}/@1/projects`}
          stage={'completed'}
          className="designerProject__card"
          
          />
          </Grid>
        ))} */}
        {projectList.map((item, index) => (
          <Grid item xs={6} className="designerProject__card_grid_item" key={index}>
            <ProjectCard
              {...item}
              typeId={2}
              // link={`${pageUrl.project.detail}?projectCode=${item.projectCode}`}
              link={`/project/detail/${item.projectCode}`}
              stage={4}
              className="designerProject"
              // typeId={2}
              // link={`${pageUrl.designer.index}/@1/projects`}
              // className="designerProject__card"
            />
          </Grid>
        ))}
      </IntervalGrid>

      <div className="pagination__container">
        <MuiPagination
          count={pagingData.totalPage}
          page={page.value}
          onChange={(e, value) => page.setValue(value)}
        />
      </div>
    </Styled.DesignerProject>
  );
}

const Styled = {
  Designer: styled.div`
    &.designer__container {
      display: flex;
      flex-wrap: wrap;
      margin-top: 100px;
    }
    .designerPortfolio__profile_aside {
      position: relative;
      width: 270px;
      .designerPortfolio__profile,
      .designer__menu {
        width: 100%;
        border: 1px solid ${color.gray_border2};
      }
      .designerPortfolio__profile {
        padding: 40px 20px 30px;
      }
      .designerPortfolio__profile_thumbnail_box {
        text-align: center;
        .designerPortfolio__profile_figure {
        }
        .designerPortfolio__profile_name {
          margin-top: 30px;
          font-weight: 700;
          font-size: 24px;
        }
        .designerList__profile_score {
          margin-top: 10px;
          justify-content: center;
        }
      }
      .designerPortfolio__profile_info_list {
        margin-top: 30px;
        .designerPortfolio__profile_info_item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          /* font-size: 16px; */
          border-bottom: 1px solid ${color.gray_border2};
          &:not(:first-child) {
            margin-top: 20px;
          }
          .muiWrapper {
            width: 140px;
            .form__input {
              font-size: 14px;
            }
          }
        }
      }
      .designerPortfolio__edit_btn_box {
        margin-top: 15px;
        text-align: right;
        .button {
          height: 30px;
          padding: 0 10px;
          & + .button {
            margin-left: 5px;
          }
        }
      }
      .designer__menu {
        margin-top: 10px;
        padding: 10px;
      }
      .designer__menu_list {
        .designer__menu_item {
          font-size: 18px;
          &:not(:first-child) {
            margin-top: 5px;
          }
        }
        .designer__menu_link {
          display: block;
          padding: 15px 20px;
          &.active {
            background-color: ${color.blue_week};
          }
          &:not(.active):hover {
            background-color: ${color.blue_week_hover};
          }
        }
      }
    }
  `,
  DesignerPortfolio: styled.div`
    .designerPortfolio__profile_slide_container {
      /* width: 740px; */
      width: 1100px;
      margin: 0 35px;
    }
    .designerPortfolio__slider_box {
      position: relative;
      .designerPortfolio__dropzone_box {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        width: 1085px;
        height: 500px;
        .designerPortfolio__dropzone_file_list_box {
          width: 100%;
          height: 100%;
          padding: 10px;
          overflow-y: auto;
          background-color: #fff;
          border: 1px solid #333;
          font-size: 14px;
          .designerPortfolio__dropzone_notice {
            color: ${color.blue};
          }
          .designerPortfolio__dropzone_content {
            padding: 10px;
            .designerPortfolio__dropzone_title {
              margin-top: 10px;
            }
            .designerPortfolio__dropzone_list {
              margin-top: 5px;
            }
            .designerPortfolio__dropzone_item {
              position: relative;
              line-height: 1.3;
              .designerPortfolio__dropzone_item_delete_btn {
                margin-left: 5px;
                padding: 2px;
                svg {
                  font-size: 18px;
                }
              }
            }
          }
        }
      }
    }
    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
  DesignerProject: styled.div`
    margin-left: 10px;
    .designerProject__card_container {
      /* padding: 0; */
      .designerProject__card {
      }
    }
    .designerProject__card_grid_item {
      /* padding: 5px; */
    }
    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
};
