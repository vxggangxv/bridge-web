import React from 'react';
import styled from 'styled-components';
import CircularLoading from 'components/base/loading/CircularLoading';
import PropTypes from 'prop-types';
import LinearLoading from './LinearLoading';

function FullScreenLoading({ visible, size, type = 'circle' }) {
  if (visible === false) return null;
  return (
    <Styled.FullScreenLoading data-component-name="FullScreenLoading">
      {type === 'circle' && <CircularLoading size={size} />}
      {type === 'linear' && <LinearLoading />}
    </Styled.FullScreenLoading>
  );
}

FullScreenLoading.propTypes = {
  visible: PropTypes.bool,
  size: PropTypes.number,
};

const Styled = {
  FullScreenLoading: styled.div`
    z-index: 100;
    background: transparent;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

export default FullScreenLoading;
