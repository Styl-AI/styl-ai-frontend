import { createTheme } from "@mui/material/styles";

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#40A578',
      light: '#E6FF94',
      dark: '#006769',
    },
    secondary: {
      main: '#40A578',
      light: '#E6FF94',
      dark: '#40A578',
    },
    success: {
      main: '#13DEB9',
      light: '#9DDE8B',
      dark: '#40A578',
      contrastText: '#ffffff',
    },
    info: {
      main: '#539BFF',
      light: '#EBF3FE',
      dark: '#1682d4',
      contrastText: '#ffffff',
      customBlue: '#136DFA', // Added this line
    },
    error: {
      main: '#FA896B',
      light: '#FDEDE8',
      dark: '#f3704d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAE1F',
      light: '#E6FF94',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#E6FF94',
      A100: '#9DDE8B',
      A200: '#40A578',
    },
    grey: {
      100: '#E6FF94',
      200: '#9DDE8B',
      300: '#9DDE8B',
      400: '#40A578',
      500: '#006769',
      600: '#006769',

    },
    text: {
      primary: '#006769',
      secondary: '#006769',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: '#f6f9fc',
    },
    divider: '#e5eaef',
  },
},
  
);

export { baselightTheme };
