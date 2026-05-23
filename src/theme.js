import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003087',
      light: '#1565C0',
      dark: '#00205B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFB300',
      light: '#FFD54F',
      dark: '#FF8F00',
      contrastText: '#000000',
    },
    success: { main: '#2E7D32' },
    error: { main: '#C62828' },
    warning: { main: '#E65100' },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#546E7A',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.5px' },
    h2: { fontWeight: 700, letterSpacing: '-0.25px' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.3px' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F4F6F9',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*': { boxSizing: 'border-box' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0,48,135,0.08)',
          border: '1px solid rgba(0,48,135,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,48,135,0.20)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #003087 0%, #1565C0 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #00205B 0%, #003087 100%)' },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FAFBFF',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: { padding: '16px 0' },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: { fontSize: '0.78rem', fontWeight: 500 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #003087 0%, #1565C0 100%)',
          boxShadow: '0 2px 12px rgba(0,48,135,0.25)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(0,48,135,0.08)' },
      },
    },
  },
});

export default theme;
