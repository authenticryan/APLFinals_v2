import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AppProvider } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import CheckinPage from './pages/CheckinPage';
import DashboardPage from './pages/DashboardPage';
import SecurityApp from './security/SecurityApp';
import UserManagementApp from './user-management/UserManagementApp';

function CitizenApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/checkin" element={<CheckinPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/security/*" element={<SecurityApp />} />
        <Route path="/user-management/*" element={<UserManagementApp />} />
        <Route path="/*" element={<CitizenApp />} />
      </Routes>
    </BrowserRouter>
  );
}
