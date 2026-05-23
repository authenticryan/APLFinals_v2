import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const DEFAULT_CHECKIN = {
  step: 0,
  selectedLocker: null,
  noLocker: false,
  foodOrder: [],
  rulesAcknowledged: false,
  checkedIn: false,
  checkinTime: null,
};

const load = (key, fallback) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => load('ipl_user', null));
  const [checkinData, setCheckinData] = useState(() => load('ipl_checkin', DEFAULT_CHECKIN));

  const login = useCallback((ticket) => {
    setCurrentUser(ticket);
    sessionStorage.setItem('ipl_user', JSON.stringify(ticket));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCheckinData(DEFAULT_CHECKIN);
    sessionStorage.removeItem('ipl_user');
    sessionStorage.removeItem('ipl_checkin');
  }, []);

  const updateCheckin = useCallback((patch) => {
    setCheckinData((prev) => {
      const next = { ...prev, ...patch };
      sessionStorage.setItem('ipl_checkin', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, checkinData, login, logout, updateCheckin }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
