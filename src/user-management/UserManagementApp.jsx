import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate } from 'react-router-dom';
import StaffListPage from './pages/StaffListPage';

const umTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#070D1A', paper: '#0D1829' },
    primary: { main: '#2979FF' },
    secondary: { main: '#E040FB' },
  },
  typography: { fontFamily: '"Roboto","Helvetica","Arial",sans-serif' },
  shape: { borderRadius: 10 },
});

export default function UserManagementApp() {
  return (
    <ThemeProvider theme={umTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<StaffListPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
