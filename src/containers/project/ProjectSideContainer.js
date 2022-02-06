import React from 'react';
import styled from 'styled-components';

export default function ProjectSideContainer(props) {
  return <ProjectSide />;
}

export function ProjectSide(props) {
  return <Styled.ProjectSide data-component-name="ProjectSide"></Styled.ProjectSide>;
}

const Styled = {
  ProjectSide: styled.div``,
};
