import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { getQueue, getNotifications } from '../../services/securityDb';
import { useSecurityContext } from '../../context/SecurityContext';

export default function PressSecDashboard() {
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

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <CameraAltIcon sx={{ color: '#FF9100', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Press & Media Gate</Typography>
          <Typography variant="caption" color="text.secondary">{officer?.name} · {officer?.gate} — Media accreditation lane</Typography>
        </Box>
        {unread > 0 && <Chip label={`${unread} alerts`} sx={{ ml: 'auto', bgcolor: 'rgba(255,145,0,0.15)', color: '#FF9100', fontWeight: 700 }} />}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Awaiting Entry', value: counts.waiting,   color: '#FFB300' },
          { label: 'Processing',     value: counts.processing, color: '#2979FF' },
          { label: 'Admitted',       value: counts.admitted,  color: '#00E676' },
          { label: 'Flagged',        value: counts.flagged,   color: '#FF1744' },
        ].map((s) => (
          <Grid item xs={3} key={s.label}>
            <Card sx={{ border: `1px solid ${s.color}30` }}>
              <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Media accreditation note */}
      <Card sx={{ mb: 3, border: '1px solid rgba(255,145,0,0.3)', bgcolor: 'rgba(255,145,0,0.05)' }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#FF9100', mb: 1 }}>Press Gate Reminders</Typography>
          {['Verify BCCI media accreditation badge before admit', 'Camera equipment scan mandatory — heavy gear at bay 2', 'Press box seats: Level 3, rows P1–P6', 'Live broadcast crew use Gate D service entrance'].map((r) => (
            <Box key={r} sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start', mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 14, color: '#FF9100', mt: 0.25, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#90A4AE' }}>{r}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Recent queue */}
      <Typography variant="overline" color="text.secondary" display="block" mb={1.5}>Press Queue — Latest</Typography>
      {queue.slice(0, 4).map((q) => (
        <Card key={q.ticketNumber} variant="outlined" sx={{ mb: 1 }}>
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>{q.holderName}</Typography>
              <Typography variant="caption" sx={{ color: '#546E7A', fontFamily: 'monospace' }}>{q.ticketNumber}</Typography>
            </Box>
            <Chip
              label={q.status.toUpperCase()}
              size="small"
              sx={{ bgcolor: q.status === 'admitted' ? 'rgba(0,230,118,0.15)' : 'rgba(255,179,0,0.15)', color: q.status === 'admitted' ? '#00E676' : '#FFB300', fontWeight: 700, fontSize: '0.6rem' }}
            />
          </CardContent>
        </Card>
      ))}

      <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/security/queue')}
        sx={{ mt: 2, borderColor: '#FF9100', color: '#FF9100', '&:hover': { borderColor: '#FF9100', bgcolor: 'rgba(255,145,0,0.08)' } }}>
        Press Queue — Full View
      </Button>
    </Box>
  );
}
