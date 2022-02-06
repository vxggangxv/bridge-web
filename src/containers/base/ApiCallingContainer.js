import React from 'react';
import { useShallowSelector } from 'lib/utils';
import FullScreenLoading from 'components/base/loading/FullScreenLoading';

// NOTE: api _PENDING, _SUCCESS, _FAILURE가 일어날경우 마다 발생하기 때문에 별도 하나의 seletor로서 관리
function ApiCallingContainer(props) {
  const { apiCalling } = useShallowSelector(state => ({
    apiCalling: state.base.apiCalling,
  }));

  return (
    <>
      <FullScreenLoading visible={apiCalling} />
    </>
  );
}

export default ApiCallingContainer;
