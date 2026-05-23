import Chip from '@mui/material/Chip';
import { getTierConfig } from '../../data/tickets';

export default function TierBadge({ tierNumber, size = 'medium', sx = {} }) {
  const tier = getTierConfig(tierNumber);
  return (
    <Chip
      label={`${tier.icon}  ${tier.short}`}
      size={size}
      sx={{
        backgroundColor: tier.color,
        color: '#fff',
        fontWeight: 700,
        letterSpacing: '0.5px',
        fontSize: size === 'small' ? '0.72rem' : '0.85rem',
        px: size === 'small' ? 0.5 : 1,
        ...sx,
      }}
    />
  );
}
