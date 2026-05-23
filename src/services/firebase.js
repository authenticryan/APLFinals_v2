import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc,
  collection, getDocs, addDoc, serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId &&
  !firebaseConfig.apiKey.startsWith('YOUR_')
);

let db = null;
if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn('[Firebase] Init failed, falling back to localStorage:', e.message);
  }
}

// ─── Locker helpers ────────────────────────────────────────────────────────────

const TOTAL_LOCKERS = 20;
const DEMO_TAKEN = [3, 7, 11, 15, 18];

const buildDefaultLockers = () => {
  const lockers = {};
  for (let i = 1; i <= TOTAL_LOCKERS; i++) {
    lockers[i] = { id: i, isAvailable: !DEMO_TAKEN.includes(i), assignedTo: DEMO_TAKEN.includes(i) ? 'DEMO' : null };
  }
  return lockers;
};

const lsGetLockers = () => {
  const raw = localStorage.getItem('ipl_lockers');
  return raw ? JSON.parse(raw) : buildDefaultLockers();
};

const lsSaveLockers = (lockers) => localStorage.setItem('ipl_lockers', JSON.stringify(lockers));

export const getLockers = async () => {
  if (!db) return lsGetLockers();
  try {
    const snap = await getDocs(collection(db, 'lockers'));
    if (snap.empty) {
      const defaults = buildDefaultLockers();
      await Promise.all(
        Object.values(defaults).map((l) =>
          setDoc(doc(db, 'lockers', String(l.id)), { isAvailable: l.isAvailable, assignedTo: l.assignedTo })
        )
      );
      return defaults;
    }
    const lockers = {};
    snap.forEach((d) => { lockers[d.id] = { id: Number(d.id), ...d.data() }; });
    return lockers;
  } catch (e) {
    console.warn('[Firebase] getLockers failed:', e.message);
    return lsGetLockers();
  }
};

export const assignLocker = async (lockerNumber, ticketNumber) => {
  if (!db) {
    const lockers = lsGetLockers();
    lockers[lockerNumber] = { id: lockerNumber, isAvailable: false, assignedTo: ticketNumber };
    lsSaveLockers(lockers);
    return true;
  }
  try {
    await updateDoc(doc(db, 'lockers', String(lockerNumber)), {
      isAvailable: false,
      assignedTo: ticketNumber,
    });
    return true;
  } catch (e) {
    console.warn('[Firebase] assignLocker failed:', e.message);
    const lockers = lsGetLockers();
    lockers[lockerNumber] = { id: lockerNumber, isAvailable: false, assignedTo: ticketNumber };
    lsSaveLockers(lockers);
    return true;
  }
};

// ─── Check-in helpers ─────────────────────────────────────────────────────────

export const saveCheckin = async (ticketNumber, checkinData) => {
  const payload = { ...checkinData, savedAt: new Date().toISOString() };
  if (!db) {
    localStorage.setItem(`ipl_checkin_${ticketNumber}`, JSON.stringify(payload));
    return;
  }
  try {
    await setDoc(doc(db, 'checkins', ticketNumber), payload);
  } catch (e) {
    console.warn('[Firebase] saveCheckin failed:', e.message);
    localStorage.setItem(`ipl_checkin_${ticketNumber}`, JSON.stringify(payload));
  }
};

// ─── Escort request ───────────────────────────────────────────────────────────

export const requestEscort = async (ticketData) => {
  const payload = {
    ticketNumber: ticketData.ticketNumber,
    holderName: ticketData.holderName,
    tier: ticketData.tierNumber,
    gate: ticketData.gate,
    requestTime: new Date().toISOString(),
    status: 'pending',
  };
  if (!db) {
    const requests = JSON.parse(localStorage.getItem('ipl_escort_requests') || '[]');
    requests.push(payload);
    localStorage.setItem('ipl_escort_requests', JSON.stringify(requests));
    return;
  }
  try {
    await addDoc(collection(db, 'escortRequests'), { ...payload, createdAt: serverTimestamp() });
  } catch (e) {
    console.warn('[Firebase] requestEscort failed:', e.message);
  }
};

export { isConfigured as isFirebaseConfigured };
