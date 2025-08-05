import { useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { User } from 'firebase/auth';
import { Navbar } from '../components/Navbar';
import { Hero, type HeroHandle } from '../components/Hero';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { Footer } from '../components/Footer';

interface RequestStatus {
  limit: number;
  remaining: number;
  used: number;
}

interface HomeProps {
  user: User | null;
  avatar: string | null;
  setAvatar: Dispatch<SetStateAction<string | null>>;
  requestStatus: RequestStatus | null;
  updateRequestStatus: () => void;
}

export function Home({ user, avatar, setAvatar, requestStatus, updateRequestStatus }: HomeProps) {
  const heroRef = useRef<HeroHandle>(null);

  const handleExperimentClick = () => {
    heroRef.current?.focusInput();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Navbar 
        onExperimentClick={handleExperimentClick} 
        user={user} 
        avatar={avatar}
        setAvatar={setAvatar}
        requestStatus={requestStatus}
      />
      <main>
        <Hero ref={heroRef} updateRequestStatus={updateRequestStatus} user={user} />
        <Features onExperimentClick={handleExperimentClick} />
        <HowItWorks onExperimentClick={handleExperimentClick} />
      </main>
      <Footer />
    </>
  );
}
