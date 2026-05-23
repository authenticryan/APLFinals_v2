import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TierBadge from '../common/TierBadge';
import { getTierConfig } from '../../data/tickets';

const SIMULATED_OTP = '123456';

export default function PhoneAuth({ ticket, onAuthenticated }) {
  const [phone, setPhone] = useState(ticket.phone);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const tier = getTierConfig(ticket.tierNumber);

  const sendOtp = async () => {
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setOtpSent(true);
  };

  const verifyOtp = async () => {
    setError('');
    if (otp !== SIMULATED_OTP) {
      setError('Invalid OTP. Use 123456 for this simulation.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onAuthenticated();
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: tier.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 2, border: `3px solid ${tier.color}`,
        }}>
          <Typography variant="h4">{tier.icon}</Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Verify Identity
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          OTP will be sent to your registered mobile
        </Typography>
      </Box>

      {/* Ticket summary */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${tier.bg} 0%, #ffffff 100%)`, border: `1px solid ${tier.color}30` }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                Ticket Verified
              </Typography>
              <Typography variant="h6" fontWeight={700}>{ticket.holderName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {ticket.ticketNumber} · {ticket.seat}, {ticket.section}
              </Typography>
            </Box>
            <TierBadge tierNumber={ticket.tierNumber} size="small" />
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 3 }}>
          {!otpSent ? (
            <>
              <TextField
                label="Registered Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                InputProps={{ startAdornment: <PhoneAndroidIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2, py: 1.4 }}
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </Button>
            </>
          ) : (
            <>
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                OTP sent to {phone}. <strong>Use 123456</strong> for this demo.
              </Alert>

              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => { setOtp(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
                fullWidth
                inputProps={{ maxLength: 6, style: { fontSize: '1.5rem', letterSpacing: '0.5em', fontFamily: 'monospace', textAlign: 'center' } }}
                error={Boolean(error)}
                helperText={error}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2, py: 1.4 }}
                onClick={verifyOtp}
                disabled={otp.length !== 6 || loading}
              >
                {loading ? 'Verifying…' : 'Verify & Proceed'}
              </Button>
              <Button
                variant="text"
                fullWidth
                size="small"
                sx={{ mt: 1 }}
                onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
              >
                Change number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
