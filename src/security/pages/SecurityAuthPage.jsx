import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecurityContext } from '../context/SecurityContext';
import SecurityAuth from '../components/auth/SecurityAuth';

export default function SecurityAuthPage() {
  const { officer, loginOfficer } = useSecurityContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (officer) navigate('/security/dashboard', { replace: true });
  }, [officer, navigate]);

  const handleAuth = (staff) => {
    loginOfficer(staff);
    navigate('/security/dashboard', { replace: true });
  };

  return <SecurityAuth onAuthenticated={handleAuth} />;
}
