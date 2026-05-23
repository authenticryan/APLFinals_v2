import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SecurityIcon from '@mui/icons-material/Security';
import { useAppContext } from '../../context/AppContext';
import { saveCheckin } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { getOrderTotal } from '../../data/foodMenu';

export default function CheckinComplete() {
  const { currentUser, checkinData, updateCheckin } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date().toISOString();
    updateCheckin({ checkedIn: true, checkinTime: now });
    saveCheckin(currentUser.ticketNumber, {
      ...checkinData,
      checkedIn: true,
      checkinTime: now,
      holderName: currentUser.holderName,
      tier: currentUser.tierNumber,
    });
  }, []);

  const total = getOrderTotal(checkinData.foodOrder || []);

  return (
    <Box>
      {/* Success hero */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 2,
          boxShadow: '0 8px 28px rgba(46,125,50,0.35)',
          animation: 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '@keyframes pop': {
            '0%': { transform: 'scale(0.5)', opacity: 0 },
            '100%': { transform: 'scale(1)', opacity: 1 },
          },
        }}>
          <CheckCircleIcon sx={{ color: '#fff', fontSize: 48 }} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="success.main">
          Check-In Complete!
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Welcome to Wankhede Stadium, {currentUser.holderName.split(' ')[0]}! 🏏
        </Typography>
      </Box>

      {/* Digital pass */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #003087 0%, #1565C0 100%)', color: '#fff' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ opacity: 0.75, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '0.68rem' }}>
            Digital Match Pass
          </Typography>
          <Typography variant="h5" fontWeight={800} mt={0.5}>{currentUser.holderName}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
            {currentUser.ticketNumber} · {currentUser.match}
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Seat / Zone</Typography>
              <Typography variant="body2" fontWeight={700}>{currentUser.seat}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Entry Gate</Typography>
              <Typography variant="body2" fontWeight={700}>{currentUser.gate}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Section</Typography>
              <Typography variant="body2" fontWeight={700}>{currentUser.section}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Match Date</Typography>
              <Typography variant="body2" fontWeight={700}>{currentUser.matchDate?.split('·')[0].trim()}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {/* Locker */}
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LockIcon sx={{ color: checkinData.selectedLocker ? 'primary.main' : 'text.disabled' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {checkinData.selectedLocker ? `Locker ${checkinData.selectedLocker} Reserved` : 'No Locker'}
                </Typography>
                {checkinData.selectedLocker && (
                  <Typography variant="caption" color="text.secondary">
                    PIN: <strong>4{checkinData.selectedLocker}7{checkinData.selectedLocker}</strong> · Near {currentUser.nearestLocker || 'Gate entrance'}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Food */}
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShoppingBagIcon sx={{ color: total > 0 ? 'secondary.dark' : 'text.disabled' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {total > 0 ? `Food Pre-Booked · ₹${total}` : 'No Food Order'}
                </Typography>
                {total > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Pick up at {currentUser.nearestFoodStall || 'nearest stall'} — show this screen
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Security */}
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SecurityIcon sx={{ color: 'success.main' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Stadium Rules Acknowledged</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        sx={{ py: 1.5 }}
        onClick={() => navigate('/dashboard')}
      >
        Go to My Dashboard →
      </Button>
    </Box>
  );
}
