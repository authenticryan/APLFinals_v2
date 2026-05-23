import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { INITIAL_CONVOYS } from '../data/convoyData';
import { INITIAL_THREATS } from '../data/threatData';
import { GATES } from '../data/gateData';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const isConfigured = Boolean(config.apiKey && !config.apiKey.startsWith('YOUR_') && config.projectId);

let db = null;
if (isConfigured) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    db = getFirestore(app);
  } catch (e) { console.warn('[SecDB] init failed:', e.message); }
}

// ─── localStorage fallback helpers ───────────────────────────────────────────

const lsGet = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const getDefaultGateMetrics = () => {
  const seeded = lsGet('sec_gate_metrics', null);
  if (seeded) return seeded;
  const metrics = {};
  const starts = { A: 12, B: 34, C: 22, D: 67, E: 186, F: 421, G: 312, H: 98 };
  GATES.forEach((g) => {
    metrics[g.id] = { ...g, current: starts[g.id] || 50, flowRate: Math.floor((starts[g.id] || 50) * 0.08), lastUpdated: new Date().toISOString() };
  });
  lsSet('sec_gate_metrics', metrics);
  return metrics;
};

// ─── Gate Metrics ─────────────────────────────────────────────────────────────

export const getGateMetrics = async () => {
  if (!db) return getDefaultGateMetrics();
  try {
    const snap = await getDocs(collection(db, 'gate_metrics'));
    if (snap.empty) return getDefaultGateMetrics();
    const metrics = {};
    snap.forEach((d) => { metrics[d.id] = { id: d.id, ...d.data() }; });
    return metrics;
  } catch (e) { console.warn('[SecDB] getGateMetrics:', e.message); return getDefaultGateMetrics(); }
};

export const updateGateMetric = async (gateId, data) => {
  if (!db) {
    const metrics = getDefaultGateMetrics();
    metrics[gateId] = { ...metrics[gateId], ...data };
    lsSet('sec_gate_metrics', metrics);
    return;
  }
  try { await updateDoc(doc(db, 'gate_metrics', gateId), data); } catch (e) { console.warn(e.message); }
};

// ─── Convoys ──────────────────────────────────────────────────────────────────

export const getConvoys = async () => {
  if (!db) return lsGet('sec_convoys', INITIAL_CONVOYS);
  try {
    const snap = await getDocs(collection(db, 'security_convoys'));
    if (snap.empty) return INITIAL_CONVOYS;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { console.warn('[SecDB] getConvoys:', e.message); return lsGet('sec_convoys', INITIAL_CONVOYS); }
};

export const updateConvoy = async (convoyId, data) => {
  if (!db) {
    const convoys = lsGet('sec_convoys', INITIAL_CONVOYS);
    const updated = convoys.map((c) => c.id === convoyId ? { ...c, ...data } : c);
    lsSet('sec_convoys', updated);
    return;
  }
  try { await updateDoc(doc(db, 'security_convoys', convoyId), data); } catch (e) { console.warn(e.message); }
};

// ─── Queue ────────────────────────────────────────────────────────────────────

const DEFAULT_QUEUE = [
  { ticketNumber: 'IPL-VIP-003', holderName: 'Rahul Mehta', tier: 2, gate: 'Gate B', status: 'waiting', timestamp: new Date().toISOString() },
  { ticketNumber: 'IPL-VIP-004', holderName: 'Sunita Patel', tier: 2, gate: 'Gate B', status: 'processing', timestamp: new Date().toISOString() },
  { ticketNumber: 'IPL-PLY-005', holderName: 'Vikas Kumar', tier: 3, gate: 'Gate C', status: 'waiting', timestamp: new Date().toISOString() },
  { ticketNumber: 'IPL-SPR-007', holderName: 'Neha Sharma', tier: 4, gate: 'Gate D', status: 'admitted', timestamp: new Date().toISOString() },
  { ticketNumber: 'IPL-GEN-009', holderName: 'Amit Joshi', tier: 5, gate: 'Gate E', status: 'waiting', timestamp: new Date().toISOString() },
  { ticketNumber: 'IPL-GEN-010', holderName: 'Kavya Nair', tier: 5, gate: 'Gate F', status: 'flagged', timestamp: new Date().toISOString(), flagReason: 'Bag scan anomaly — secondary check required' },
];

export const getQueue = async (tier) => {
  const all = db
    ? await getDocs(collection(db, 'security_queue')).then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))).catch(() => lsGet('sec_queue', DEFAULT_QUEUE))
    : lsGet('sec_queue', DEFAULT_QUEUE);
  if (!tier || tier === 'ADMIN') return all;
  const tierMap = { VVIP: [1], VIP: [2], PLAYER: [3], PRESS: [4], GENERAL: [5] };
  return all.filter((q) => (tierMap[tier] || [5]).includes(q.tier));
};

