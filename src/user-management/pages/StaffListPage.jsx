import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import StaffTable from '../components/StaffTable';
import StaffForm from '../components/StaffForm';
import { SECURITY_STAFF, ROLE_CONFIG } from '../../security/data/securityStaff';

const lsKey = 'um_staff_list';
const defaultStaff = () => Object.values(SECURITY_STAFF);

const loadStaff = () => {
  try { const v = localStorage.getItem(lsKey); return v ? JSON.parse(v) : defaultStaff(); }
  catch { return defaultStaff(); }
};
const saveStaff = (list) => localStorage.setItem(lsKey, JSON.stringify(list));

export default function StaffListPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(loadStaff);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');

  const filtered = staff.filter((s) => {
    const matchSearch = !search || [s.name, s.badgeId, s.dept, s.gate].some((f) => f?.toLowerCase().includes(search.toLowerCase()));
    const matchTier = tierFilter === 'ALL' || s.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleSave = (record) => {
    setStaff((prev) => {
      const existing = prev.findIndex((s) => s.id === record.id);
      const updated = existing >= 0 ? prev.map((s) => s.id === record.id ? record : s) : [...prev, record];
      saveStaff(updated);
      return updated;
    });
    setEditing(null);
    setAdding(false);
    setToast(editing ? `${record.name} updated` : `${record.name} added to roster`);
  };

  const handleDelete = (id) => {
    setStaff((prev) => { const updated = prev.filter((s) => s.id !== id); saveStaff(updated); return updated; });
    setToast('Officer removed from roster');
  };

  const tierCounts = {};
  staff.forEach((s) => { tierCounts[s.tier] = (tierCounts[s.tier] || 0) + 1; });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#070D1A', color: '#E8EAF6', p: { xs: 2, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/security/dashboard')} sx={{ color: '#546E7A', mr: 1 }}>
            Back to Ops
          </Button>
          <ManageAccountsIcon sx={{ color: '#E040FB', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#E8EAF6' }}>User Management</Typography>
            <Typography variant="caption" sx={{ color: '#546E7A' }}>Security staff roster · Role-based access control</Typography>
          </Box>
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAdding(true)}
            sx={{ ml: 'auto', bgcolor: '#2979FF', '&:hover': { bgcolor: '#1565C0' } }}>
            Add Officer
          </Button>
        </Box>

        {/* Tier summary chips */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          <Chip label={`ALL (${staff.length})`} onClick={() => setTierFilter('ALL')} sx={{ bgcolor: tierFilter === 'ALL' ? 'rgba(41,121,255,0.2)' : 'rgba(255,255,255,0.05)', color: tierFilter === 'ALL' ? '#2979FF' : '#546E7A', fontWeight: tierFilter === 'ALL' ? 700 : 400, cursor: 'pointer' }} />
          {Object.entries(ROLE_CONFIG).map(([tier, cfg]) => (
            <Chip
              key={tier}
              label={`${cfg.label} (${tierCounts[tier] || 0})`}
              onClick={() => setTierFilter(tier)}
              sx={{ bgcolor: tierFilter === tier ? `${cfg.color}25` : 'rgba(255,255,255,0.05)', color: tierFilter === tier ? cfg.color : '#546E7A', border: `1px solid ${tierFilter === tier ? cfg.color + '40' : 'transparent'}`, fontWeight: tierFilter === tier ? 700 : 400, cursor: 'pointer' }}
            />
          ))}
        </Box>

        {/* Role-permission matrix */}
        <Card sx={{ bgcolor: '#0D1829', border: '1px solid rgba(255,255,255,0.07)', mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="overline" sx={{ color: '#546E7A' }} display="block" mb={1.5}>Access Control Matrix</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {Object.entries(ROLE_CONFIG).map(([tier, cfg]) => (
                <Box key={tier} sx={{ minWidth: 160 }}>
                  <Chip label={cfg.label} size="small" sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.65rem', mb: 0.75 }} />
                  {['convoy_manage', 'escort_manage', 'queue_manage', 'gate_manage', 'threat_respond', 'user_manage'].map((perm) => {
                    const hasPerm = ['all_access', perm].some((p) =>
                      Object.values(SECURITY_STAFF).find((s) => s.tier === tier)?.permissions?.includes(p)
                    );
                    return (
                      <Typography key={perm} variant="caption" display="block" sx={{ color: hasPerm ? '#00E676' : '#263238', fontSize: '0.62rem', mb: 0.25 }}>
                        {hasPerm ? '✓' : '✗'} {perm.replace(/_/g, ' ')}
                      </Typography>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, badge, gate, department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#546E7A', fontSize: 18 }} /></InputAdornment> }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#0D1829', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& input': { color: '#E8EAF6' } }}
        />

        {/* Table */}
        <Card sx={{ bgcolor: '#0D1829', border: '1px solid rgba(255,255,255,0.07)' }}>
          <StaffTable staff={filtered} onEdit={(s) => setEditing(s)} onDelete={handleDelete} />
        </Card>

        <Typography variant="caption" sx={{ color: '#546E7A', mt: 1.5, display: 'block' }}>
          Showing {filtered.length} of {staff.length} officers
        </Typography>
      </Box>

      {/* Add / Edit dialog */}
      <Dialog open={Boolean(editing) || adding} onClose={() => { setEditing(null); setAdding(false); }} maxWidth="md" fullWidth
        PaperProps={{ sx: { bgcolor: '#0D1829', color: '#E8EAF6', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogContent sx={{ p: 3 }}>
          <StaffForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setAdding(false); }}
          />
        </DialogContent>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} message={toast} />
    </Box>
  );
}
