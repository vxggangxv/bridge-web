import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { color, fontFamilyValue } from 'styles/utils';
import { Slider } from '@material-ui/core';

export default function MuiThemeProvider({
  children,
  color: colorProp,
  contrastText,
  fontFamily: fontFamilyProp,
}) {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: colorProp ? colorProp : color.blue,
        contrastText: contrastText || '#fff',
      },
    },
    typography: {
      fontFamily: fontFamilyProp ? fontFamilyProp : fontFamilyValue,
    },
    props: {
      // Styled Component로 변경 하여 사용 불가 에러메시지
      MuiButtonBase: {
        // disableRipple: true,
        // disableElevation: true,
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
