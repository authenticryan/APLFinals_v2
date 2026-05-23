/**
 * Firestore seed script — populates all collections needed for the IPL Companion demo.
 * Run:  GOOGLE_APPLICATION_CREDENTIALS=/tmp/ipl-sa-key.json node scripts/seed-firestore.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));
initializeApp({ credential: cert(serviceAccount), projectId: 'calm-virtue-497206-t4' });
const db = getFirestore();

const ts = () => FieldValue.serverTimestamp();
const now = new Date().toISOString();

// ─── Lockers ──────────────────────────────────────────────────────────────────
async function seedLockers() {
  console.log('Seeding lockers…');
  const batch = db.batch();
  const takenLockers = [3, 7, 11, 15, 18];
  for (let i = 1; i <= 20; i++) {
    const ref = db.collection('lockers').doc(String(i));
    batch.set(ref, {
      isAvailable: !takenLockers.includes(i),
      assignedTo: takenLockers.includes(i) ? 'DEMO' : null,
      updatedAt: now,
    });
  }
  await batch.commit();
  console.log('  ✓ 20 lockers seeded');
}

// ─── Gate Metrics ─────────────────────────────────────────────────────────────
async function seedGateMetrics() {
  console.log('Seeding gate metrics…');
  const gates = [
    { id: 'A', name: 'Gate A', type: 'VVIP', capacity: 50, current: 12 },
    { id: 'B', name: 'Gate B', type: 'VIP', capacity: 100, current: 34 },
    { id: 'C', name: 'Gate C', type: 'Players', capacity: 80, current: 22 },
    { id: 'D', name: 'Gate D', type: 'Press/Sponsors', capacity: 150, current: 67 },
    { id: 'E', name: 'Gate E', type: 'General (North)', capacity: 500, current: 186 },
    { id: 'F', name: 'Gate F', type: 'General (East)', capacity: 500, current: 421 },
    { id: 'G', name: 'Gate G', type: 'General (South)', capacity: 500, current: 312 },
    { id: 'H', name: 'Gate H', type: 'General (West)', capacity: 500, current: 98 },
  ];
  const batch = db.batch();
  for (const gate of gates) {
    const status = gate.current / gate.capacity > 0.85 ? 'overflow' : gate.current / gate.capacity > 0.65 ? 'busy' : 'normal';
    batch.set(db.collection('gate_metrics').doc(gate.id), {
      ...gate,
      status,
      flowRate: Math.floor(gate.current * 0.08),
      lastUpdated: now,
    });
  }
  await batch.commit();
  console.log('  ✓ 8 gate metrics seeded');
}

// ─── Security Staff ───────────────────────────────────────────────────────────
async function seedSecurityStaff() {
  console.log('Seeding security staff…');
  const staff = [
    { id: 'SPG001', name: 'Supt. Arvind Menon', badgeId: 'SPG-001', tier: 'VVIP', role: 'SPG Lead', clearance: 'TOP SECRET', gate: 'Gate A', shift: '14:00–22:00', phone: '+91 00001 00001', dept: 'Special Protection Group', isActive: true },
    { id: 'CAPF007', name: 'DSP Rajesh Sharma', badgeId: 'CAPF-007', tier: 'VIP', role: 'VIP Escort Commander', clearance: 'CLASSIFIED', gate: 'Gate B', shift: '14:00–22:00', phone: '+91 00002 00002', dept: 'Central Armed Police Forces', isActive: true },
    { id: 'SLO003', name: 'Insp. Pradeep Nair', badgeId: 'SLO-003', tier: 'PLAYER', role: 'Security Liaison Officer', clearance: 'CONFIDENTIAL', gate: 'Gate C', shift: '12:00–22:00', phone: '+91 00003 00003', dept: 'Franchise Security', isActive: true },
    { id: 'DNA002', name: 'ACP Neeta Joshi', badgeId: 'DNA-002', tier: 'PRESS', role: 'Media Zone Commander', clearance: 'CONFIDENTIAL', gate: 'Gate D', shift: '13:00–22:00', phone: '+91 00004 00004', dept: 'Private Turnkey (DNA Networks)', isActive: true },
    { id: 'SGT012', name: 'SI Dinesh Kumar', badgeId: 'SGT-012', tier: 'GENERAL', role: 'Gate Security Officer', clearance: 'RESTRICTED', gate: 'Gate E', shift: '15:00–23:00', phone: '+91 00005 00005', dept: 'State Police', isActive: true },
    { id: 'ADM001', name: 'Cmdr. Suresh Roy', badgeId: 'ADM-001', tier: 'ADMIN', role: 'Security Operations Commander', clearance: 'TOP SECRET', gate: 'Command Centre', shift: '10:00–24:00', phone: '+91 00006 00006', dept: 'IPL Security Administration', isActive: true },
  ];
  const batch = db.batch();
  for (const s of staff) {
    batch.set(db.collection('security_staff').doc(s.id), { ...s, createdAt: now });
  }
  await batch.commit();
  console.log('  ✓ 6 security staff seeded');
}

// ─── Escort Requests ──────────────────────────────────────────────────────────
async function seedEscortRequests() {
  console.log('Seeding escort requests…');
  const requests = [
    { ticketNumber: 'IPL-VVIP-001', holderName: 'Aarav Shah', tier: 1, gate: 'Gate A', requestTime: now, status: 'pending' },
    { ticketNumber: 'IPL-VIP-003', holderName: 'Rahul Mehta', tier: 2, gate: 'Gate B', requestTime: now, status: 'assigned' },
    { ticketNumber: 'IPL-VIP-004', holderName: 'Sunita Patel', tier: 2, gate: 'Gate B', requestTime: now, status: 'pending' },
  ];
  const batch = db.batch();
  for (const r of requests) {
    batch.set(db.collection('escortRequests').doc(), r);
  }
  await batch.commit();
  console.log('  ✓ 3 escort requests seeded');
}

// ─── Convoys ──────────────────────────────────────────────────────────────────
async function seedConvoys() {
  console.log('Seeding convoy data…');
  const convoys = [
    {
      id: 'CONVOY-ALPHA',
      codename: 'ALPHA',
      vvipName: 'Chief Honoured Guest',
      vvipTicket: 'IPL-VVIP-001',
      status: 'en-route',
      vehicleCount: 6,
      etaMinutes: 18,
      currentLocation: 'Nariman Point Flyover',
      gatesCleared: ['Outer Perimeter Security Ring'],
      gatesRequired: ['Outer Perimeter Security Ring', 'Gate A Outer Cordon', 'VVIP Tunnel', 'Presidential Suite Lobby'],
      securityLead: 'SPG-001',
      exposureRisk: 'HIGH',
      members: [
        { name: 'Chief Guest', role: 'VVIP', designation: 'State Head', seat: 'Suite 01', vehicle: 'V-1' },
        { name: 'State Representative A', role: 'VIP Delegate', designation: 'Governor', seat: 'Suite 02', vehicle: 'V-2' },
        { name: 'State Representative B', role: 'VIP Delegate', designation: 'Deputy CM', seat: 'Suite 03', vehicle: 'V-3' },
        { name: 'Personal Secretary', role: 'Staff', designation: 'Joint Secretary', seat: 'VVIP Box 1', vehicle: 'V-1' },
        { name: 'Head of Security Detail', role: 'SPG', designation: 'Supt. Arvind Menon', seat: 'Command Post', vehicle: 'V-1' },
      ],
      notes: 'MANDATORY: Ensure Gate E crowd cleared from western corridor before convoy arrival. Close Gate H 10 mins prior.',
      createdAt: now,
    },
    {
      id: 'CONVOY-BRAVO',
      codename: 'BRAVO',
      vvipName: 'Distinguished Guest 2',
      vvipTicket: 'IPL-VVIP-002',
      status: 'assembling',
      vehicleCount: 4,
      etaMinutes: 42,
      currentLocation: 'Bandra–Worli Sea Link (south)',
      gatesCleared: [],
      gatesRequired: ['Outer Perimeter Security Ring', 'Gate A Outer Cordon', 'VVIP Tunnel'],
      securityLead: 'SPG-001',
      exposureRisk: 'MEDIUM',
      members: [
        { name: 'Distinguished Guest 2', role: 'VVIP', designation: 'International Dignitary', seat: 'Suite 02', vehicle: 'V-1' },
        { name: 'Protocol Officer', role: 'Staff', designation: 'Ministry Protocol', seat: 'Suite Box', vehicle: 'V-2' },
      ],
      notes: 'Coordinate with Gate B CAPF for route clearance. Signal jamming protocol active during movement.',
      createdAt: now,
    },
  ];
  const batch = db.batch();
  for (const c of convoys) {
    batch.set(db.collection('security_convoys').doc(c.id), c);
  }
  await batch.commit();
  console.log('  ✓ 2 convoys seeded');
}

// ─── Threat Signals ───────────────────────────────────────────────────────────
async function seedThreats() {
  console.log('Seeding threat signals…');
  const threats = [
    { id: 'THR001', type: 'drone', severity: 'HIGH', location: 'Northern Airspace (Gate E area)', status: 'active', description: 'Unregistered DJI Mavic-class drone detected at 45m altitude. Operator not identified. RF signature captured.', detectedAt: now, resolvedAt: null },
    { id: 'THR002', type: 'signal_jammer', severity: 'MEDIUM', location: 'Gate F south perimeter', status: 'monitoring', description: 'Anomalous 2.4GHz signal detected. Possible consumer-grade jammer. Investigating.', detectedAt: now, resolvedAt: null },
    { id: 'THR003', type: 'drone', severity: 'LOW', location: 'South Stand airspace', status: 'resolved', description: 'Authorised media drone — verified BCCI accreditation. Cleared.', detectedAt: now, resolvedAt: now },
    { id: 'THR004', type: 'cyber', severity: 'MEDIUM', location: 'Stadium WiFi Network', status: 'monitoring', description: 'Unusual traffic spike on public WiFi — possible port scanning activity. IT team alerted.', detectedAt: now, resolvedAt: null },
  ];
  const batch = db.batch();
  for (const t of threats) {
    batch.set(db.collection('threat_signals').doc(t.id), t);
  }
  await batch.commit();
  console.log('  ✓ 4 threat signals seeded');
}

// ─── Attendee Queue ───────────────────────────────────────────────────────────
async function seedQueue() {
  console.log('Seeding attendee queue…');
  const queue = [
    { ticketNumber: 'IPL-VIP-003', holderName: 'Rahul Mehta', tier: 2, gate: 'Gate B', status: 'waiting', timestamp: now },
    { ticketNumber: 'IPL-VIP-004', holderName: 'Sunita Patel', tier: 2, gate: 'Gate B', status: 'processing', timestamp: now },
    { ticketNumber: 'IPL-PLY-005', holderName: 'Vikas Kumar', tier: 3, gate: 'Gate C', status: 'waiting', timestamp: now },
    { ticketNumber: 'IPL-SPR-007', holderName: 'Neha Sharma', tier: 4, gate: 'Gate D', status: 'admitted', timestamp: now },
    { ticketNumber: 'IPL-GEN-009', holderName: 'Amit Joshi', tier: 5, gate: 'Gate E', status: 'waiting', timestamp: now },
    { ticketNumber: 'IPL-GEN-010', holderName: 'Kavya Nair', tier: 5, gate: 'Gate F', status: 'flagged', timestamp: now, flagReason: 'Bag scan anomaly — secondary check required' },
    { ticketNumber: 'IPL-GEN-011', holderName: 'Suresh Rao', tier: 5, gate: 'Gate G', status: 'waiting', timestamp: now },
    { ticketNumber: 'IPL-GEN-012', holderName: 'Meena Das', tier: 5, gate: 'Gate H', status: 'admitted', timestamp: now },
  ];
  const batch = db.batch();
  for (const q of queue) {
    batch.set(db.collection('security_queue').doc(q.ticketNumber), q);
  }
  await batch.commit();
  console.log('  ✓ 8 queue entries seeded');
}

// ─── Notifications ────────────────────────────────────────────────────────────
async function seedNotifications() {
  console.log('Seeding notifications…');
  const notifs = [
    { message: 'CONVOY ALPHA ETA 18 minutes — Gate A corridor clearance required', priority: 'CRITICAL', targetTier: 'VVIP', read: false, timestamp: now },
    { message: 'Drone detected in northern airspace — drone countermeasures team alerted', priority: 'HIGH', targetTier: 'ALL', read: false, timestamp: now },
    { message: 'Gate F at 84% capacity — consider diverting to Gate G', priority: 'HIGH', targetTier: 'GENERAL', read: false, timestamp: now },
    { message: 'Escort request received from IPL-VIP-003 (Rahul Mehta) at Gate B', priority: 'MEDIUM', targetTier: 'VIP', read: false, timestamp: now },
    { message: 'PMOA batch cleared — 12 team support staff admitted via Gate C', priority: 'LOW', targetTier: 'PLAYER', read: true, timestamp: now },
    { message: 'Signal anomaly detected at Gate F south perimeter — monitoring', priority: 'MEDIUM', targetTier: 'ALL', read: false, timestamp: now },
  ];
  const batch = db.batch();
  for (const n of notifs) {
    batch.set(db.collection('security_notifications').doc(), n);
  }
  await batch.commit();
  console.log('  ✓ 6 notifications seeded');
}

// ─── Run all seeds ────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding Firestore for IPL Companion…\n');
  await seedLockers();
  await seedGateMetrics();
  await seedSecurityStaff();
  await seedEscortRequests();
  await seedConvoys();
  await seedThreats();
  await seedQueue();
  await seedNotifications();
  console.log('\n✅ All collections seeded successfully!');
}

main().catch((e) => { console.error('Seed failed:', e); process.exit(1); });
