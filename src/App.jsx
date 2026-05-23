import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AppProvider } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import CheckinPage from './pages/CheckinPage';
import DashboardPage from './pages/DashboardPage';
import SecurityApp from './security/SecurityApp';
import UserManagementApp from './user-management/UserManagementApp';
import LandingSelector from './components/LandingSelector';

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

function RootRoute() {
  const [fanSelected, setFanSelected] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    if (id === 'fan') setFanSelected(true);
    else if (id === 'security') navigate('/security/');
    else if (id === 'management') navigate('/user-management/');
  };

  if (!fanSelected) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LandingSelector onSelect={handleSelect} />
      </ThemeProvider>
    );
  }

  return <CitizenApp />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/security/*" element={<SecurityApp />} />
        <Route path="/user-management/*" element={<UserManagementApp />} />
        <Route path="/*" element={<RootRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
