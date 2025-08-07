import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Home } from './pages/Home';
import Login from './components/Login/Login';
import FloatingAI from './components/FloatingAI';
import { getUserAvatar, auth as firebaseAuth } from './services/firebaseService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface RequestStatus {
  limit: number;
  remaining: number;
  used: number;
}

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<RequestStatus | null>(null);
  const auth = getAuth();
  const location = useLocation();

  const fetchRequestStatus = useCallback(async () => {
    const user = firebaseAuth.currentUser;
    if (!user) {
      setRequestStatus(null);
      return;
    }

    const headers = new Headers();
    headers.append('x-user-id', user.uid);

    try {
      const response = await fetch(`${BASE_URL}/request-status`, { headers });
      if (response.ok) {
        const data = await response.json();
        setRequestStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch request status:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedAvatar = await getUserAvatar(currentUser.uid);
        setAvatar(storedAvatar);
        fetchRequestStatus(); // Busca o status ao logar
      } else {
        setAvatar(null);
        setRequestStatus(null); // Limpa o status ao deslogar
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, fetchRequestStatus]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              user={user} 
              avatar={avatar} 
              setAvatar={setAvatar}
              requestStatus={requestStatus}
              updateRequestStatus={fetchRequestStatus}
            />
          } 
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      {location.pathname !== '/login' && <FloatingAI user={user} requestStatus={requestStatus} />}
    </>
  );
}

export default App;
