import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { ROLE_CONFIG } from '../../security/data/securityStaff';

const TIERS = Object.keys(ROLE_CONFIG);
const CLEARANCES = ['TOP SECRET', 'CLASSIFIED', 'CONFIDENTIAL', 'RESTRICTED'];
const GATES = ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate F', 'Gate G', 'Gate H', 'Command Centre', 'Multiple'];

const PERMISSIONS_BY_TIER = {
  VVIP:    ['convoy_manage', 'gate_clear', 'escort_approve', 'threat_respond', 'all_access'],
  VIP:     ['escort_manage', 'queue_manage', 'gate_view', 'threat_respond'],
  PLAYER:  ['player_queue', 'pmoa_verify', 'gate_view'],
  PRESS:   ['press_queue', 'accreditation_verify', 'gate_view'],
  GENERAL: ['general_queue', 'gate_manage', 'incident_report'],
  ADMIN:   ['all_access', 'user_manage', 'convoy_manage', 'gate_manage', 'threat_manage'],
};

const EMPTY = {
  name: '', phone: '', badgeId: '', tier: 'GENERAL', role: '',
  clearance: 'RESTRICTED', gate: 'Gate E', shift: '', dept: '', permissions: [],
};

export default function StaffForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm({ ...initial });
    else setForm({ ...EMPTY });
  }, [initial]);

  const set = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const handleTierChange = (tier) => {
    setForm((p) => ({ ...p, tier, permissions: PERMISSIONS_BY_TIER[tier] || [] }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.phone.trim()) e.phone = 'Phone required';
    if (!form.badgeId.trim()) e.badgeId = 'Badge ID required';
    if (!form.role.trim()) e.role = 'Role title required';
    if (!form.shift.trim()) e.shift = 'Shift required';
    if (!form.dept.trim()) e.dept = 'Department required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, id: form.id || `OFF${Date.now().toString(36).toUpperCase()}` });
  };

  const roleCfg = ROLE_CONFIG[form.tier];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2.5}>
        {initial ? 'Edit Staff Record' : 'Add New Officer'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Full Name" fullWidth size="small" value={form.name} onChange={(e) => set('name', e.target.value)} error={Boolean(errors.name)} helperText={errors.name} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Phone Number" fullWidth size="small" value={form.phone} onChange={(e) => set('phone', e.target.value)} error={Boolean(errors.phone)} helperText={errors.phone} placeholder="+91 00000 00000" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Badge ID" fullWidth size="small" value={form.badgeId} onChange={(e) => set('badgeId', e.target.value)} error={Boolean(errors.badgeId)} helperText={errors.badgeId} placeholder="SPG-001" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Role / Title" fullWidth size="small" value={form.role} onChange={(e) => set('role', e.target.value)} error={Boolean(errors.role)} helperText={errors.role} />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Security Tier</InputLabel>
            <Select value={form.tier} label="Security Tier" onChange={(e) => handleTierChange(e.target.value)}>
              {TIERS.map((t) => (
                <MenuItem key={t} value={t}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ROLE_CONFIG[t].color }} />
                    {ROLE_CONFIG[t].label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Clearance Level</InputLabel>
            <Select value={form.clearance} label="Clearance Level" onChange={(e) => set('clearance', e.target.value)}>
              {CLEARANCES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Assigned Gate</InputLabel>
            <Select value={form.gate} label="Assigned Gate" onChange={(e) => set('gate', e.target.value)}>
              {GATES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Shift Hours" fullWidth size="small" value={form.shift} onChange={(e) => set('shift', e.target.value)} error={Boolean(errors.shift)} helperText={errors.shift} placeholder="14:00–22:00" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Department / Agency" fullWidth size="small" value={form.dept} onChange={(e) => set('dept', e.target.value)} error={Boolean(errors.dept)} helperText={errors.dept} />
        </Grid>

        {/* Permissions preview */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Permissions for {roleCfg.label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {(form.permissions || []).map((p) => (
              <Chip key={p} label={p.replace(/_/g, ' ')} size="small" sx={{ bgcolor: `${roleCfg.color}15`, color: roleCfg.color, fontSize: '0.62rem', height: 20 }} />
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} sx={{ color: '#546E7A', borderColor: '#546E7A' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#2979FF', '&:hover': { bgcolor: '#1565C0' } }}>
          {initial ? 'Save Changes' : 'Add Officer'}
        </Button>
      </Box>
    </Box>
  );
}
