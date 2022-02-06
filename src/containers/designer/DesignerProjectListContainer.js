import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { beforeDash, color } from 'styles/utils';
import { useParams } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import ProjectCard from 'components/common/card/ProjectCard';
import { Grid } from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import { DesignerActions, UserActions } from 'store/actionCreators';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import MuiPagination from 'components/common/pagination/MuiPagination';

export default React.memo(function DesignerProjectListContainer({}) {
  const { uid } = useParams();
  const { projectsData, fetchProjectsSuccess } = useShallowSelector(state => ({
    projectsData: state.designer.projects.data,
    fetchProjectsSuccess: state.designer.projects.success,
  }));

  const page = useInput(1);
  const projectList = projectsData?.list;
  const pagingData = projectsData?.pagingData;
  // const [projectListStack, setProjectListStack] = useState([]);

  let submitParams = {
    page: page.value,
    userCode: uid,
  };

  // init
  useEffect(() => {
    DesignerActions.fetch_projects_request(submitParams);
  }, []);

  // useDidUpdateEffect(() => {
  //   if (fetchProjectsSuccess) {
  //     setProjectListStack([...projectListStack, ...projectList]);
  //   }
  // }, [fetchProjectsSuccess === true]);

  const { isFetchSuccess } = useFetchLoading({ fetchProjectsSuccess });
  // real data =========================================================

  if (!isFetchSuccess) return null;
  return (
    <Styled.DesignerProjectList
      data-component-name="DesignerProject"
      className="designerProject__container"
    >
      <div className="designerProject__title_wrapper">
        <h1 className="sr-only">User Projects</h1>

        <div className="designerProject__title">Projects</div>
      </div>
      <IntervalGrid
        // width={1150}
        width={904}
        padding={8}
        hasPaddingGridContainer={false}
        className="designerProject__card_container"
      >
        {!!projectList?.length &&
          projectList.map((item, index) => (
            <Grid item xs={6} className="designerProject__card_grid_item" key={index}>
              <ProjectCard
                {...item}
                typeId={2}
                stage={4}
                // link={`${pageUrl.project.detail}?projectCode=${item.projectCode}`}
                // /project/detail/${item.projectCode}
                hasBoxShadow={false}
                projectCardSize="small"
                teethBoxSize={80}
                teethBoxPadding={0}
                className="designerProject"
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
    </Styled.DesignerProjectList>
  );
});

const Styled = {
  DesignerProjectList: styled.div`
    /* margin-left: 10px; */
    .designerProject__title_wrapper {
      display: flex;
      justify-content: space-between;
      .designerProject__title {
        ${beforeDash({})};
        margin-bottom: 35px;
      }
    }
    .pagination__container {
      margin: 80px auto 0;
      display: flex;
      justify-content: center;
    }
  `,
};
