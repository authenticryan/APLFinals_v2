import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { getQueue, updateQueueItem } from '../../services/securityDb';
import { useSecurityContext } from '../../context/SecurityContext';
import { TIER_LABELS } from './tierLabels';

const STATUS_CONFIG = {
  waiting:    { label: 'Waiting',    color: '#FFB300', bg: 'rgba(255,179,0,0.15)' },
  processing: { label: 'Processing', color: '#2979FF', bg: 'rgba(41,121,255,0.15)' },
  admitted:   { label: 'Admitted',   color: '#00E676', bg: 'rgba(0,230,118,0.15)' },
  flagged:    { label: 'Flagged',    color: '#FF1744', bg: 'rgba(255,23,68,0.15)' },
};

const TIER_COLORS = { 1: '#FFD700', 2: '#2979FF', 3: '#00E676', 4: '#FF9100', 5: '#90A4AE' };
const TIER_LABELS_MAP = { 1: 'VVIP', 2: 'VIP', 3: 'Player', 4: 'Press', 5: 'General' };

export default function AttendeeQueue() {
  const { officer } = useSecurityContext();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getQueue(officer?.tier).then((data) => { setQueue(data); setLoading(false); });
    // Simulate new arrivals every 20s
    const timer = setInterval(() => {
      const names = ['Priya V.', 'Amit R.', 'Sunita K.', 'Raju M.', 'Geeta S.', 'Vinod P.'];
      const gates = { VVIP: 'Gate A', VIP: 'Gate B', PLAYER: 'Gate C', PRESS: 'Gate D', GENERAL: 'Gate E', ADMIN: 'Gate E' };
      const tierNums = { VVIP: 1, VIP: 2, PLAYER: 3, PRESS: 4, GENERAL: 5, ADMIN: 5 };
      setQueue((prev) => [
        { ticketNumber: `IPL-NEW-${Date.now().toString(36).slice(-4).toUpperCase()}`, holderName: names[Math.floor(Math.random() * names.length)], tier: tierNums[officer?.tier] || 5, gate: gates[officer?.tier] || 'Gate E', status: 'waiting', timestamp: new Date().toISOString() },
        ...prev.slice(0, 19),
      ]);
    }, 20000);
    return () => clearInterval(timer);
  }, [officer?.tier]);

  const updateStatus = async (ticketNumber, status) => {
    setQueue((prev) => prev.map((q) => q.ticketNumber === ticketNumber ? { ...q, status } : q));
    await updateQueueItem(ticketNumber, status);
    setToast(`${ticketNumber}: marked as ${status}`);
  };

  const counts = { waiting: 0, processing: 0, admitted: 0, flagged: 0 };
  queue.forEach((q) => { counts[q.status] = (counts[q.status] || 0) + 1; });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <PeopleIcon sx={{ color: '#2979FF', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Attendee Queue</Typography>
          <Typography variant="caption" color="text.secondary">
            {officer?.gate} · {officer?.tier} access tier
          </Typography>
        </Box>
        <Chip label={`${counts.waiting} waiting`} sx={{ ml: 'auto', bgcolor: 'rgba(255,179,0,0.15)', color: '#FFB300', fontWeight: 700 }} />
      </Box>

      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {Object.entries(counts).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, p: 1.25, borderRadius: 2, bgcolor: cfg.bg, border: `1px solid ${cfg.color}30`, minWidth: 90 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: cfg.color, lineHeight: 1 }}>{count}</Typography>
              <Typography variant="caption" sx={{ color: cfg.color, textTransform: 'capitalize' }}>{status}</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Flagged alerts first */}
      {queue.filter((q) => q.status === 'flagged').map((q) => (
        <Alert key={q.ticketNumber} severity="error" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
          <strong>{q.holderName} ({q.ticketNumber})</strong> — {q.flagReason || 'Flagged for secondary check'}
          <Button size="small" variant="outlined" sx={{ ml: 2, color: '#FF1744', borderColor: '#FF1744', fontSize: '0.7rem' }} onClick={() => updateStatus(q.ticketNumber, 'processing')}>
            Begin Secondary Check
          </Button>
        </Alert>
      ))}

      {/* Queue table */}
      <Card variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ticket</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Gate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((q) => {
                const cfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.waiting;
                const mins = Math.floor((Date.now() - new Date(q.timestamp).getTime()) / 60000);
                return (
                  <TableRow key={q.ticketNumber} sx={{ bgcolor: q.status === 'flagged' ? 'rgba(255,23,68,0.05)' : 'transparent' }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#90A4AE' }}>{q.ticketNumber}</TableCell>
                    <TableCell><Typography variant="body2" fontWeight={600}>{q.holderName}</Typography></TableCell>
                    <TableCell>
                      <Chip label={TIER_LABELS_MAP[q.tier]} size="small" sx={{ bgcolor: `${TIER_COLORS[q.tier]}20`, color: TIER_COLORS[q.tier], fontSize: '0.65rem', fontWeight: 700, height: 20 }} />
                    </TableCell>
                    <TableCell><Typography variant="caption">{q.gate}</Typography></TableCell>
                    <TableCell>
                      <Chip label={cfg.label} size="small" sx={{ bgcolor: cfg.bg, color: cfg.color, fontSize: '0.65rem', fontWeight: 700, height: 20 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 12, color: mins > 10 ? '#FF1744' : '#546E7A' }} />
                        <Typography variant="caption" sx={{ color: mins > 10 ? '#FF1744' : '#546E7A' }}>{mins}m</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {q.status === 'waiting' && (
                          <Button size="small" onClick={() => updateStatus(q.ticketNumber, 'processing')} sx={{ fontSize: '0.65rem', py: 0.25, px: 1, minWidth: 0 }}>Process</Button>
                        )}
                        {(q.status === 'waiting' || q.status === 'processing') && (
                          <Button size="small" variant="contained" onClick={() => updateStatus(q.ticketNumber, 'admitted')} startIcon={<CheckCircleIcon sx={{ fontSize: 12 }} />} sx={{ fontSize: '0.65rem', py: 0.25, px: 1, minWidth: 0, bgcolor: '#00E676', color: '#000', '&:hover': { bgcolor: '#00C853' } }}>
                            Admit
                          </Button>
                        )}
                        {q.status !== 'flagged' && q.status !== 'admitted' && (
                          <Button size="small" onClick={() => updateStatus(q.ticketNumber, 'flagged')} startIcon={<FlagIcon sx={{ fontSize: 12 }} />} sx={{ fontSize: '0.65rem', py: 0.25, px: 1, minWidth: 0, color: '#FF1744' }}>
                            Flag
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
