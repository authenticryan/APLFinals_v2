import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import Tooltip from '@mui/material/Tooltip';
import TierBadge from './TierBadge';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AppLayout({ children }) {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <SportsCricketIcon sx={{ mr: 0.5, fontSize: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1} sx={{ color: '#fff' }}>
              IPL Companion
            </Typography>
            {currentUser && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>
                {currentUser.match} · {currentUser.venue?.split(',')[0]}
              </Typography>
            )}
          </Box>
          {currentUser && (
            <>
              <TierBadge
                tierNumber={currentUser.tierNumber}
                size="small"
                sx={{ mr: 0.5, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              />
              <Tooltip title="Sign out">
                <IconButton color="inherit" onClick={handleLogout} size="small">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          maxWidth: 480,
          mx: 'auto',
          px: 2,
          py: 3,
          pb: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
