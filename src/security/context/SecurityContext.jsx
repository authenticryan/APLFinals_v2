import { createContext, useContext, useState, useCallback } from 'react';

const SecurityContext = createContext(null);

const load = (key, fallback) => {
  try { const raw = sessionStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
};

export function SecurityProvider({ children }) {
  const [officer, setOfficer] = useState(() => load('sec_officer', null));
  const [activeRoute, setActiveRoute] = useState('dashboard');

  const loginOfficer = useCallback((staff) => {
    setOfficer(staff);
    sessionStorage.setItem('sec_officer', JSON.stringify(staff));
  }, []);

  const logoutOfficer = useCallback(() => {
    setOfficer(null);
    sessionStorage.removeItem('sec_officer');
  }, []);

  return (
    <SecurityContext.Provider value={{ officer, activeRoute, setActiveRoute, loginOfficer, logoutOfficer }}>
      {children}
    </SecurityContext.Provider>
  );
}

export const useSecurityContext = () => {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error('useSecurityContext must be inside SecurityProvider');
  return ctx;
};
