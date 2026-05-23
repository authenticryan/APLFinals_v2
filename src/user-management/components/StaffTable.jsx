import { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ROLE_CONFIG } from '../../security/data/securityStaff';

const CLEARANCE_COLOR = { 'TOP SECRET': '#FF1744', 'CLASSIFIED': '#FF9100', 'CONFIDENTIAL': '#FFB300', 'RESTRICTED': '#90A4AE' };

export default function StaffTable({ staff, onEdit, onDelete }) {
  if (!staff.length) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No staff records found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', color: '#90A4AE', borderBottom: '1px solid rgba(255,255,255,0.08)' } }}>
            <TableCell>Officer</TableCell>
            <TableCell>Badge / ID</TableCell>
            <TableCell>Role Tier</TableCell>
            <TableCell>Clearance</TableCell>
            <TableCell>Gate / Post</TableCell>
            <TableCell>Shift</TableCell>
            <TableCell>Department</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((s) => {
            const roleCfg = ROLE_CONFIG[s.tier] || ROLE_CONFIG.GENERAL;
            const initials = s.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
            return (
              <TableRow key={s.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Avatar sx={{ bgcolor: roleCfg.color, width: 32, height: 32, fontSize: '0.7rem', fontWeight: 700, color: '#000' }}>
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#546E7A', fontSize: '0.65rem' }}>{s.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#82B1FF' }}>{s.badgeId}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={roleCfg.label} size="small" sx={{ bgcolor: roleCfg.bg, color: roleCfg.color, fontWeight: 700, fontSize: '0.62rem', height: 20 }} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: CLEARANCE_COLOR[s.clearance] || '#90A4AE', fontWeight: 600, fontSize: '0.7rem' }}>
                    {s.clearance}
                  </Typography>
                </TableCell>
                <TableCell><Typography variant="caption">{s.gate}</Typography></TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{s.shift}</Typography></TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{s.dept}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(s)} sx={{ color: '#2979FF' }}>
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={() => onDelete(s.id)} sx={{ color: '#FF1744' }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
