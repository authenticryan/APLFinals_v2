import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getEscortRequests, getQueue, getNotifications } from '../../services/securityDb';
import { useSecurityContext } from '../../context/SecurityContext';

export default function VIPSecDashboard() {
  const { officer } = useSecurityContext();
  const navigate = useNavigate();
  const [escorts, setEscorts] = useState([]);
  const [queue, setQueue] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    getEscortRequests(officer?.tier).then(setEscorts);
    getQueue(officer?.tier).then(setQueue);
    getNotifications(officer?.tier).then(setNotifs);
  }, [officer?.tier]);

  const pendingEscorts = escorts.filter((e) => e.status === 'pending');
  const waitingQueue = queue.filter((q) => q.status === 'waiting').length;
  const unread = notifs.filter((n) => !n.read).length;

  const TIER_COLOR = { 1: '#FFD700', 2: '#2979FF' };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <EscalatorWarningIcon sx={{ color: '#2979FF', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" fontWeight={800}>VIP Operations</Typography>
            <Typography variant="caption" color="text.secondary">Welcome, {officer?.name} · {officer?.gate}</Typography>
          </Box>
        </Box>
      </Box>

      {pendingEscorts.length > 0 && (
        <Alert severity="warning" icon={<EscalatorWarningIcon />} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate('/security/escorts')}>
          <strong>{pendingEscorts.length} pending escort request{pendingEscorts.length > 1 ? 's' : ''}</strong> — action required
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pending Escorts', value: pendingEscorts.length, color: '#FF9100', path: '/security/escorts' },
          { label: 'Waiting in Queue', value: waitingQueue,          color: '#2979FF', path: '/security/queue' },
          { label: 'Unread Alerts',    value: unread,                color: '#FFB300', path: '/security/notifications' },
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

      {/* Pending escorts */}
      <Typography variant="overline" color="text.secondary" display="block" mb={1.5}>Pending Escort Requests</Typography>
      {pendingEscorts.length === 0 && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ py: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">No pending escort requests</Typography>
          </CardContent>
        </Card>
      )}
      {pendingEscorts.slice(0, 3).map((e) => {
        const minsAgo = Math.floor((Date.now() - new Date(e.requestTime).getTime()) / 60000);
        const isUrgent = minsAgo > 8;
        return (
          <Card key={e.id} sx={{ mb: 1.5, border: `1px solid ${isUrgent ? '#FF1744' : '#2979FF'}30` }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: TIER_COLOR[e.tier] || '#2979FF', width: 36, height: 36, fontSize: '0.75rem', fontWeight: 700 }}>
                  {e.holderName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={700}>{e.holderName}</Typography>
                  <Typography variant="caption" color="text.secondary">{e.gate}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: isUrgent ? '#FF1744' : '#546E7A' }} />
                  <Typography variant="caption" sx={{ color: isUrgent ? '#FF1744' : '#546E7A' }}>{minsAgo}m {isUrgent ? '⚠️' : ''}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}

      <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
        <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/security/escorts')} sx={{ flex: 1, borderColor: '#2979FF', color: '#2979FF' }}>
          Escort Requests
        </Button>
        <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/security/queue')} sx={{ flex: 1, borderColor: '#546E7A', color: '#90A4AE' }}>
          VIP Queue
        </Button>
      </Box>
    </Box>
  );
}
