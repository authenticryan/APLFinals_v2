import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import MenuIcon from '@mui/icons-material/Menu';
import RoleBadge from './RoleBadge';
import { useSecurityContext } from '../../context/SecurityContext';
import { getRoleConfig } from '../../data/securityStaff';

const DRAWER_WIDTH = 248;

const getNavItems = (tier) => {
  const base = [
    { key: 'dashboard',      label: 'Dashboard',     icon: DashboardIcon,        path: '/security/dashboard' },
    { key: 'notifications',  label: 'Notifications', icon: NotificationsIcon,    path: '/security/notifications', badge: 4 },
    { key: 'gate',           label: 'Gate Mgmt',     icon: MeetingRoomIcon,      path: '/security/gate' },
    { key: 'threats',        label: 'Threats',       icon: WarningAmberIcon,     path: '/security/threats', badge: 2 },
  ];

  const tierSpecific = {
    VVIP:    [{ key: 'convoy',  label: 'Convoy Mgr', icon: DirectionsCarIcon, path: '/security/convoy' }],
    VIP:     [{ key: 'queue',   label: 'VIP Queue',  icon: PeopleIcon,        path: '/security/queue' }, { key: 'escorts', label: 'Escort Reqs', icon: EscalatorWarningIcon, path: '/security/escorts', badge: 3 }],
    PLAYER:  [{ key: 'queue',   label: 'Player Queue', icon: PeopleIcon,      path: '/security/queue' }],
    PRESS:   [{ key: 'queue',   label: 'Press Queue',  icon: PeopleIcon,      path: '/security/queue' }],
    GENERAL: [{ key: 'queue',   label: 'Entry Queue',  icon: PeopleIcon,      path: '/security/queue' }],
    ADMIN:   [
      { key: 'convoy',  label: 'Convoy Mgr',  icon: DirectionsCarIcon,       path: '/security/convoy' },
      { key: 'queue',   label: 'All Queues',  icon: PeopleIcon,              path: '/security/queue' },
      { key: 'escorts', label: 'Escorts',     icon: EscalatorWarningIcon,    path: '/security/escorts', badge: 3 },
    ],
  };

  const specific = tierSpecific[tier] || [];
  return [...base.slice(0, 1), ...specific, ...base.slice(1)];
};

export default function SecurityLayout({ children }) {
  const { officer, logoutOfficer } = useSecurityContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const cfg = officer ? getRoleConfig(officer.tier) : null;
  const navItems = officer ? getNavItems(officer.tier) : getNavItems('GENERAL');

  const currentKey = navItems.find((n) => location.pathname === n.path)?.key || 'dashboard';

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ShieldIcon sx={{ color: '#2979FF', fontSize: 28 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#E8EAF6', lineHeight: 1.1 }}>IPL SECURITY</Typography>
          <Typography variant="caption" sx={{ color: '#546E7A', fontSize: '0.65rem', letterSpacing: 1 }}>OPS CENTRE</Typography>
        </Box>
      </Box>

      {/* Officer card */}
      {officer && (
        <Box sx={{ mx: 1.5, mb: 2, p: 1.5, borderRadius: 2, bgcolor: cfg?.bg, border: `1px solid ${cfg?.color}30` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ bgcolor: cfg?.color, width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700 }}>
              {officer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" fontWeight={700} noWrap sx={{ color: cfg?.color, display: 'block' }}>{officer.name}</Typography>
              <Typography variant="caption" sx={{ color: '#546E7A', fontSize: '0.65rem' }}>{officer.badgeId} · {officer.gate}</Typography>
            </Box>
          </Box>
          <RoleBadge tier={officer.tier} size="small" sx={{ mt: 1 }} />
        </Box>
      )}

      <Divider />

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = currentKey === item.key;
          return (
            <ListItemButton
              key={item.key}
              selected={selected}
              onClick={() => handleNav(item.path)}
              sx={{ borderRadius: 2, mb: 0.25, borderLeft: selected ? `3px solid #2979FF` : '3px solid transparent', pl: selected ? 1.25 : 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: selected ? '#2979FF' : '#546E7A' }}>
                <Badge badgeContent={item.badge} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 14, minWidth: 14 } }}>
                  <Icon fontSize="small" />
                </Badge>
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: selected ? 700 : 500, color: selected ? '#82B1FF' : '#90A4AE', fontSize: '0.85rem' }} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* Bottom actions */}
      <Box sx={{ p: 1.5 }}>
        {(officer?.tier === 'ADMIN') && (
          <ListItemButton onClick={() => navigate('/user-management')} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#E040FB' }}><ManageAccountsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="User Management" primaryTypographyProps={{ variant: 'body2', fontSize: '0.82rem', color: '#E040FB', fontWeight: 600 }} />
          </ListItemButton>
        )}
        <ListItemButton onClick={logoutOfficer} sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 36, color: '#546E7A' }}><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Sign Out" primaryTypographyProps={{ variant: 'body2', fontSize: '0.82rem', color: '#546E7A' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar — desktop */}
      {!isMobile && (
        <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
          {sidebarContent}
        </Drawer>
      )}

      {/* Sidebar — mobile */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
          {sidebarContent}
        </Drawer>
      )}

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile top bar */}
        {isMobile && (
          <AppBar position="sticky" elevation={0}>
            <Toolbar variant="dense">
              <IconButton color="inherit" onClick={() => setMobileOpen(true)} edge="start" sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
              <ShieldIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>IPL Security Ops</Typography>
              {officer && <RoleBadge tier={officer.tier} size="small" />}
            </Toolbar>
          </AppBar>
        )}

        {/* Content */}
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 }, pb: isMobile ? 9 : 3, maxWidth: 1100, mx: 'auto', width: '100%' }}>
          {children}
        </Box>

        {/* Mobile bottom nav */}
        {isMobile && (
          <BottomNavigation
            value={currentKey}
            onChange={(_, val) => { const item = navItems.find((n) => n.key === val); if (item) handleNav(item.path); }}
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: '#060D18', borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 1200 }}
          >
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <BottomNavigationAction
                  key={item.key}
                  value={item.key}
                  icon={<Badge badgeContent={item.badge} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.55rem', height: 12, minWidth: 12 } }}><Icon fontSize="small" /></Badge>}
                  label={item.label}
                  sx={{ color: '#546E7A', '&.Mui-selected': { color: '#2979FF' }, minWidth: 0, fontSize: '0.6rem' }}
                />
              );
            })}
          </BottomNavigation>
        )}
      </Box>
    </Box>
  );
}
