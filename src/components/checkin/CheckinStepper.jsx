import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TierStatus from './TierStatus';
import LockerSelection from './LockerSelection';
import FoodPreBooking from './FoodPreBooking';
import StadiumRules from './StadiumRules';
import CheckinComplete from './CheckinComplete';
import { useAppContext } from '../../context/AppContext';

const STEPS = ['Your Tier', 'Lockers', 'Food', 'Rules', 'Done'];

export default function CheckinStepper() {
  const { checkinData, updateCheckin } = useAppContext();
  const step = checkinData.step || 0;

  useEffect(() => {
    const id = setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
    return () => clearTimeout(id);
  }, [step]);

  const next = () => updateCheckin({ step: step + 1 });
  const back = () => updateCheckin({ step: step - 1 });

  return (
    <Box>
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && <TierStatus onNext={next} />}
      {step === 1 && <LockerSelection onNext={next} onBack={back} />}
      {step === 2 && <FoodPreBooking onNext={next} onBack={back} />}
      {step === 3 && <StadiumRules onNext={next} onBack={back} />}
      {step === 4 && <CheckinComplete />}
    </Box>
  );
}
