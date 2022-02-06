import { Grid } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { color, device } from 'styles/utils';

/**
 * IntervalGrid : 자식 element에 일정 margin이 있을경우 (지정된 너비(1140 + 10 * 2)와 간격이 있는 Card UI)에 사용
 * <IntervalGrid width={1440} padding={10}>
 *  <div style={{
 *    padding: 10px;
 *   }}>
 *   <div style={{
 *     border: 1px solid #ddd;
 *    }}>
 *   </div>
 *  </div>
 * </IntervalGrid>
 * @param {*} props
 */
export default function IntervalGrid(props) {
  let {
    children,
    className = '',
    width,
    padding, // card 좌우 간격
    hasPaddingGridContainer = true, // 기본 container 안에 좌우 간격, false경우 너비를 패딩만큼 - *2
    hasCardBorder = false, // border 유무
  } = props;
  // const deviceSize = device.lg.replace('px', '') - device.lgPadding.replace('px', '') * 2;
  let deviceSize = hasPaddingGridContainer
    ? device.lg - device.lgPadding * 2
    : device.lg - device.lgPadding * 4;

  return (
    <Styled.IntervalGrid
      data-component-name="IntervalGrid"
      width={width || deviceSize}
      padding={padding || 0}
      hasPaddingGridContainer={hasPaddingGridContainer}
      hasCardBorder={hasCardBorder}
      className={className}
    >
      <div className="intervalGrid__item_container">{children}</div>
    </Styled.IntervalGrid>
  );
}

const Styled = {
  IntervalGrid: styled.div`
    position: relative;
    width: ${props => `calc(${props.width}px + ${props.padding}px * 2)`};
    margin: 0 auto;
    padding: ${props => (props.hasPaddingGridContainer ? `0 ${props.padding}px` : 0)};
    .intervalGrid__item_container {
      display: flex;
      flex-wrap: wrap;
      width: ${props =>
        props.hasPaddingGridContainer
          ? `calc(${props.width}px + ${props.padding}px * 2)`
          : `calc(${props.width}px + ${props.padding}px * 4)`};
      margin: ${props => `-${props.padding}px`};
      > .MuiGrid-item {
        padding: ${props => `${props.padding}px`};
        > [class*='_card'] {
          position: relative;
          border: ${({ hasCardBorder }) => hasCardBorder && `1px solid ${color.gray_border3}`};
        }
      }
    }
  `,
};
