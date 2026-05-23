import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getNotifications, markNotifRead } from '../../services/securityDb';
import { useSecurityContext } from '../../context/SecurityContext';

const PRIORITY_CFG = {
  CRITICAL: { color: '#FF1744', bg: 'rgba(255,23,68,0.12)', label: 'CRITICAL', pulse: true },
  HIGH:     { color: '#FF9100', bg: 'rgba(255,145,0,0.12)',  label: 'HIGH',     pulse: false },
  MEDIUM:   { color: '#FFB300', bg: 'rgba(255,179,0,0.10)',  label: 'MEDIUM',   pulse: false },
  LOW:      { color: '#546E7A', bg: 'rgba(84,110,122,0.10)', label: 'LOW',      pulse: false },
};

export default function NotificationCenter() {
  const { officer } = useSecurityContext();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getNotifications(officer?.tier).then((data) => {
      const sorted = [...data].sort((a, b) => {
        const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        if ((order[a.priority] ?? 4) !== (order[b.priority] ?? 4)) return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setNotifs(sorted);
      setLoading(false);
    });
  }, [officer?.tier]);

  const markRead = (id) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    markNotifRead(id);
  };

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    notifs.forEach((n) => markNotifRead(n.id));
  };

  const unread = notifs.filter((n) => !n.read).length;
  const filtered = filter === 'ALL' ? notifs : filter === 'UNREAD' ? notifs.filter((n) => !n.read) : notifs.filter((n) => n.priority === filter);

  if (loading) return <Box sx={{ pt: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading notifications…</Typography></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        {unread > 0 ? <NotificationsActiveIcon sx={{ color: '#FF1744', fontSize: 28 }} /> : <NotificationsIcon sx={{ color: '#2979FF', fontSize: 28 }} />}
        <Box>
          <Typography variant="h5" fontWeight={800}>Notifications</Typography>
          <Typography variant="caption" color="text.secondary">Priority-sorted · live dispatch feed</Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
          {unread > 0 && <Chip label={`${unread} unread`} sx={{ bgcolor: 'rgba(255,23,68,0.2)', color: '#FF5252', fontWeight: 700 }} />}
          {unread > 0 && (
            <Button size="small" startIcon={<DoneAllIcon />} onClick={markAllRead} sx={{ color: '#546E7A', fontSize: '0.75rem' }}>
              Mark all read
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
        {['ALL', 'UNREAD', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((f) => (
          <Chip
            key={f}
            label={f}
            size="small"
            onClick={() => setFilter(f)}
            sx={{
              bgcolor: filter === f ? (PRIORITY_CFG[f] ? `${PRIORITY_CFG[f].color}25` : 'rgba(41,121,255,0.2)') : 'rgba(255,255,255,0.05)',
              color: filter === f ? (PRIORITY_CFG[f]?.color || '#2979FF') : '#546E7A',
              border: `1px solid ${filter === f ? (PRIORITY_CFG[f]?.color || '#2979FF') + '50' : 'transparent'}`,
              fontWeight: filter === f ? 700 : 400,
              cursor: 'pointer',
              '&:hover': { opacity: 0.85 },
            }}
          />
        ))}
      </Box>

      {filtered.length === 0 && (
        <Card variant="outlined" sx={{ textAlign: 'center', py: 6 }}>
          <DoneAllIcon sx={{ fontSize: 48, color: '#00E676', mb: 1 }} />
          <Typography color="text.secondary">All clear — no notifications</Typography>
        </Card>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filtered.map((n) => {
          const cfg = PRIORITY_CFG[n.priority] || PRIORITY_CFG.LOW;
          const minsAgo = Math.floor((Date.now() - new Date(n.timestamp).getTime()) / 60000);
          return (
            <Card
              key={n.id}
              sx={{
                border: `1px solid ${n.read ? 'rgba(255,255,255,0.06)' : cfg.color + '40'}`,
                bgcolor: n.read ? 'background.paper' : cfg.bg,
                opacity: n.read ? 0.7 : 1,
                transition: 'all 0.3s',
                ...(cfg.pulse && !n.read ? { boxShadow: `0 0 12px ${cfg.color}30` } : {}),
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', mb: 0.75, flexWrap: 'wrap' }}>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{ bgcolor: `${cfg.color}25`, color: cfg.color, fontWeight: 700, fontSize: '0.6rem', height: 18 }}
                      />
                      <Chip
                        label={n.targetTier}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#90A4AE', fontSize: '0.6rem', height: 18 }}
                      />
                      <Typography variant="caption" sx={{ color: '#546E7A', ml: 'auto' }}>
                        {minsAgo < 1 ? 'just now' : `${minsAgo}m ago`}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={n.read ? 400 : 600} sx={{ lineHeight: 1.5, color: n.read ? 'text.secondary' : 'text.primary' }}>
                      {n.message}
                    </Typography>
                  </Box>
                  {!n.read && (
                    <IconButton size="small" onClick={() => markRead(n.id)} sx={{ color: '#546E7A', flexShrink: 0, mt: -0.25 }}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
