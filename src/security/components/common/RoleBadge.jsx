import Chip from '@mui/material/Chip';
import { getRoleConfig } from '../../data/securityStaff';

export default function RoleBadge({ tier, size = 'medium', sx = {} }) {
  const cfg = getRoleConfig(tier);
  return (
    <Chip
      label={`${cfg.icon}  ${tier}`}
      size={size}
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.68rem' : '0.78rem',
        ...sx,
      }}
    />
  );
}
