import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { getEscortRequests, updateEscortRequest } from '../../services/securityDb';
import { useSecurityContext } from '../../context/SecurityContext';

const TIER_CFG = { 1: { label: 'VVIP', color: '#FFD700' }, 2: { label: 'VIP', color: '#2979FF' }, 3: { label: 'Player', color: '#00E676' }, 4: { label: 'Press', color: '#FF9100' }, 5: { label: 'General', color: '#90A4AE' } };

const STATUS_CFG = {
  pending:  { label: 'Pending',  color: '#FFB300', bg: 'rgba(255,179,0,0.15)' },
  assigned: { label: 'Assigned', color: '#2979FF', bg: 'rgba(41,121,255,0.15)' },
  complete: { label: 'Complete', color: '#00E676', bg: 'rgba(0,230,118,0.15)' },
};

export default function EscortRequests() {
  const { officer } = useSecurityContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getEscortRequests(officer?.tier).then((data) => { setRequests(data); setLoading(false); });
  }, [officer?.tier]);

  const assignEscort = async (req) => {
    const updated = { ...req, status: 'assigned', assignedTo: officer?.badgeId };
    setRequests((prev) => prev.map((r) => r.id === req.id ? updated : r));
    await updateEscortRequest(req.id, 'assigned', officer?.badgeId);
    setToast(`Escort assigned to ${req.holderName} — you are the responding officer`);
  };

  const completeEscort = async (req) => {
    setRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: 'complete' } : r));
    await updateEscortRequest(req.id, 'complete', officer?.badgeId);
    setToast(`Escort completed for ${req.holderName}`);
  };

  const pending = requests.filter((r) => r.status === 'pending').length;

  if (loading) return <Box sx={{ pt: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading escort requests…</Typography></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <EscalatorWarningIcon sx={{ color: '#2979FF', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Escort Requests</Typography>
          <Typography variant="caption" color="text.secondary">VIP / VVIP escort assignments for {officer?.gate}</Typography>
        </Box>
        {pending > 0 && <Chip label={`${pending} pending`} sx={{ ml: 'auto', bgcolor: 'rgba(255,23,68,0.2)', color: '#FF5252', fontWeight: 700 }} />}
      </Box>

      {requests.length === 0 && (
        <Alert severity="info">No escort requests at this time for your tier.</Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {requests.map((req) => {
          const tierCfg = TIER_CFG[req.tier] || TIER_CFG[5];
          const statusCfg = STATUS_CFG[req.status] || STATUS_CFG.pending;
          const minsAgo = Math.floor((Date.now() - new Date(req.requestTime).getTime()) / 60000);
          const isUrgent = minsAgo > 8 && req.status === 'pending';
          return (
            <Card key={req.id} sx={{ border: `1px solid ${isUrgent ? '#FF1744' : tierCfg.color}30`, boxShadow: isUrgent ? '0 0 16px rgba(255,23,68,0.2)' : undefined }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: tierCfg.color, color: '#000', width: 44, height: 44, fontWeight: 700 }}>
                      {req.holderName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{req.holderName}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                        <Chip label={tierCfg.label} size="small" sx={{ bgcolor: `${tierCfg.color}20`, color: tierCfg.color, fontWeight: 700, fontSize: '0.65rem', height: 18 }} />
                        <Typography variant="caption" color="text.secondary">{req.ticketNumber}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Chip label={statusCfg.label} sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, fontWeight: 700, fontSize: '0.72rem' }} />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <PersonPinCircleIcon sx={{ fontSize: 16, color: '#546E7A' }} />
                    <Typography variant="body2">{req.gate}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: isUrgent ? '#FF1744' : '#546E7A' }} />
                    <Typography variant="body2" sx={{ color: isUrgent ? '#FF1744' : 'text.secondary' }}>
                      {minsAgo}m ago {isUrgent && '⚠️ URGENT'}
                    </Typography>
                  </Box>
                  {req.assignedTo && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#00E676' }} />
                      <Typography variant="body2" color="success.main">Assigned: {req.assignedTo}</Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {req.status === 'pending' && (
                    <Button variant="contained" onClick={() => assignEscort(req)} sx={{ flex: 1, py: 0.75, bgcolor: tierCfg.color, color: '#000', '&:hover': { bgcolor: tierCfg.color, filter: 'brightness(0.85)' }, fontWeight: 700 }}>
                      Accept Escort
                    </Button>
                  )}
                  {req.status === 'assigned' && (
                    <Button variant="contained" onClick={() => completeEscort(req)} startIcon={<CheckCircleIcon />} sx={{ flex: 1, py: 0.75, bgcolor: '#00E676', color: '#000', '&:hover': { bgcolor: '#00C853' }, fontWeight: 700 }}>
                      Mark Complete
                    </Button>
                  )}
                  {req.status === 'complete' && (
                    <Typography variant="body2" color="success.main" sx={{ flex: 1, textAlign: 'center', py: 0.75 }}>✓ Escort completed</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
