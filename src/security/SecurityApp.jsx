import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate } from 'react-router-dom';
import securityTheme from './theme';
import { SecurityProvider } from './context/SecurityContext';
import SecurityAuthPage from './pages/SecurityAuthPage';
import SecurityDashboardPage from './pages/SecurityDashboardPage';

export default function SecurityApp() {
  return (
    <ThemeProvider theme={securityTheme}>
      <CssBaseline />
      <SecurityProvider>
        <Routes>
          <Route path="/" element={<SecurityAuthPage />} />
          <Route path="/*" element={<SecurityDashboardPage />} />
        </Routes>
      </SecurityProvider>
    </ThemeProvider>
  );
}
