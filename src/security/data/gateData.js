export const GATES = [
  { id: 'A', name: 'Gate A', type: 'VVIP Entrance', tier: 'VVIP', capacity: 50,  color: '#FFD700', assignedTier: 'VVIP', location: 'South-West' },
  { id: 'B', name: 'Gate B', type: 'VIP Entrance',  tier: 'VIP',  capacity: 100, color: '#2979FF', assignedTier: 'VIP',  location: 'North' },
  { id: 'C', name: 'Gate C', type: 'Players & Officials', tier: 'PLAYER', capacity: 80,  color: '#00E676', assignedTier: 'PLAYER', location: 'East' },
  { id: 'D', name: 'Gate D', type: 'Press & Sponsors', tier: 'PRESS', capacity: 150, color: '#FF9100', assignedTier: 'PRESS',  location: 'South-East' },
  { id: 'E', name: 'Gate E', type: 'General Public (North)', tier: 'GENERAL', capacity: 500, color: '#90A4AE', assignedTier: 'GENERAL', location: 'North' },
  { id: 'F', name: 'Gate F', type: 'General Public (East)',  tier: 'GENERAL', capacity: 500, color: '#90A4AE', assignedTier: 'GENERAL', location: 'East' },
  { id: 'G', name: 'Gate G', type: 'General Public (South)', tier: 'GENERAL', capacity: 500, color: '#90A4AE', assignedTier: 'GENERAL', location: 'South' },
  { id: 'H', name: 'Gate H', type: 'General Public (West)',  tier: 'GENERAL', capacity: 500, color: '#90A4AE', assignedTier: 'GENERAL', location: 'West' },
];

export const getGateStatus = (current, capacity) => {
  const pct = current / capacity;
  if (pct >= 0.90) return { label: 'OVERFLOW',   color: '#FF1744', severity: 3 };
  if (pct >= 0.70) return { label: 'BUSY',        color: '#FFB300', severity: 2 };
  return                  { label: 'NORMAL',       color: '#00E676', severity: 1 };
};

// Simulate live fluctuation for demo (±15% random change per tick)
export const simulateGateUpdate = (gate) => {
  const delta = Math.floor((Math.random() - 0.4) * gate.capacity * 0.12);
  const current = Math.max(0, Math.min(gate.capacity, gate.current + delta));
  return { ...gate, current, flowRate: Math.floor(current * 0.08 + Math.random() * 5), lastUpdated: new Date().toISOString() };
};
