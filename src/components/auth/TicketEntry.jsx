import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { getTicket } from '../../data/tickets';

const DEMO_TICKETS = [
  { id: 'IPL-VVIP-001', label: 'VVIP · Aarav Shah' },
  { id: 'IPL-VVIP-002', label: 'VVIP · Priya Kapoor' },
  { id: 'IPL-VIP-003', label: 'VIP · Rahul Mehta' },
  { id: 'IPL-VIP-004', label: 'VIP · Sunita Patel' },
  { id: 'IPL-PLY-005', label: 'Player · Vikas Kumar' },
  { id: 'IPL-SPR-007', label: 'Press · Neha Sharma' },
  { id: 'IPL-GEN-009', label: 'General · Amit Joshi' },
  { id: 'IPL-GEN-010', label: 'General · Kavya Nair' },
];

export default function TicketEntry({ onVerified }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ticket = getTicket(value.trim());
    setLoading(false);
    if (!ticket) {
      setError('Ticket not found. Please check your ticket number and try again.');
      return;
    }
    onVerified(ticket);
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #003087 0%, #1565C0 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 2, boxShadow: '0 8px 24px rgba(0,48,135,0.30)',
        }}>
          <ConfirmationNumberIcon sx={{ color: '#fff', fontSize: 36 }} />
        </Box>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Enter Your Ticket
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          MI vs CSK · Wankhede Stadium · 15 Apr 2025
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            label="Ticket Number"
            placeholder="e.g. IPL-GEN-009"
            value={value}
            onChange={(e) => { setValue(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && verify()}
            fullWidth
            error={Boolean(error)}
            helperText={error}
            InputProps={{ sx: { fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: 1 } }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, py: 1.4 }}
            onClick={verify}
            disabled={!value.trim() || loading}
          >
            {loading ? 'Verifying…' : 'Verify Ticket'}
          </Button>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">Demo tickets — tap to auto-fill</Typography>
      </Divider>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {DEMO_TICKETS.map((t) => (
          <Chip
            key={t.id}
            label={t.id}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => setValue(t.id)}
            sx={{ fontFamily: 'monospace', cursor: 'pointer', fontSize: '0.72rem' }}
          />
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        {DEMO_TICKETS.map((t) => (
          <Typography key={t.id} variant="caption" display="block" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.8 }}>
            <code style={{ color: '#003087', fontWeight: 600 }}>{t.id}</code> — {t.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
