import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import Alert from '@mui/material/Alert';
import { ALLOWED_ITEMS, PROHIBITED_ITEMS, GENERAL_CONDITIONS } from '../../data/stadiumRules';
import { useAppContext } from '../../context/AppContext';
import BagCheckChatbot from './BagCheckChatbot';

export default function StadiumRules({ onNext, onBack }) {
  const { updateCheckin } = useAppContext();
  const [acknowledged, setAcknowledged] = useState(false);

  const handleConfirm = () => {
    updateCheckin({ rulesAcknowledged: true });
    onNext();
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5} color="primary.main">
        Stadium Conditions of Entry
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        IPL · BCCI Official Rules · Season 2025
      </Typography>

      {/* Allowed */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} color="success.main" mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CheckCircleIcon fontSize="small" /> You MAY bring
          </Typography>
          <List dense disablePadding>
            {ALLOWED_ITEMS.map((item, i) => (
              <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Typography variant="body2">{item.icon}</Typography>
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Prohibited */}
      <Card variant="outlined" sx={{ mb: 2, borderColor: 'error.light' }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} color="error.main" mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CancelIcon fontSize="small" /> Do NOT bring
          </Typography>
          <List dense disablePadding>
            {PROHIBITED_ITEMS.map((item, i) => (
              <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Typography variant="body2">{item.icon}</Typography>
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* General conditions */}
      <Card variant="outlined" sx={{ mb: 3, bgcolor: '#FFFBF0' }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} color="warning.dark" mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <InfoIcon fontSize="small" /> General Conditions
          </Typography>
          {GENERAL_CONDITIONS.map((c, i) => (
            <Typography key={i} variant="body2" color="text.secondary" paragraph sx={{ mb: 0.75 }}>
              • {c}
            </Typography>
          ))}
        </CardContent>
      </Card>

      {/* Bag check chatbot */}
      <Box sx={{ mb: 3 }}>
        <BagCheckChatbot />
      </Box>

      {/* Acknowledgement */}
      <Card sx={{ mb: 3, bgcolor: 'primary.main', color: '#fff' }}>
        <CardContent sx={{ p: 2.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: '#FFB300' } }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: '#fff' }}>
                I have read and understood the stadium conditions of entry. I agree to comply with all BCCI and stadium security regulations.
              </Typography>
            }
          />
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={onBack} sx={{ flex: 1 }}>Back</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={!acknowledged}
          sx={{ flex: 2, py: 1.4 }}
        >
          Agree & Continue →
        </Button>
      </Box>
    </Box>
  );
}
