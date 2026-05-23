import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FlightIcon from '@mui/icons-material/Flight';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SecurityIcon from '@mui/icons-material/Security';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { getThreats, updateThreat } from '../../services/securityDb';
import { THREAT_TYPES, SEVERITY_CONFIG, INITIAL_THREATS, RF_BANDS, DRONE_SCANNERS } from '../../data/threatData';

export default function ThreatMonitor() {
  const [threats, setThreats] = useState([]);
  const [rfBands, setRfBands] = useState(RF_BANDS);
  const [scanners, setScanners] = useState(DRONE_SCANNERS);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [scanPulse, setScanPulse] = useState(true);

  useEffect(() => {
    getThreats().then((data) => { setThreats(data); setLoading(false); });
    // Simulate RF band health fluctuations
    const rfTimer = setInterval(() => {
      setRfBands((prev) => prev.map((b) => ({ ...b, health: Math.min(100, Math.max(30, b.health + (Math.random() - 0.45) * 8)) })));
    }, 5000);
    // Scanner pulse
    const pulseTimer = setInterval(() => setScanPulse((p) => !p), 2000);
    return () => { clearInterval(rfTimer); clearInterval(pulseTimer); };
  }, []);

  const resolveT = async (threat) => {
    setThreats((prev) => prev.map((t) => t.id === threat.id ? { ...t, status: 'resolved', resolvedAt: new Date().toISOString() } : t));
    await updateThreat(threat.id, 'resolved');
    setToast(`Threat ${threat.id} marked as resolved`);
  };

  const activeThreat = threats.filter((t) => t.status === 'active');
  const monitoring = threats.filter((t) => t.status === 'monitoring');
  const resolved = threats.filter((t) => t.status === 'resolved');

  const rfHealth = Math.round(rfBands.reduce((s, b) => s + b.health, 0) / rfBands.length);

  if (loading) return <Box sx={{ pt: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading threat signals…</Typography></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <WarningAmberIcon sx={{ color: '#FF1744', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>Digital Threat Monitor</Typography>
          <Typography variant="caption" color="text.secondary">Drone detection · RF health · Cyber threat indicators</Typography>
        </Box>
        {activeThreat.length > 0 && (
          <Chip label={`${activeThreat.length} ACTIVE THREAT${activeThreat.length > 1 ? 'S' : ''}`} sx={{ ml: 'auto', bgcolor: 'rgba(255,23,68,0.2)', color: '#FF5252', fontWeight: 700, animation: 'blink 1s step-start infinite', '@keyframes blink': { '50%': { opacity: 0.5 } } }} />
        )}
      </Box>

      {/* Active threats banner */}
      {activeThreat.map((t) => (
        <Alert key={t.id} severity="error" icon={<WarningAmberIcon />} sx={{ mb: 1.5 }}>
          <strong>ACTIVE THREAT — {THREAT_TYPES[t.type]?.label}: {t.severity} SEVERITY</strong><br />
          <Typography variant="caption">{t.location} — {t.description.slice(0, 100)}…</Typography>
        </Alert>
      ))}

      <Grid container spacing={2.5}>
        {/* ── Drone Detection ────────────────────────────────────── */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FlightIcon sx={{ color: '#FF1744' }} />
                <Typography variant="h6" fontWeight={700}>Drone Detection</Typography>
                <Chip label={`${scanners.filter((s) => s.status === 'active').length}/${scanners.length} online`} size="small" sx={{ ml: 'auto', bgcolor: 'rgba(0,230,118,0.15)', color: '#00E676', fontSize: '0.68rem' }} />
              </Box>

              {/* Scanner array status */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="overline" color="text.secondary" display="block" mb={1}>Scanner Arrays</Typography>
                <Grid container spacing={1}>
                  {scanners.map((scanner) => (
                    <Grid item xs={6} key={scanner.id}>
                      <Box sx={{
                        p: 1.25, borderRadius: 2,
                        border: `1px solid ${scanner.status === 'active' ? '#00E676' : '#FF1744'}30`,
                        bgcolor: scanner.status === 'active' ? 'rgba(0,230,118,0.05)' : 'rgba(255,23,68,0.05)',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        {scanner.status === 'active' && scanPulse && (
                          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(0,230,118,0.3)', animation: 'radarPulse 2s ease-out infinite', '@keyframes radarPulse': { '0%': { transform: 'translate(-50%,-50%) scale(0)', opacity: 1 }, '100%': { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 } } }} />
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, position: 'relative' }}>
                          <GpsFixedIcon sx={{ fontSize: 14, color: scanner.status === 'active' ? '#00E676' : '#FF1744' }} />
                          <Box>
                            <Typography variant="caption" fontWeight={700} display="block">{scanner.name}</Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.62rem', color: '#546E7A' }}>{scanner.location}</Typography>
                          </Box>
                        </Box>
                        {scanner.detectCount > 0 && (
                          <Chip label={`${scanner.detectCount} detected`} size="small" sx={{ mt: 0.5, bgcolor: 'rgba(255,23,68,0.2)', color: '#FF1744', fontSize: '0.6rem', height: 16 }} />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Drone threats */}
              <Typography variant="overline" color="text.secondary" display="block" mb={1}>Detected Objects</Typography>
              {threats.filter((t) => t.type === 'drone').map((t) => {
                const sev = SEVERITY_CONFIG[t.severity];
                return (
                  <Box key={t.id} sx={{ p: 1.5, borderRadius: 2, mb: 1, bgcolor: sev.bg, border: `1px solid ${sev.color}30` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', mb: 0.25 }}>
                          <Chip label={sev.label} size="small" sx={{ bgcolor: `${sev.color}30`, color: sev.color, fontWeight: 700, fontSize: '0.6rem', height: 16 }} />
                          <Chip label={t.status.toUpperCase()} size="small" sx={{ bgcolor: t.status === 'resolved' ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.05)', color: t.status === 'resolved' ? '#00E676' : '#546E7A', fontSize: '0.6rem', height: 16 }} />
                        </Box>
                        <Typography variant="caption" fontWeight={600} display="block">{t.location}</Typography>
                        <Typography variant="caption" sx={{ color: '#546E7A', fontSize: '0.68rem' }}>{t.description.slice(0, 80)}…</Typography>
                      </Box>
                    </Box>
                    {t.status !== 'resolved' && (
                      <Button size="small" variant="outlined" onClick={() => resolveT(t)} sx={{ mt: 1, fontSize: '0.65rem', py: 0.25, color: '#00E676', borderColor: '#00E676' }}>
                        Resolve
                      </Button>
                    )}
                    {t.status === 'resolved' && (
                      <Typography variant="caption" color="success.main">✓ Resolved {new Date(t.resolvedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Typography>
                    )}
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* ── RF Signal Health ───────────────────────────────────── */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NetworkCheckIcon sx={{ color: rfHealth > 75 ? '#00E676' : '#FFB300' }} />
                <Typography variant="h6" fontWeight={700}>RF Signal Health</Typography>
                <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Typography variant="h5" fontWeight={800} sx={{ color: rfHealth > 75 ? '#00E676' : '#FFB300', lineHeight: 1 }}>{rfHealth}%</Typography>
                  <Typography variant="caption" color="text.secondary">overall</Typography>
                </Box>
              </Box>
              {rfBands.map((band) => {
                const h = Math.round(band.health);
                const color = h > 80 ? '#00E676' : h > 60 ? '#FFB300' : '#FF1744';
                return (
                  <Box key={band.band} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                      <Typography variant="caption" fontWeight={600}>{band.band}</Typography>
                      <Typography variant="caption" sx={{ color }}>{h}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={h} sx={{ height: 5, borderRadius: 3, '& .MuiLinearProgress-bar': { bgcolor: color, transition: 'width 1s ease' } }} />
                    <Typography variant="caption" sx={{ fontSize: '0.62rem', color: '#546E7A' }}>{band.note}</Typography>
                  </Box>
                );
              })}
            </CardContent>
          </Card>

          {/* Cyber threats */}
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SecurityIcon sx={{ color: '#AA00FF' }} />
                <Typography variant="h6" fontWeight={700}>Cyber Threats</Typography>
              </Box>
              {threats.filter((t) => t.type === 'cyber' || t.type === 'signal_jammer').map((t) => {
                const sev = SEVERITY_CONFIG[t.severity];
                const typeCfg = THREAT_TYPES[t.type];
                return (
                  <Box key={t.id} sx={{ p: 1.5, borderRadius: 2, mb: 1, bgcolor: sev.bg, border: `1px solid ${sev.color}30` }}>
                    <Box sx={{ display: 'flex', gap: 0.75, mb: 0.5 }}>
                      <Typography variant="caption">{typeCfg?.icon}</Typography>
                      <Chip label={typeCfg?.label} size="small" sx={{ bgcolor: `${typeCfg?.color}20`, color: typeCfg?.color, fontSize: '0.6rem', height: 16 }} />
                      <Chip label={sev.label} size="small" sx={{ bgcolor: `${sev.color}20`, color: sev.color, fontSize: '0.6rem', height: 16 }} />
                      <Chip label={t.status} size="small" sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.05)', color: '#546E7A', fontSize: '0.6rem', height: 16 }} />
                    </Box>
                    <Typography variant="caption" fontWeight={600} display="block">{t.location}</Typography>
                    <Typography variant="caption" sx={{ color: '#546E7A', fontSize: '0.68rem' }}>{t.description.slice(0, 90)}…</Typography>
                    {t.status !== 'resolved' && (
                      <Button size="small" onClick={() => resolveT(t)} sx={{ mt: 0.5, fontSize: '0.65rem', py: 0.25, color: '#00E676' }}>
                        Mark Resolved
                      </Button>
                    )}
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
