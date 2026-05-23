import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import CheckinStepper from '../components/checkin/CheckinStepper';
import { useAppContext } from '../context/AppContext';

export default function CheckinPage() {
  const { currentUser, checkinData } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) { navigate('/', { replace: true }); return; }
    if (checkinData.checkedIn) { navigate('/dashboard', { replace: true }); }
  }, [currentUser, checkinData.checkedIn]);

  if (!currentUser) return null;

  return (
    <AppLayout>
      <CheckinStepper />
    </AppLayout>
  );
}
