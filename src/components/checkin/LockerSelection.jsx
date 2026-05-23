import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { getLockers, assignLocker } from '../../services/firebase';
import { useAppContext } from '../../context/AppContext';

export default function LockerSelection({ onNext, onBack }) {
  const { currentUser, checkinData, updateCheckin } = useAppContext();
  const [lockers, setLockers] = useState({});
  const [selected, setSelected] = useState(checkinData.selectedLocker);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLockers().then((data) => { setLockers(data); setLoading(false); });
  }, []);

  const handleConfirm = async () => {
    setSaving(true);
    if (selected) await assignLocker(selected, currentUser.ticketNumber);
    updateCheckin({ selectedLocker: selected, noLocker: !selected });
    setSaving(false);
    onNext();
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>Loading locker availability…</Typography>
      </Box>
    );
  }

  const available = Object.values(lockers).filter((l) => l.isAvailable).length;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5} color="primary.main">
        Locker Selection
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        First come, first served · {available} of {Object.keys(lockers).length} available
      </Typography>

      {available === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>All lockers are currently taken. You can proceed without one.</Alert>
      )}

      {/* Locker grid */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={1.5}>
            {Object.values(lockers).map((locker) => {
              const isSelected = selected === locker.id;
              const isTaken = !locker.isAvailable;
              return (
                <Grid item xs={4} sm={3} key={locker.id}>
                  <Box
                    onClick={() => !isTaken && setSelected(isSelected ? null : locker.id)}
                    sx={{
                      border: 2,
                      borderColor: isSelected ? 'primary.main' : isTaken ? 'divider' : 'grey.300',
                      borderRadius: 2,
                      p: 1.5,
                      textAlign: 'center',
                      cursor: isTaken ? 'not-allowed' : 'pointer',
                      backgroundColor: isSelected
                        ? 'primary.main'
                        : isTaken
                        ? 'grey.100'
                        : 'background.paper',
                      transition: 'all 0.15s ease',
                      '&:hover': !isTaken ? { borderColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,48,135,0.15)' } : {},
                    }}
                  >
                    {isTaken ? (
                      <LockIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    ) : (
                      <LockOpenIcon sx={{ fontSize: 20, color: isSelected ? '#fff' : 'primary.main' }} />
                    )}
                    <Typography
                      variant="caption"
                      display="block"
                      fontWeight={700}
                      sx={{ color: isSelected ? '#fff' : isTaken ? 'text.disabled' : 'text.primary', mt: 0.25 }}
                    >
                      {locker.id}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '0.65rem', color: isSelected ? 'rgba(255,255,255,0.8)' : isTaken ? 'text.disabled' : 'text.secondary' }}
                    >
                      {isTaken ? 'Taken' : 'Free'}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {selected && (
        <Alert severity="info" icon={<LockOpenIcon />} sx={{ mb: 2 }}>
          Locker <strong>{selected}</strong> selected. Your locker PIN will be displayed after check-in.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={onBack} sx={{ flex: 1 }}>Back</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={saving}
          sx={{ flex: 2, py: 1.4 }}
        >
          {saving ? 'Saving…' : selected ? `Confirm Locker ${selected}` : 'Skip — No Locker'}
        </Button>
      </Box>
    </Box>
  );
}
