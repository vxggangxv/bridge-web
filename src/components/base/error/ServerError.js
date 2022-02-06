import React from 'react';
import ErrorForm from './ErrorForm';

function ServerError(props) {
  return <ErrorForm code="500" text="ServerError" />;
}

export default ServerError;
