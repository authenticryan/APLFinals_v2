import { useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useSecurityContext } from '../context/SecurityContext';
import SecurityLayout from '../components/common/SecurityLayout';
import VVIPSecDashboard from '../components/dashboard/VVIPSecDashboard';
import VIPSecDashboard from '../components/dashboard/VIPSecDashboard';
import PlayerSecDashboard from '../components/dashboard/PlayerSecDashboard';
import PressSecDashboard from '../components/dashboard/PressSecDashboard';
import GeneralSecDashboard from '../components/dashboard/GeneralSecDashboard';
import AdminSecDashboard from '../components/dashboard/AdminSecDashboard';
import ConvoyManager from '../components/convoy/ConvoyManager';
import AttendeeQueue from '../components/queue/AttendeeQueue';
import EscortRequests from '../components/escorts/EscortRequests';
import GateManagement from '../components/gate/GateManagement';
import ThreatMonitor from '../components/threats/ThreatMonitor';
import NotificationCenter from '../components/notifications/NotificationCenter';

function RoleDashboard() {
  const { officer } = useSecurityContext();
  const tier = officer?.tier;
  if (tier === 'VVIP')   return <VVIPSecDashboard />;
  if (tier === 'VIP')    return <VIPSecDashboard />;
  if (tier === 'PLAYER') return <PlayerSecDashboard />;
  if (tier === 'PRESS')  return <PressSecDashboard />;
  if (tier === 'ADMIN')  return <AdminSecDashboard />;
  return <GeneralSecDashboard />;
}

export default function SecurityDashboardPage() {
  const { officer } = useSecurityContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!officer) navigate('/security', { replace: true });
  }, [officer, navigate]);

  if (!officer) return null;

  return (
    <SecurityLayout>
      <Routes>
        <Route path="dashboard" element={<RoleDashboard />} />
        <Route path="convoy"        element={<ConvoyManager />} />
        <Route path="queue"         element={<AttendeeQueue />} />
        <Route path="escorts"       element={<EscortRequests />} />
        <Route path="gate"          element={<GateManagement />} />
        <Route path="threats"       element={<ThreatMonitor />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="*"             element={<Navigate to="dashboard" replace />} />
      </Routes>
    </SecurityLayout>
  );
}
