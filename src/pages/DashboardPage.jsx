import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import GeneralDashboard from '../components/dashboard/GeneralDashboard';
import VIPDashboard from '../components/dashboard/VIPDashboard';
import { useAppContext } from '../context/AppContext';

export default function DashboardPage() {
  const { currentUser, checkinData } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) { navigate('/', { replace: true }); return; }
    if (!checkinData.checkedIn) { navigate('/checkin', { replace: true }); }
  }, [currentUser, checkinData.checkedIn]);

  if (!currentUser || !checkinData.checkedIn) return null;

  const isGeneral = currentUser.tierNumber === 5;

  return (
    <AppLayout>
      {isGeneral
        ? <GeneralDashboard user={currentUser} checkinData={checkinData} />
        : <VIPDashboard user={currentUser} checkinData={checkinData} />
      }
    </AppLayout>
  );
}
