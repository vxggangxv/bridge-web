import React from 'react';
import { _color } from 'styles/_variables';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';
import Color from 'color';

export default function LinearLoading({ color = _color.blue }) {
  return (
    <Styled.LinearLoading data-component-name="LinearLoading" color={color}>
      <LinearProgress />
    </Styled.LinearLoading>
  );
}

const Styled = {
  LinearLoading: styled.div`
    z-index: 99;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    .MuiLinearProgress-colorPrimary {
      background-color: ${({ color }) => color};
      .MuiLinearProgress-barColorPrimary {
        background-color: #ddd;
      }
    }
  `,
};

/**
 * baseColor
 * background-color: ${({ color }) => Color(color).lighten(1)};
 */