export const updateQueueItem = async (ticketNumber, status) => {
  const queue = lsGet('sec_queue', DEFAULT_QUEUE);
  const updated = queue.map((q) => q.ticketNumber === ticketNumber ? { ...q, status } : q);
  lsSet('sec_queue', updated);
  if (db) {
    try { await updateDoc(doc(db, 'security_queue', ticketNumber), { status }); } catch (e) { console.warn(e.message); }
  }
};

// ─── Escort Requests ──────────────────────────────────────────────────────────

const DEFAULT_ESCORTS = [
  { id: 'ER1', ticketNumber: 'IPL-VVIP-001', holderName: 'Aarav Shah', tier: 1, gate: 'Gate A', requestTime: new Date(Date.now() - 5 * 60000).toISOString(), status: 'pending' },
  { id: 'ER2', ticketNumber: 'IPL-VIP-003', holderName: 'Rahul Mehta', tier: 2, gate: 'Gate B', requestTime: new Date(Date.now() - 12 * 60000).toISOString(), status: 'assigned' },
  { id: 'ER3', ticketNumber: 'IPL-VIP-004', holderName: 'Sunita Patel', tier: 2, gate: 'Gate B', requestTime: new Date(Date.now() - 3 * 60000).toISOString(), status: 'pending' },
];

export const getEscortRequests = async (tier) => {
  const all = db
    ? await getDocs(collection(db, 'escortRequests')).then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))).catch(() => lsGet('sec_escorts', DEFAULT_ESCORTS))
    : lsGet('sec_escorts', DEFAULT_ESCORTS);
  if (!tier || tier === 'ADMIN') return all;
  const tierMap = { VVIP: [1], VIP: [1, 2], PLAYER: [3], PRESS: [4], GENERAL: [5] };
  return all.filter((e) => (tierMap[tier] || []).includes(e.tier));
};

export const updateEscortRequest = async (id, status, assignedTo) => {
  const escorts = lsGet('sec_escorts', DEFAULT_ESCORTS);
  const updated = escorts.map((e) => e.id === id ? { ...e, status, assignedTo } : e);
  lsSet('sec_escorts', updated);
  if (db) {
    try { await updateDoc(doc(db, 'escortRequests', id), { status, assignedTo }); } catch (e) { console.warn(e.message); }
  }
};

// ─── Threats ──────────────────────────────────────────────────────────────────

export const getThreats = async () => {
  if (!db) return lsGet('sec_threats', INITIAL_THREATS);
  try {
    const snap = await getDocs(collection(db, 'threat_signals'));
    if (snap.empty) return INITIAL_THREATS;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) { return lsGet('sec_threats', INITIAL_THREATS); }
};

export const updateThreat = async (id, status) => {
  const threats = lsGet('sec_threats', INITIAL_THREATS);
  const updated = threats.map((t) => t.id === id ? { ...t, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : null } : t);
  lsSet('sec_threats', updated);
  if (db) {
    try { await updateDoc(doc(db, 'threat_signals', id), { status }); } catch (e) { console.warn(e.message); }
  }
};

// ─── Notifications ────────────────────────────────────────────────────────────

const DEFAULT_NOTIFS = [
  { id: 'N1', message: 'CONVOY ALPHA ETA 18 minutes — Gate A corridor clearance required NOW', priority: 'CRITICAL', targetTier: 'VVIP', read: false, timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'N2', message: 'HIGH-PRIORITY: Unregistered drone detected in northern airspace', priority: 'HIGH', targetTier: 'ALL', read: false, timestamp: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'N3', message: 'Gate F at 84% capacity — consider diverting arrivals to Gate G', priority: 'HIGH', targetTier: 'GENERAL', read: false, timestamp: new Date(Date.now() - 14 * 60000).toISOString() },
  { id: 'N4', message: 'Escort request received: IPL-VIP-003 (Rahul Mehta) at Gate B', priority: 'MEDIUM', targetTier: 'VIP', read: false, timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'N5', message: 'PMOA batch cleared — 12 team support staff admitted via Gate C', priority: 'LOW', targetTier: 'PLAYER', read: true, timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
];

export const getNotifications = async (tier) => {
  const all = lsGet('sec_notifs', DEFAULT_NOTIFS);
  if (!tier || tier === 'ADMIN') return all;
  return all.filter((n) => n.targetTier === 'ALL' || n.targetTier === tier);
};

export const markNotifRead = (id) => {
  const notifs = lsGet('sec_notifs', DEFAULT_NOTIFS);
  lsSet('sec_notifs', notifs.map((n) => n.id === id ? { ...n, read: true } : n));
};

export { isConfigured as isSecurityFirebaseConfigured };
