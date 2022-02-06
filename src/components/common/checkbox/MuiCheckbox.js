import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

export default React.memo(props => {
  const { color, className } = props;
  const muiProps = { ...props };
  delete muiProps.color;

  const CustomMuiCheckbox = withStyles({
    root: {
      color: color,
      // marginTop: '-9px',
      // marginBottom: '-9px',
      padding: 0,
      marginLeft: 5,
      marginRight: 5,
      '&$checked': {
        color,
      },
    },
    checked: {},
  })(props => <Checkbox color="default" {...props} />);

  return <CustomMuiCheckbox {...muiProps} />;
});

const Styled = {
  MuiCheckbox: styled.div``,
};
