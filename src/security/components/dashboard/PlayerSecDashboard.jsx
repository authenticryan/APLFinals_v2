import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import FlagIcon from '@mui/icons-material/Flag';
import { getQueue, getNotifications } from '../../services/securityDb';
import { useSecurityContext } from '../../context/SecurityContext';

export default function PlayerSecDashboard() {
  const { officer } = useSecurityContext();
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    getQueue(officer?.tier).then(setQueue);
    getNotifications(officer?.tier).then(setNotifs);
  }, [officer?.tier]);

  const counts = { waiting: 0, processing: 0, admitted: 0, flagged: 0 };
  queue.forEach((q) => { counts[q.status] = (counts[q.status] || 0) + 1; });
  const unread = notifs.filter((n) => !n.read).length;

  const statItems = [
    { label: 'Waiting',   value: counts.waiting,    color: '#FFB300', icon: HourglassTopIcon },
    { label: 'Admitted',  value: counts.admitted,   color: '#00E676', icon: CheckCircleIcon },
    { label: 'Flagged',   value: counts.flagged,    color: '#FF1744', icon: FlagIcon },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <SportsCricketIcon sx={{ color: '#00E676', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Player & Staff Gate</Typography>
          <Typography variant="caption" color="text.secondary">{officer?.name} · {officer?.gate} — Player access corridor</Typography>
        </Box>
        {unread > 0 && <Chip label={`${unread} alerts`} sx={{ ml: 'auto', bgcolor: 'rgba(255,179,0,0.2)', color: '#FFB300', fontWeight: 700 }} />}
      </Box>

      {/* Quick stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statItems.map((s) => {
          const Icon = s.icon;
          return (
            <Grid item xs={4} key={s.label}>
              <Card sx={{ border: `1px solid ${s.color}30` }}>
                <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                  <Icon sx={{ color: s.color, fontSize: 20, mb: 0.5 }} />
                  <Typography variant="h3" fontWeight={900} sx={{ color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent queue entries */}
      <Typography variant="overline" color="text.secondary" display="block" mb={1.5}>Recent in Queue</Typography>
      {queue.slice(0, 4).map((q) => (
        <Card key={q.ticketNumber} variant="outlined" sx={{ mb: 1, bgcolor: q.status === 'flagged' ? 'rgba(255,23,68,0.05)' : 'transparent' }}>
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>{q.holderName}</Typography>
              <Typography variant="caption" sx={{ color: '#546E7A', fontFamily: 'monospace' }}>{q.ticketNumber}</Typography>
            </Box>
            <Chip
              label={q.status.toUpperCase()}
              size="small"
              sx={{
                bgcolor: q.status === 'admitted' ? 'rgba(0,230,118,0.15)' : q.status === 'flagged' ? 'rgba(255,23,68,0.15)' : 'rgba(255,179,0,0.15)',
                color: q.status === 'admitted' ? '#00E676' : q.status === 'flagged' ? '#FF1744' : '#FFB300',
                fontWeight: 700, fontSize: '0.6rem',
              }}
            />
          </CardContent>
        </Card>
      ))}

      <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/security/queue')}
        sx={{ mt: 2, borderColor: '#00E676', color: '#00E676', '&:hover': { borderColor: '#00E676', bgcolor: 'rgba(0,230,118,0.08)' } }}>
        Player Queue — Full View
      </Button>
    </Box>
  );
}
