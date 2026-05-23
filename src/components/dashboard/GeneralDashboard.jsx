import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import LockIcon from '@mui/icons-material/Lock';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TierBadge from '../common/TierBadge';
import { getOrderTotal } from '../../data/foodMenu';

export default function GeneralDashboard({ user, checkinData }) {
  const total = getOrderTotal(checkinData.foodOrder || []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Welcome card */}
      <Card sx={{ background: 'linear-gradient(135deg, #37474F 0%, #546E7A 100%)', color: '#fff' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                Welcome, {user.holderName.split(' ')[0]}! 🏏
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                {user.match} · {user.matchDate}
              </Typography>
            </Box>
            <TierBadge tierNumber={user.tierNumber} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Your Seat</Typography>
              <Typography variant="body1" fontWeight={700}>{user.seat}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Section</Typography>
              <Typography variant="body1" fontWeight={700}>{user.section}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Entry</Typography>
              <Typography variant="body1" fontWeight={700}>{user.gate}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Gate directions */}
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MeetingRoomIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={700}>Your Entry Point</Typography>
          </Box>
          <Box sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            borderRadius: 3,
            p: 2.5,
            textAlign: 'center',
            mb: 2,
          }}>
            <Typography variant="h2" fontWeight={900} lineHeight={1}>
              {user.gate?.split(' ')[1]}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>{user.gate}</Typography>
          </Box>
          <Alert severity="info" sx={{ fontSize: '0.78rem' }}>
            Gates open at <strong>5:30 PM</strong>. Match starts at <strong>7:30 PM</strong>. Arrive early to avoid queues.
          </Alert>
        </CardContent>
      </Card>

      {/* Walking directions */}
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DirectionsWalkIcon sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={700}>Walk to Your Seat</Typography>
          </Box>
          <List dense disablePadding>
            {user.walkingDirections?.map((step, i) => (
              <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start', pb: 1 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
                  <Box sx={{
                    width: 22, height: 22, borderRadius: '50%',
                    bgcolor: 'primary.main', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>
                    {i + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={step}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Row</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">{user.seatRow || '—'}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Seat</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">{user.seatNumber || '—'}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Section</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">{user.section?.split(' ')[1] || '—'}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Locker */}
      {checkinData.selectedLocker && (
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LockIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Locker {checkinData.selectedLocker}</Typography>
                <Typography variant="caption" color="text.secondary">
                  PIN: <strong>4{checkinData.selectedLocker}7{checkinData.selectedLocker}</strong> · {user.nearestLocker || 'Near your gate'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Food order */}
      {total > 0 && (
        <Card variant="outlined">
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShoppingBagIcon sx={{ color: 'secondary.dark' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>Food Order · ₹{total}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.nearestFoodStall || 'Nearest food stall'} — show this screen
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={700} color="secondary.dark">{checkinData.foodOrder?.length} item{checkinData.foodOrder?.length !== 1 ? 's' : ''}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
