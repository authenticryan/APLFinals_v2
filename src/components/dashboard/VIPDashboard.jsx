import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LockIcon from '@mui/icons-material/Lock';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import KeyIcon from '@mui/icons-material/Key';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import PlaceIcon from '@mui/icons-material/Place';
import TierBadge from '../common/TierBadge';
import AISecurityBriefing from './AISecurityBriefing';
import { requestEscort } from '../../services/firebase';
import { getTierConfig } from '../../data/tickets';
import { getOrderTotal } from '../../data/foodMenu';

export default function VIPDashboard({ user, checkinData }) {
  const [escortStatus, setEscortStatus] = useState('idle');
  const tier = getTierConfig(user.tierNumber);
  const total = getOrderTotal(checkinData.foodOrder || []);

  const handleRequestEscort = async () => {
    setEscortStatus('loading');
    await requestEscort(user);
    await new Promise((r) => setTimeout(r, 1500));
    setEscortStatus('sent');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Welcome card */}
      <Card sx={{ background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}DD 100%)`, color: '#fff', overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                Welcome, {user.holderName.split(' ')[0]}!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                {user.match} · {user.matchDate}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ opacity: 0.9, lineHeight: 1 }}>{tier.icon}</Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Access Level</Typography>
              <Typography variant="body1" fontWeight={700}>{tier.label}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Zone</Typography>
              <Typography variant="body1" fontWeight={700}>{user.seat}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Entry</Typography>
              <Typography variant="body1" fontWeight={700}>{user.gate}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Security escort */}
      <Card variant="outlined" sx={{ borderColor: escortStatus === 'sent' ? 'success.main' : tier.color, borderWidth: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SecurityIcon sx={{ color: tier.color }} />
            <Typography variant="subtitle1" fontWeight={700}>Security Escort</Typography>
          </Box>

          {escortStatus === 'idle' && (
            <>
              <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
                As a <strong>{tier.short}</strong> attendee, you are entitled to a security escort from{' '}
                <strong>{user.escortGate || user.gate}</strong> to your assigned area.
              </Alert>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ py: 1.4, bgcolor: tier.color, '&:hover': { bgcolor: tier.color, filter: 'brightness(0.9)' }, fontWeight: 700 }}
                startIcon={<EscalatorWarningIcon />}
                onClick={handleRequestEscort}
              >
                Request Security Escort
              </Button>
            </>
          )}

          {escortStatus === 'loading' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress size={32} sx={{ color: tier.color }} />
              <Typography variant="body2" color="text.secondary" mt={1.5}>Notifying security team…</Typography>
            </Box>
          )}

          {escortStatus === 'sent' && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ alignItems: 'flex-start' }}
            >
              <Typography variant="subtitle2" fontWeight={700}>Escort Requested</Typography>
              <Typography variant="body2">
                Your security team has been notified. An officer will meet you at{' '}
                <strong>{user.escortGate || user.gate}</strong> within <strong>3–5 minutes</strong>.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Ref: ESC-{Date.now().toString(36).toUpperCase().slice(-6)} · {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Access directions */}
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PlaceIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={700}>Access Directions</Typography>
          </Box>
          <List dense disablePadding>
            {user.walkingDirections?.map((step, i) => (
              <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start', pb: 1 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
                  <Box sx={{
                    width: 22, height: 22, borderRadius: '50%',
                    bgcolor: tier.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>
                    {i + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Authorised zones */}
      {user.accessZones && (
        <Card variant="outlined">
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <KeyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={700}>Your Authorised Zones</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {user.accessZones.map((z) => (
                <Chip
                  key={z}
                  label={z}
                  size="small"
                  sx={{ bgcolor: tier.bg, color: tier.color, fontWeight: 600, fontSize: '0.75rem', border: `1px solid ${tier.color}30` }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* AI Security Briefing */}
      <AISecurityBriefing ticket={user} />

      {/* Locker */}
      {checkinData.selectedLocker && (
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LockIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Locker {checkinData.selectedLocker}</Typography>
                <Typography variant="caption" color="text.secondary">
                  PIN: <strong>4{checkinData.selectedLocker}7{checkinData.selectedLocker}</strong>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Food */}
      {total > 0 && (
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShoppingBagIcon sx={{ color: 'secondary.dark' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>Food Pre-Booked · ₹{total}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Served to your seat/box — show this screen to staff
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
