import { createTheme } from '@mui/material/styles';

const securityTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2979FF', light: '#82B1FF', dark: '#1565C0' },
    secondary: { main: '#FF1744', light: '#FF5252', dark: '#C62828' },
    success: { main: '#00E676', dark: '#00C853' },
    warning: { main: '#FFB300', dark: '#FF8F00' },
    error: { main: '#FF1744', dark: '#D50000' },
    info: { main: '#00B0FF' },
    background: { default: '#070D1A', paper: '#0D1829' },
    divider: 'rgba(255,255,255,0.07)',
    text: { primary: '#E8EAF6', secondary: '#90A4AE' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.2px' },
    overline: { letterSpacing: '1.5px', fontSize: '0.68rem', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#070D1A', scrollbarColor: '#1E293B #070D1A' },
        '*::-webkit-scrollbar': { width: '6px' },
        '*::-webkit-scrollbar-track': { background: '#070D1A' },
        '*::-webkit-scrollbar-thumb': { background: '#1E293B', borderRadius: '3px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0D1829',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px', boxShadow: 'none' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1565C0 0%, #2979FF 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 700, fontSize: '0.72rem' } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          mx: 1,
          '&.Mui-selected': {
            background: 'rgba(41,121,255,0.15)',
            borderLeft: '3px solid #2979FF',
            '& .MuiListItemIcon-root': { color: '#2979FF' },
            '& .MuiListItemText-primary': { color: '#82B1FF', fontWeight: 700 },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { background: '#060D18', border: 'none', borderRight: '1px solid rgba(255,255,255,0.05)' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: '#060D18', borderBottom: '1px solid rgba(255,255,255,0.07)', boxShadow: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { background: '#0A1525', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.72rem', color: '#90A4AE' },
        root: { borderColor: 'rgba(255,255,255,0.05)' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)' } },
    },
  },
});

export default securityTheme;
