import React, { useEffect } from 'react';
import styled from 'styled-components';
import MuiPagination from 'components/common/pagination/MuiPagination';
import { useParams } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import IntervalGrid from 'components/common/grid/IntervalGrid';
import ProjectCard from 'components/common/card/ProjectCard';
import { Grid } from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import { DesignerActions } from 'store/actionCreators';
import { useShallowSelector } from 'lib/utils';
import useFetchLoading from 'lib/hooks/useFetchLoading';

export default React.memo(function DesignerProjectListContainer({}) {
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
    <Styled.DesignerProjectList
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
    </Styled.DesignerProjectList>
  );
});

const Styled = {
  DesignerProjectList: styled.div`
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
