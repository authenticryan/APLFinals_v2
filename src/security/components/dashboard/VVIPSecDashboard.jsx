import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getConvoys, getThreats, getNotifications } from '../../services/securityDb';
import { CONVOY_STATUS_CONFIG } from '../../data/convoyData';
import { useSecurityContext } from '../../context/SecurityContext';

export default function VVIPSecDashboard() {
  const { officer } = useSecurityContext();
  const navigate = useNavigate();
  const [convoys, setConvoys] = useState([]);
  const [threats, setThreats] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    getConvoys().then(setConvoys);
    getThreats().then(setThreats);
    getNotifications('VVIP').then(setNotifs);
  }, []);

  const activeConvoys = convoys.filter((c) => c.status !== 'admitted');
  const activeThreats = threats.filter((t) => t.status === 'active');
  const unreadCritical = notifs.filter((n) => !n.read && n.priority === 'CRITICAL').length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <ShieldIcon sx={{ color: '#FFD700', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" fontWeight={800}>VVIP Operations Centre</Typography>
            <Typography variant="caption" color="text.secondary">Welcome, {officer?.name} · {officer?.badgeId}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Critical alerts */}
      {unreadCritical > 0 && (
        <Alert severity="error" icon={<NotificationsActiveIcon />} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/security/notifications')}>
          <strong>{unreadCritical} critical notification{unreadCritical > 1 ? 's' : ''}</strong> — tap to review immediately
        </Alert>
      )}
      {activeThreats.length > 0 && (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 2 }}>
          <strong>{activeThreats.length} active digital threat{activeThreats.length > 1 ? 's' : ''}</strong> in vicinity — review Threats panel
        </Alert>
      )}

      {/* Stat row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Convoys',   value: activeConvoys.length,    color: '#FFD700', path: '/security/convoy' },
          { label: 'Active Threats',   value: activeThreats.length,    color: '#FF1744', path: '/security/threats' },
          { label: 'Unread Alerts',    value: notifs.filter((n) => !n.read).length, color: '#FF9100', path: '/security/notifications' },
        ].map((s) => (
          <Grid item xs={4} key={s.label}>
            <Card sx={{ border: `1px solid ${s.color}30`, cursor: 'pointer', '&:hover': { borderColor: s.color } }} onClick={() => navigate(s.path)}>
              <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                <Typography variant="h3" fontWeight={900} sx={{ color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Convoy quick view */}
      <Typography variant="overline" color="text.secondary" display="block" mb={1.5}>Live Convoys</Typography>
      {convoys.length === 0 && <Typography color="text.secondary" variant="body2">No active convoys</Typography>}
      {convoys.map((c) => {
        const statusCfg = CONVOY_STATUS_CONFIG[c.status] || CONVOY_STATUS_CONFIG['assembling'];
        const progress = ((statusCfg.step + 1) / 5) * 100;
        return (
          <Card key={c.id} sx={{ mb: 2, border: `1px solid ${statusCfg.color}30` }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DirectionsCarIcon sx={{ color: statusCfg.color, fontSize: 20 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800}>CONVOY {c.id}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.principal} · {c.memberCount} members</Typography>
                  </Box>
                </Box>
                <Chip label={statusCfg.label} size="small" sx={{ bgcolor: `${statusCfg.color}20`, color: statusCfg.color, fontWeight: 700, fontSize: '0.65rem' }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">Progress</Typography>
                {c.etaMinutes > 0 && <Typography variant="caption" sx={{ color: statusCfg.color, fontWeight: 700 }}>ETA {c.etaMinutes}m</Typography>}
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { bgcolor: statusCfg.color } }} />
              {c.exposureRisk === 'HIGH' && (
                <Chip label="HIGH EXPOSURE RISK" size="small" sx={{ mt: 1, bgcolor: 'rgba(255,23,68,0.2)', color: '#FF1744', fontSize: '0.6rem', fontWeight: 700 }} />
              )}
            </CardContent>
          </Card>
        );
      })}

      <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/security/convoy')}
        sx={{ mt: 1, borderColor: '#FFD700', color: '#FFD700', '&:hover': { borderColor: '#FFD700', bgcolor: 'rgba(255,215,0,0.08)' } }}>
        Full Convoy Manager
      </Button>
    </Box>
  );
}
