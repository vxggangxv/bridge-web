import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
// import { green } from '@material-ui/core/colors';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Favorite from '@material-ui/icons/Favorite';
// import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { color } from 'styles/utils';

const CustomMuiCheckbox = ({
  name = '',
  checked = false,
  onChange = e => {},
  defaultColor = '#ccc',
  activeColor = color.blue,
  padding = 9,
  icon = <></>,
  checkedIcon = <></>,
}) => {
  // const [checked, setChecked] = React.useState(false);

  // const handleChange = event => {
  //   setChecked(event.target.checked);
  // };

  const StyledCheckbox = withStyles({
    root: {
      color: defaultColor,
      padding: padding,
      '&$checked': {
        color: activeColor,
      },
    },
    checked: {},
  })(props => <Checkbox color="default" {...props} />);

  return <StyledCheckbox checked={checked} onChange={onChange} name={name} />;
};

export default React.memo(CustomMuiCheckbox);

/* <FormControlLabel
  control={<GreenCheckbox checked={state.checkedG} onChange={handleChange} name="checkedG" />}
  label="Custom color"
/> */
