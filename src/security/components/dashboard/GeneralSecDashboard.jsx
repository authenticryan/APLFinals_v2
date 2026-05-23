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
import GroupsIcon from '@mui/icons-material/Groups';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getGateMetrics, getQueue, getNotifications } from '../../services/securityDb';
import { getGateStatus, GATES } from '../../data/gateData';
import { useSecurityContext } from '../../context/SecurityContext';

export default function GeneralSecDashboard() {
  const { officer } = useSecurityContext();
  const navigate = useNavigate();
  const [gateData, setGateData] = useState({});
  const [queue, setQueue] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    getGateMetrics().then(setGateData);
    getQueue(officer?.tier).then(setQueue);
    getNotifications(officer?.tier).then(setNotifs);
  }, [officer?.tier]);

  const gates = Object.values(gateData);
  const totalIn = gates.reduce((s, g) => s + (g.current || 0), 0);
  const totalCap = gates.reduce((s, g) => s + (g.capacity || 0), 0);
  const overflowCount = gates.filter((g) => getGateStatus(g.current, g.capacity).label === 'OVERFLOW').length;
  const waitingCount = queue.filter((q) => q.status === 'waiting').length;
  const unread = notifs.filter((n) => !n.read).length;
  const pct = totalCap ? Math.round((totalIn / totalCap) * 100) : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <GroupsIcon sx={{ color: '#90A4AE', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>General Entry Operations</Typography>
          <Typography variant="caption" color="text.secondary">{officer?.name} · {officer?.gate}</Typography>
        </Box>
        {unread > 0 && <Chip label={`${unread} alerts`} sx={{ ml: 'auto', bgcolor: 'rgba(255,179,0,0.15)', color: '#FFB300', fontWeight: 700 }} />}
      </Box>

      {overflowCount > 0 && (
        <Alert severity="error" icon={<WarningAmberIcon />} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/security/gate')}>
          <strong>{overflowCount} gate{overflowCount > 1 ? 's' : ''} at OVERFLOW</strong> — diversion required
        </Alert>
      )}

      {/* Overall occupancy */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>Stadium Occupancy</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: pct > 80 ? '#FF1744' : '#00E676' }}>{pct}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={Math.min(100, pct)} sx={{ height: 10, borderRadius: 5, mb: 0.5, '& .MuiLinearProgress-bar': { bgcolor: pct > 80 ? '#FF1744' : pct > 65 ? '#FFB300' : '#00E676' } }} />
          <Typography variant="caption" color="text.secondary">{totalIn.toLocaleString()} / {totalCap.toLocaleString()} capacity</Typography>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Admitted',   value: totalIn.toLocaleString(),   color: '#00E676' },
          { label: 'Gate Overflow',    value: overflowCount,              color: '#FF1744' },
          { label: 'Queue Waiting',    value: waitingCount,               color: '#FFB300' },
        ].map((s) => (
          <Grid item xs={4} key={s.label}>
            <Card sx={{ border: `1px solid ${s.color}30` }}>
              <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gate status mini-list */}
      <Typography variant="overline" color="text.secondary" display="block" mb={1.5}>Gate Status Overview</Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {GATES.slice(0, 6).map((gateDef) => {
          const g = gateData[gateDef.id] || { current: 0, capacity: gateDef.capacity };
          const { label, color } = getGateStatus(g.current, g.capacity);
          const p = Math.min(100, Math.round(((g.current || 0) / (g.capacity || 1)) * 100));
          return (
            <Grid item xs={4} key={gateDef.id}>
              <Card variant="outlined" sx={{ border: `1px solid ${color}30` }}>
                <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={800} sx={{ color: gateDef.color || '#90A4AE' }}>Gate {gateDef.id}</Typography>
                    <Typography variant="caption" sx={{ color, fontWeight: 700, fontSize: '0.6rem' }}>{p}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={p} sx={{ height: 4, borderRadius: 2, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
                  <Typography variant="caption" sx={{ fontSize: '0.58rem', color: '#546E7A' }}>{label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/security/gate')} sx={{ flex: 1, borderColor: '#90A4AE', color: '#90A4AE' }}>
          Gate Management
        </Button>
        <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/security/queue')} sx={{ flex: 1, borderColor: '#546E7A', color: '#546E7A' }}>
          Entry Queue
        </Button>
      </Box>
    </Box>
  );
}
