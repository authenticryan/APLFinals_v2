import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getGateMetrics, getConvoys, getThreats, getEscortRequests, getQueue, getNotifications } from '../../services/securityDb';
import { getGateStatus } from '../../data/gateData';
import { useSecurityContext } from '../../context/SecurityContext';

export default function AdminSecDashboard() {
  const { officer } = useSecurityContext();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ convoys: 0, threats: 0, escorts: 0, queueWaiting: 0, gateOverflow: 0, unread: 0, totalIn: 0 });

  useEffect(() => {
    Promise.all([
      getConvoys(), getThreats(), getEscortRequests('ADMIN'),
      getQueue('ADMIN'), getGateMetrics(), getNotifications('ADMIN'),
    ]).then(([convoys, threats, escorts, queue, gates, notifs]) => {
      const gateArr = Object.values(gates);
      setSummary({
        convoys: convoys.filter((c) => c.status !== 'admitted').length,
        threats: threats.filter((t) => t.status === 'active').length,
        escorts: escorts.filter((e) => e.status === 'pending').length,
        queueWaiting: queue.filter((q) => q.status === 'waiting').length,
        gateOverflow: gateArr.filter((g) => getGateStatus(g.current, g.capacity).label === 'OVERFLOW').length,
        unread: notifs.filter((n) => !n.read).length,
        totalIn: gateArr.reduce((s, g) => s + (g.current || 0), 0),
      });
    });
  }, []);

  const panels = [
    { label: 'Active Convoys',   value: summary.convoys,      color: '#FFD700', path: '/security/convoy' },
    { label: 'Active Threats',   value: summary.threats,      color: '#FF1744', path: '/security/threats' },
    { label: 'Pending Escorts',  value: summary.escorts,      color: '#FF9100', path: '/security/escorts' },
    { label: 'Queue Waiting',    value: summary.queueWaiting, color: '#2979FF', path: '/security/queue' },
    { label: 'Gate Overflow',    value: summary.gateOverflow, color: '#FF1744', path: '/security/gate' },
    { label: 'Unread Alerts',    value: summary.unread,       color: '#FFB300', path: '/security/notifications' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <ManageAccountsIcon sx={{ color: '#E040FB', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Admin Operations Overview</Typography>
          <Typography variant="caption" color="text.secondary">{officer?.name} · Full system access · {summary.totalIn.toLocaleString()} in stadium</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {panels.map((s) => (
          <Grid item xs={6} sm={4} key={s.label}>
            <Card sx={{ border: `1px solid ${s.color}30`, cursor: 'pointer', '&:hover': { borderColor: s.color, bgcolor: `${s.color}05` }, transition: 'all 0.2s' }} onClick={() => navigate(s.path)}>
              <CardContent sx={{ p: 2.5, textAlign: 'center', '&:last-child': { pb: 2.5 } }}>
                <Typography variant="h2" fontWeight={900} sx={{ color: s.color, lineHeight: 1, mb: 0.5 }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/user-management')}
        sx={{ borderColor: '#E040FB', color: '#E040FB', '&:hover': { borderColor: '#E040FB', bgcolor: 'rgba(224,64,251,0.08)' } }}>
        User Management — Staff Roles
      </Button>
    </Box>
  );
}
