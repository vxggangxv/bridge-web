import React, { useState } from 'react';
import { createMuiTheme, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import styled, { createGlobalStyle } from 'styled-components';
import { color, fontFamilyValue } from 'styles/utils';
import { _color } from 'styles/_variables';
import useInput from 'lib/hooks/useInput';
import MuiContainer from './MuiContainer';

export default React.memo(function MuiTextField(props) {
  const { children, config = {} } = props;
  const muiProps = {
    ...props,
  };
  delete muiProps.config;

  const text = useInput(props.value);

  return (
    <MuiContainer {...props}>
      <TextField {...muiProps} value={text.value || ''} onChange={text.onChange} />
    </MuiContainer>
  );
});
