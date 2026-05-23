import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import SecurityIcon from '@mui/icons-material/Security';
import PlaceIcon from '@mui/icons-material/Place';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import KeyIcon from '@mui/icons-material/Key';
import TierBadge from '../common/TierBadge';
import { useAppContext } from '../../context/AppContext';
import { getTierConfig } from '../../data/tickets';

export default function TierStatus({ onNext }) {
  const { currentUser } = useAppContext();
  const tier = getTierConfig(currentUser.tierNumber);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
        Your Access Status
      </Typography>

      {/* Hero tier card */}
      <Card sx={{
        mb: 3,
        background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}CC 100%)`,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Box sx={{
          position: 'absolute', top: -20, right: -20,
          width: 120, height: 120, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.10)',
        }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '0.68rem' }}>
                Access Level
              </Typography>
              <Typography variant="h4" fontWeight={800} lineHeight={1}>{tier.short}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>{tier.label}</Typography>
            </Box>
            <Typography variant="h2" sx={{ opacity: 0.9, lineHeight: 1 }}>{tier.icon}</Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.25)', my: 2 }} />
          <Typography variant="h6" fontWeight={700}>{currentUser.holderName}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {currentUser.ticketNumber} · {currentUser.matchDate}
          </Typography>
        </CardContent>
      </Card>

      {/* Seat and access details */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.72rem' }}>
            Match Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <EventSeatIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Seat / Zone</Typography>
                  <Typography variant="body2" fontWeight={600}>{currentUser.seat}</Typography>
                  <Typography variant="caption" color="text.secondary">{currentUser.section}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <PlaceIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Entry Gate</Typography>
                  <Typography variant="body2" fontWeight={600}>{currentUser.gate}</Typography>
                  <Typography variant="caption" color="text.secondary">{currentUser.venue?.split(',')[0]}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <SecurityIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Security Authority</Typography>
                  <Typography variant="body2" fontWeight={600}>{currentUser.securityAuthority || 'State Police & Home Guards'}</Typography>
                </Box>
              </Box>
            </Grid>
            {currentUser.accessZones && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <KeyIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Authorised Zones</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {currentUser.accessZones.map((z) => (
                        <Chip key={z} label={z} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem' }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        sx={{ py: 1.5 }}
        onClick={onNext}
      >
        Begin Check-In →
      </Button>
    </Box>
  );
}
