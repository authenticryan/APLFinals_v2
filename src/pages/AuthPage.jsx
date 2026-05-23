import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import TicketEntry from '../components/auth/TicketEntry';
import PhoneAuth from '../components/auth/PhoneAuth';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [step, setStep] = useState('ticket');
  const [verifiedTicket, setVerifiedTicket] = useState(null);
  const { login, currentUser, checkinData } = useAppContext();
  const navigate = useNavigate();

  if (currentUser) {
    if (checkinData.checkedIn) navigate('/dashboard', { replace: true });
    else navigate('/checkin', { replace: true });
  }

  const onTicketVerified = (ticket) => {
    setVerifiedTicket(ticket);
    setStep('phone');
  };

  const onAuthenticated = () => {
    login(verifiedTicket);
    navigate('/checkin');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #002868 0%, #003087 40%, #1565C0 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', pt: 5, pb: 3, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
          <SportsCricketIcon sx={{ color: '#FFB300', fontSize: 32 }} />
          <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', letterSpacing: '-0.5px' }}>
            IPL Companion
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.7rem' }}>
          Secure Stadium Access · Google AI
        </Typography>
      </Box>

      {/* Card */}
      <Box sx={{
        flex: 1,
        bgcolor: 'background.default',
        borderRadius: '24px 24px 0 0',
        px: 2.5,
        pt: 4,
        pb: 6,
        maxWidth: 480,
        width: '100%',
        mx: 'auto',
        alignSelf: 'stretch',
      }}>
        {step === 'ticket' && <TicketEntry onVerified={onTicketVerified} />}
        {step === 'phone' && verifiedTicket && (
          <PhoneAuth ticket={verifiedTicket} onAuthenticated={onAuthenticated} />
        )}
      </Box>
    </Box>
  );
}
