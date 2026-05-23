import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import ShieldIcon from '@mui/icons-material/Shield';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import { getStaff, DEMO_PHONES, getRoleConfig } from '../../data/securityStaff';

const STEPS = ['phone', 'otp', 'kyc', 'done'];

export default function SecurityAuth({ onAuthenticated }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [kycProgress, setKycProgress] = useState(0);
  const [kycDone, setKycDone] = useState(false);
  const [scanLabel, setScanLabel] = useState('Initialising biometric scanner…');

  const sendOtp = async () => {
    setError('');
    const found = getStaff(phone.trim());
    if (!found) { setError('Phone number not registered in the security personnel database.'); return; }
    setStaff(found);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep('otp');
  };

  const verifyOtp = async () => {
    setError('');
    if (otp !== '123456') { setError('Invalid OTP. Use 123456 for this simulation.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setStep('kyc');
  };

  const runKyc = async () => {
    setLoading(true);
    const stages = [
      'Reading badge RFID…',
      'Verifying biometric hash…',
      'Cross-referencing CCTNS database…',
      'Validating shift assignment…',
      'Checking duty roster…',
      'KYC verification complete ✓',
    ];
    for (let i = 0; i < stages.length; i++) {
      await new Promise((r) => setTimeout(r, 550));
      setScanLabel(stages[i]);
      setKycProgress(Math.round(((i + 1) / stages.length) * 100));
    }
    await new Promise((r) => setTimeout(r, 400));
    setKycDone(true);
    setLoading(false);
    setStep('done');
    await new Promise((r) => setTimeout(r, 800));
    onAuthenticated(staff);
  };

  const tier = staff ? getRoleConfig(staff.tier) : null;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #020812 0%, #060D18 50%, #0A1525 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      p: 2,
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
          <ShieldIcon sx={{ color: '#2979FF', fontSize: 36 }} />
          <Typography variant="h5" fontWeight={800} sx={{ color: '#E8EAF6', letterSpacing: 1 }}>
            IPL SECURITY OPS
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#546E7A', letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.68rem' }}>
          Restricted Access — Authorised Personnel Only
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 0.5 }}>
          {STEPS.map((s, i) => (
            <Box key={s} sx={{ width: 28, height: 3, borderRadius: 1.5, bgcolor: STEPS.indexOf(step) >= i ? '#2979FF' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          ))}
        </Box>
      </Box>

      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Phone step */}
          {step === 'phone' && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={0.5}>Officer Authentication</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>Enter your registered duty mobile number</Typography>
              <TextField
                label="Duty Mobile Number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                fullWidth
                error={Boolean(error)}
                helperText={error}
                sx={{ mb: 2 }}
                placeholder="+91 00001 00001"
              />
              <Button variant="contained" fullWidth size="large" onClick={sendOtp} disabled={!phone.trim() || loading} sx={{ py: 1.3, mb: 3 }}>
                {loading ? 'Verifying…' : 'Send OTP →'}
              </Button>
              <Divider sx={{ mb: 2 }}><Typography variant="caption" color="text.secondary">Demo personnel — tap to fill</Typography></Divider>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {DEMO_PHONES.map((p) => (
                  <Chip key={p.phone} label={p.label} size="small" variant="outlined" onClick={() => setPhone(p.phone)} sx={{ justifyContent: 'flex-start', height: 28, fontSize: '0.72rem', cursor: 'pointer', borderColor: 'rgba(255,255,255,0.15)' }} />
                ))}
              </Box>
            </Box>
          )}

          {/* OTP step */}
          {step === 'otp' && staff && (
            <Box>
              <Alert severity="success" sx={{ mb: 2, fontSize: '0.8rem' }}>
                OTP dispatched to {phone}. <strong>Use 123456</strong>.
              </Alert>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, p: 1.5, borderRadius: 2, bgcolor: `${tier?.bg}` }}>
                <Avatar sx={{ bgcolor: tier?.color, width: 44, height: 44, fontWeight: 700 }}>
                  {staff.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>{staff.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{staff.badgeId} · {staff.dept}</Typography>
                </Box>
                <Chip label={staff.tier} size="small" sx={{ ml: 'auto', bgcolor: tier?.color, color: '#000', fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => { setOtp(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
                fullWidth
                inputProps={{ maxLength: 6, style: { fontSize: '2rem', letterSpacing: '0.6em', fontFamily: 'monospace', textAlign: 'center' } }}
                error={Boolean(error)}
                helperText={error}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth size="large" onClick={verifyOtp} disabled={otp.length !== 6 || loading} sx={{ py: 1.3 }}>
                {loading ? 'Verifying…' : 'Verify OTP'}
              </Button>
            </Box>
          )}

          {/* KYC step */}
          {step === 'kyc' && staff && (
            <Box sx={{ textAlign: 'center' }}>
              <FingerprintIcon sx={{ fontSize: 72, color: kycDone ? '#00E676' : '#2979FF', mb: 2, animation: !kycDone && !loading ? 'pulse 1.5s ease-in-out infinite' : 'none', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />
              <Typography variant="h6" fontWeight={700} mb={0.5}>Biometric KYC Verification</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>{staff.name} · {staff.badgeId}</Typography>
              {kycProgress > 0 && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress variant="determinate" value={kycProgress} sx={{ height: 6, borderRadius: 3, mb: 1 }} />
                  <Typography variant="caption" color="primary.light">{scanLabel}</Typography>
                </Box>
              )}
              {!loading && kycProgress === 0 && (
                <Button variant="contained" fullWidth size="large" onClick={runKyc} startIcon={<FingerprintIcon />} sx={{ py: 1.3 }}>
                  Begin Biometric KYC
                </Button>
              )}
              {loading && kycProgress === 0 && <CircularProgress size={28} />}
            </Box>
          )}

          {/* Done step */}
          {step === 'done' && staff && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#00E676', mb: 2 }} />
              <Typography variant="h6" fontWeight={700} color="success.main" mb={0.5}>Identity Verified</Typography>
              <Typography variant="body2" color="text.secondary">Accessing secure dashboard…</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
