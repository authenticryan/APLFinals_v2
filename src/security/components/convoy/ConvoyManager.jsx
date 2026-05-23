import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShieldIcon from '@mui/icons-material/Shield';
import { getConvoys, updateConvoy } from '../../services/securityDb';
import { CONVOY_STATUS_CONFIG } from '../../data/convoyData';

const STATUS_STEPS = ['assembling', 'en-route', 'gate-approach', 'clearing', 'admitted'];

export default function ConvoyManager() {
  const [convoys, setConvoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getConvoys().then((data) => { setConvoys(data); setLoading(false); });
    // Live ETA countdown
    const timer = setInterval(() => {
      setConvoys((prev) => prev.map((c) => c.etaMinutes > 0 && c.status !== 'admitted' ? { ...c, etaMinutes: Math.max(0, c.etaMinutes - 1) } : c));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const advanceStatus = async (convoy) => {
    const currentIdx = STATUS_STEPS.indexOf(convoy.status);
    if (currentIdx >= STATUS_STEPS.length - 1) return;
    const nextStatus = STATUS_STEPS[currentIdx + 1];
    const updatedGatesCleared = nextStatus === 'gate-approach'
      ? [...convoy.gatesCleared, convoy.gatesRequired[1] || '']
      : nextStatus === 'clearing'
      ? [...convoy.gatesCleared, convoy.gatesRequired[2] || '']
      : nextStatus === 'admitted'
      ? [...convoy.gatesRequired]
      : convoy.gatesCleared;
    const updated = { ...convoy, status: nextStatus, gatesCleared: updatedGatesCleared };
    setConvoys((prev) => prev.map((c) => c.id === convoy.id ? updated : c));
    await updateConvoy(convoy.id, { status: nextStatus, gatesCleared: updatedGatesCleared });
    setToast(`Convoy ${convoy.codename}: Status updated to ${CONVOY_STATUS_CONFIG[nextStatus]?.label}`);
  };

  if (loading) return <Box sx={{ pt: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading convoys…</Typography></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <DirectionsCarIcon sx={{ color: '#FFD700', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Convoy Manager</Typography>
          <Typography variant="caption" color="text.secondary">Real-time VVIP convoy tracking and gate clearance</Typography>
        </Box>
        <Chip label={`${convoys.filter((c) => c.status !== 'admitted').length} Active`} sx={{ ml: 'auto', bgcolor: 'rgba(255,215,0,0.15)', color: '#FFD700', fontWeight: 700 }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {convoys.map((convoy) => {
          const statusCfg = CONVOY_STATUS_CONFIG[convoy.status] || CONVOY_STATUS_CONFIG.assembling;
          const stepIdx = STATUS_STEPS.indexOf(convoy.status);
          const clearedPct = convoy.gatesRequired.length ? (convoy.gatesCleared.length / convoy.gatesRequired.length) * 100 : 0;
          const isAdmitted = convoy.status === 'admitted';

          return (
            <Card key={convoy.id} sx={{ border: `1px solid ${statusCfg.color}30`, boxShadow: `0 0 24px ${statusCfg.color}18` }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="h4" fontWeight={900} sx={{ color: '#FFD700', letterSpacing: 2 }}>
                        {convoy.codename}
                      </Typography>
                      <Chip label={statusCfg.label} size="small" sx={{ bgcolor: `${statusCfg.color}20`, color: statusCfg.color, fontWeight: 700, border: `1px solid ${statusCfg.color}50` }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">{convoy.vvipName}</Typography>
                    <Typography variant="caption" color="text.secondary">Lead: {convoy.securityLead} · {convoy.vehicleCount} vehicles</Typography>
                  </Box>
                  {!isAdmitted && (
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: convoy.etaMinutes <= 10 ? '#FF1744' : '#FFB300' }} />
                        <Typography variant="h5" fontWeight={800} sx={{ color: convoy.etaMinutes <= 10 ? '#FF1744' : '#FFB300' }}>
                          {convoy.etaMinutes}m
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">ETA</Typography>
                    </Box>
                  )}
                  {isAdmitted && <CheckCircleIcon sx={{ color: '#00E676', fontSize: 32 }} />}
                </Box>

                {/* Exposure risk */}
                {convoy.exposureRisk !== 'LOW' && !isAdmitted && (
                  <Alert
                    severity={convoy.exposureRisk === 'HIGH' ? 'error' : 'warning'}
                    icon={<WarningIcon />}
                    sx={{ mb: 2, '& .MuiAlert-message': { fontSize: '0.78rem' } }}
                  >
                    <strong>Exposure Risk: {convoy.exposureRisk}</strong> — {convoy.exposureNote}
                  </Alert>
                )}

                {/* Current location */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)' }}>
                  <LocationOnIcon sx={{ color: statusCfg.color, fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">Current position:</Typography>
                  <Typography variant="body2" fontWeight={600}>{convoy.currentLocation}</Typography>
                </Box>

                {/* Status stepper */}
                <Stepper activeStep={stepIdx} alternativeLabel sx={{ mb: 2 }}>
                  {STATUS_STEPS.map((s) => (
                    <Step key={s} completed={STATUS_STEPS.indexOf(s) < stepIdx}>
                      <StepLabel
                        sx={{
                          '& .MuiStepLabel-label': { fontSize: '0.65rem', color: STATUS_STEPS.indexOf(s) <= stepIdx ? CONVOY_STATUS_CONFIG[s]?.color : '#546E7A' },
                          '& .MuiStepIcon-root.Mui-active': { color: statusCfg.color },
                          '& .MuiStepIcon-root.Mui-completed': { color: '#00E676' },
                        }}
                      >
                        {CONVOY_STATUS_CONFIG[s]?.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Gate clearance progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Gate Clearance</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ color: clearedPct === 100 ? '#00E676' : '#FFB300' }}>
                      {convoy.gatesCleared.length}/{convoy.gatesRequired.length} cleared
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={clearedPct} sx={{ height: 6, '& .MuiLinearProgress-bar': { bgcolor: clearedPct === 100 ? '#00E676' : '#FFB300' } }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {convoy.gatesRequired.map((gate) => (
                      <Chip
                        key={gate}
                        label={gate}
                        size="small"
                        icon={convoy.gatesCleared.includes(gate) ? <CheckCircleIcon style={{ fontSize: 12, color: '#00E676' }} /> : <RadioButtonUncheckedIcon style={{ fontSize: 12 }} />}
                        sx={{ fontSize: '0.65rem', bgcolor: convoy.gatesCleared.includes(gate) ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.05)', color: convoy.gatesCleared.includes(gate) ? '#00E676' : '#546E7A', border: 'none' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Convoy members */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="overline" color="text.secondary" mb={1} display="block">Convoy Members ({convoy.members.length})</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {convoy.members.map((m, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', minWidth: '45%', flex: '1 0 45%' }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: m.role === 'VVIP' ? '#FFD700' : m.role === 'SPG' ? '#2979FF' : '#546E7A', color: '#000' }}>
                          {m.vehicle}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" fontWeight={700} noWrap display="block" sx={{ color: m.role === 'VVIP' ? '#FFD700' : '#E8EAF6' }}>{m.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#546E7A', fontSize: '0.62rem' }}>{m.designation}</Typography>
                        </Box>
                        <Chip label={m.clearance} size="small" sx={{ ml: 'auto', fontSize: '0.58rem', height: 18, bgcolor: 'rgba(255,255,255,0.05)', color: '#546E7A' }} />
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Notes */}
                {convoy.notes && (
                  <Alert severity="warning" sx={{ mb: 2, fontSize: '0.78rem' }}>{convoy.notes}</Alert>
                )}

                {/* Actions */}
                {!isAdmitted && (
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={() => advanceStatus(convoy)}
                      startIcon={<CheckCircleIcon />}
                      sx={{ bgcolor: statusCfg.color, color: '#000', '&:hover': { bgcolor: statusCfg.color, filter: 'brightness(0.85)' }, fontWeight: 700, flex: 1 }}
                    >
                      Advance: {CONVOY_STATUS_CONFIG[STATUS_STEPS[STATUS_STEPS.indexOf(convoy.status) + 1]]?.label || 'Done'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<WarningIcon />}
                      sx={{ borderColor: '#FF1744', color: '#FF1744', flex: 1 }}
                      onClick={() => setToast(`Emergency halt issued for Convoy ${convoy.codename}`)}
                    >
                      Emergency Halt
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
