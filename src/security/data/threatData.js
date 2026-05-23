export const THREAT_TYPES = {
  drone:          { label: 'Drone',          icon: '🚁', color: '#FF1744' },
  signal_jammer:  { label: 'Signal Jammer',  icon: '📡', color: '#FF6D00' },
  cyber:          { label: 'Cyber Threat',   icon: '💻', color: '#AA00FF' },
  perimeter:      { label: 'Perimeter Breach', icon: '🚨', color: '#FF1744' },
};

export const SEVERITY_CONFIG = {
  HIGH:   { color: '#FF1744', bg: 'rgba(255,23,68,0.15)',   label: 'HIGH' },
  MEDIUM: { color: '#FFB300', bg: 'rgba(255,179,0,0.15)',   label: 'MEDIUM' },
  LOW:    { color: '#00E676', bg: 'rgba(0,230,118,0.15)',   label: 'LOW' },
};

export const INITIAL_THREATS = [
  { id: 'THR001', type: 'drone', severity: 'HIGH', location: 'Northern Airspace (Gate E area)', status: 'active', description: 'Unregistered DJI Mavic-class drone detected at 45m altitude. Operator unidentified. RF fingerprint captured — does not match any authorised media drone.', detectedAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'THR002', type: 'signal_jammer', severity: 'MEDIUM', location: 'Gate F south perimeter, row 6', status: 'monitoring', description: 'Anomalous 2.4GHz burst signal detected at 200ms intervals. Pattern consistent with consumer-grade jammer. Gate F team dispatched for physical sweep.', detectedAt: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: 'THR003', type: 'drone', severity: 'LOW', location: 'South Stand airspace', status: 'resolved', description: 'Drone identified and cleared — authorised BCCI OB media unit. DSNG accreditation #M-2247 verified by Gate D commander.', detectedAt: new Date(Date.now() - 45 * 60000).toISOString(), resolvedAt: new Date(Date.now() - 38 * 60000).toISOString() },
  { id: 'THR004', type: 'cyber', severity: 'MEDIUM', location: 'Public WiFi Subnet 192.168.10.x', status: 'monitoring', description: 'Unusual TCP SYN sweep detected across 254 hosts. Likely port scanner from device ending MAC :3F:A2. IT security team alerted. Stadium OT network isolated.', detectedAt: new Date(Date.now() - 15 * 60000).toISOString() },
];

export const RF_BANDS = [
  { band: '2.4 GHz (WiFi/Bluetooth)', health: 62,  status: 'degraded',  note: 'Interference detected near Gate F' },
  { band: '5 GHz (WiFi)',             health: 94,  status: 'healthy',   note: 'Clear' },
  { band: '4G LTE (900 MHz)',         health: 88,  status: 'healthy',   note: 'Normal traffic' },
  { band: 'GPS L1 (1575 MHz)',        health: 97,  status: 'healthy',   note: 'Strong signal' },
  { band: 'TETRA (380 MHz)',          health: 100, status: 'healthy',   note: 'Police comms nominal' },
  { band: 'UHF Radio (450 MHz)',      health: 91,  status: 'healthy',   note: 'Security channel clear' },
];

export const DRONE_SCANNERS = [
  { id: 'DS-N', name: 'North Array', location: 'Gate E rooftop', status: 'active',  detectCount: 1 },
  { id: 'DS-E', name: 'East Array',  location: 'Gate F rooftop', status: 'active',  detectCount: 0 },
  { id: 'DS-S', name: 'South Array', location: 'Gate G rooftop', status: 'active',  detectCount: 0 },
  { id: 'DS-W', name: 'West Array',  location: 'Gate H rooftop', status: 'offline', detectCount: 0 },
];
