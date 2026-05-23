import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import BlockIcon from '@mui/icons-material/Block';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getGateMetrics, updateGateMetric } from '../../services/securityDb';
import { GATES, getGateStatus, simulateGateUpdate } from '../../data/gateData';

export default function GateManagement() {
  const [gateData, setGateData] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getGateMetrics().then((data) => { setGateData(data); setLoading(false); });
    // Simulate real-time gate fluctuations every 8 seconds
    const timer = setInterval(() => {
      setGateData((prev) => {
        const updated = {};
        GATES.forEach((g) => {
          if (prev[g.id]) updated[g.id] = simulateGateUpdate(prev[g.id]);
        });
        return { ...prev, ...updated };
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleGateAction = async (gateId, action) => {
    const messages = {
      alert: `Gate ${gateId}: Staff alerted — crowd management support requested`,
      divert: `Gate ${gateId}: Diversion protocol activated — overflow to adjacent gate`,
      close: `Gate ${gateId}: Emergency closure initiated — no further entry`,
    };
    setToast(messages[action] || `Gate ${gateId}: ${action} executed`);
    if (action === 'close') {
      setGateData((prev) => ({ ...prev, [gateId]: { ...prev[gateId], status: 'closed', current: prev[gateId]?.current || 0 } }));
      await updateGateMetric(gateId, { status: 'closed' });
    }
  };

  const gates = Object.values(gateData);
  const overflowGates = gates.filter((g) => getGateStatus(g.current, g.capacity).label === 'OVERFLOW');
  const totalInStadium = gates.reduce((s, g) => s + (g.current || 0), 0);
  const totalCapacity = gates.reduce((s, g) => s + (g.capacity || 0), 0);

  if (loading) return <Box sx={{ pt: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading gate metrics…</Typography></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <MeetingRoomIcon sx={{ color: '#2979FF', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Gate Management</Typography>
          <Typography variant="caption" color="text.secondary">Live crowd density · updates every 8 seconds</Typography>
        </Box>
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography variant="h6" fontWeight={800}>{totalInStadium.toLocaleString()}</Typography>
          <Typography variant="caption" color="text.secondary">in stadium / {totalCapacity.toLocaleString()} cap</Typography>
        </Box>
      </Box>

      {/* Overflow alerts */}
      {overflowGates.map((g) => (
        <Alert key={g.id} severity="error" icon={<WarningAmberIcon />} sx={{ mb: 1.5, fontSize: '0.8rem' }}>
          <strong>OVERFLOW: {g.name}</strong> — {g.current}/{g.capacity} ({Math.round((g.current / g.capacity) * 100)}%). Immediate action required.
          <Button size="small" variant="outlined" sx={{ ml: 2, color: '#FF1744', borderColor: '#FF1744', fontSize: '0.7rem' }} onClick={() => handleGateAction(g.id, 'divert')}>
            Activate Diversion
          </Button>
        </Alert>
      ))}

      {/* Overall progress */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>Stadium Total Occupancy</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: totalInStadium / totalCapacity > 0.8 ? '#FF1744' : '#00E676' }}>
              {Math.round((totalInStadium / totalCapacity) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (totalInStadium / totalCapacity) * 100)}
            sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { bgcolor: totalInStadium / totalCapacity > 0.8 ? '#FF1744' : totalInStadium / totalCapacity > 0.65 ? '#FFB300' : '#00E676' } }}
          />
        </CardContent>
      </Card>

      {/* Gate grid */}
      <Grid container spacing={2}>
        {GATES.map((gateDef) => {
          const g = gateData[gateDef.id] || { ...gateDef, current: 0 };
          const pct = Math.min(100, Math.round((g.current / g.capacity) * 100));
          const { label, color } = getGateStatus(g.current, g.capacity);
          const isClosed = g.status === 'closed';

          return (
            <Grid item xs={12} sm={6} md={4} key={gateDef.id}>
              <Card sx={{ border: `1px solid ${color}30`, opacity: isClosed ? 0.6 : 1 }}>
                <CardContent sx={{ p: 2 }}>
                  {/* Gate header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h4" fontWeight={900} sx={{ color: gateDef.color, lineHeight: 1 }}>{gateDef.id}</Typography>
                        <Chip
                          label={isClosed ? 'CLOSED' : label}
                          size="small"
                          sx={{ bgcolor: isClosed ? 'rgba(144,164,174,0.2)' : `${color}20`, color: isClosed ? '#546E7A' : color, fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{gateDef.type}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight={800} sx={{ color, lineHeight: 1 }}>{pct}%</Typography>
                      <Typography variant="caption" color="text.secondary">{g.current}/{g.capacity}</Typography>
                    </Box>
                  </Box>

                  {/* Capacity bar */}
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{ height: 8, borderRadius: 4, mb: 1.5, '& .MuiLinearProgress-bar': { bgcolor: color } }}
                  />

                  {/* Flow rate */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 14, color: '#546E7A' }} />
                      <Typography variant="caption" color="text.secondary">{g.flowRate || 0} /min</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{gateDef.location}</Typography>
                  </Box>

                  {/* Actions */}
                  {!isClosed && (
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                      <Button size="small" startIcon={<NotificationImportantIcon sx={{ fontSize: 12 }} />} onClick={() => handleGateAction(gateDef.id, 'alert')}
                        sx={{ flex: 1, fontSize: '0.65rem', py: 0.4, px: 0.75, borderColor: 'rgba(255,255,255,0.15)', color: '#90A4AE' }} variant="outlined">
                        Alert Staff
                      </Button>
                      {pct > 70 && (
                        <Button size="small" startIcon={<SwapHorizIcon sx={{ fontSize: 12 }} />} onClick={() => handleGateAction(gateDef.id, 'divert')}
                          sx={{ flex: 1, fontSize: '0.65rem', py: 0.4, px: 0.75, borderColor: '#FFB300', color: '#FFB300' }} variant="outlined">
                          Divert
                        </Button>
                      )}
                      {pct > 85 && (
                        <Button size="small" startIcon={<BlockIcon sx={{ fontSize: 12 }} />} onClick={() => handleGateAction(gateDef.id, 'close')}
                          sx={{ flex: 1, fontSize: '0.65rem', py: 0.4, px: 0.75, borderColor: '#FF1744', color: '#FF1744' }} variant="outlined">
                          Close Gate
                        </Button>
                      )}
                    </Box>
                  )}
                  {isClosed && (
                    <Alert severity="error" sx={{ py: 0.5, fontSize: '0.72rem' }}>Gate closed — no further entry</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar open={Boolean(toast)} autoHideDuration={5000} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
