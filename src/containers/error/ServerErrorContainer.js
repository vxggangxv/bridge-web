import React from 'react';
import { useEffect } from 'react';
import ErrorForm from 'components/base/error/ErrorForm';
import { useShallowSelector } from 'lib/utils';

function ServerErrorContainer(props) {
  const { responseStatus } = useShallowSelector(state => ({
    responseStatus: state.base.responseStatus,
  }));

  useEffect(() => {
    if (responseStatus !== null) {
      // window.location.reload();
    }
  }, []);

  return (
    <>
      <ErrorForm code="500" text="ServerError" />
    </>
  );
}

export default ServerErrorContainer;
