import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c4dff', // Vibrant deep purple
      light: '#b47cff',
      dark: '#3f1dcb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00e5ff', // Neon cyan accent
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: '#000000',
    },
    background: {
      default: '#0a0a0a',
      paper: '#121212',
    },
    error: {
      main: '#ff1744',
    },
    success: {
      main: '#00e676',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Modern apps avoid ALL CAPS buttons
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(45deg, #7c4dff 30%, #5e35b1 90%)',
          },
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(124, 77, 255, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

export default theme;
