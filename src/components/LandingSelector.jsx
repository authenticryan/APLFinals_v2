import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import ShieldIcon from '@mui/icons-material/Shield';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const APPS = [
  {
    id: 'fan',
    icon: <SportsCricketIcon sx={{ fontSize: 36 }} />,
    title: 'Fan Experience',
    description: 'Check in, manage your locker, pre-order food, and track everything about your match day.',
    color: '#1565C0',
    bg: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
  },
  {
    id: 'security',
    icon: <ShieldIcon sx={{ fontSize: 36 }} />,
    title: 'Security Operations',
    description: 'Gate control, threat monitoring, convoy coordination, and real-time crowd management.',
    color: '#B71C1C',
    bg: 'linear-gradient(135deg, #B71C1C 0%, #7F0000 100%)',
  },
  {
    id: 'management',
    icon: <ManageAccountsIcon sx={{ fontSize: 36 }} />,
    title: 'User Management',
    description: 'Manage staff accounts, roles, and access permissions across the entire system.',
    color: '#1B5E20',
    bg: 'linear-gradient(135deg, #1B5E20 0%, #003300 100%)',
  },
];

export default function LandingSelector({ onSelect }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        background: 'linear-gradient(160deg, #0A0E1A 0%, #0D1B2A 60%, #0A1628 100%)',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <SportsCricketIcon sx={{ fontSize: 48, color: '#FFB300', mb: 1.5 }} />
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ color: '#fff', letterSpacing: 0.5, lineHeight: 1.2 }}
        >
          IPL Companion
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.75 }}>
          Select your portal to continue
        </Typography>
      </Box>

      {/* Cards */}
      <Box sx={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {APPS.map((app) => (
          <Card
            key={app.id}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: app.bg,
              boxShadow: `0 4px 24px ${app.color}44`,
            }}
          >
            <CardActionArea onClick={() => onSelect(app.id)} sx={{ p: 0 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2.5,
                  '&:last-child': { pb: 2.5 },
                }}
              >
                <Box sx={{ color: 'rgba(255,255,255,0.9)', flexShrink: 0 }}>{app.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.2 }}>
                    {app.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, display: 'block', mt: 0.4 }}>
                    {app.description}
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
