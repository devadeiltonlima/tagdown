import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';
import { saveLoginRecord } from '../../services/firebaseService';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromRegistration) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        setIsRedirecting(false);
      }, 3000); // Mostra "Redirecionando..." por 3 segundos

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const toggleForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await saveLoginRecord({
          userId: userCredential.user.uid,
          email: userCredential.user.email || email,
          platform: navigator.platform,
          success: true
        });
        navigate('/'); // Redireciona para a Home
      } else {
        // Cadastro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Atualiza o perfil com o nome
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: name });
        }
        await saveLoginRecord({
          userId: userCredential.user.uid,
          email: userCredential.user.email || email,
          platform: navigator.platform,
          success: true
        });
        // Redireciona para o login com um estado
        navigate('/login', { state: { fromRegistration: true } });
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso. Tente fazer login ou use um e-mail diferente.');
      } else {
        setError(`Erro na ${isLogin ? 'autenticação' : 'criação de conta'}. Tente novamente.`);
      }
      console.error(`Erro na ${isLogin ? 'autenticação' : 'criação de conta'}:`, error);
      await saveLoginRecord({
        userId: 'failed-attempt',
        email,
        platform: navigator.platform,
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainerWrapper}>
        <div className={`${styles.cardContainer} ${!isLogin ? styles.showRegister : ''}`}>
          <div className={styles.card}>
            <h2>Login</h2>
            <form onSubmit={handleAuth}>
              {error && isLogin && <p className={styles.error}>{error}</p>}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={isLoading || isRedirecting}>
                {isRedirecting ? 'Redirecionando...' : (isLoading ? 'Entrando...' : 'Entrar')}
              </button>
            </form>
            <p>Não tem uma conta? <a href="#" onClick={toggleForm}>Cadastre-se</a></p>
          </div>
          <div className={`${styles.card} ${styles.registerCard}`}>
            <h2>Cadastro</h2>
            <form onSubmit={handleAuth}>
              {!isLogin && error && <p className={styles.error}>{error}</p>}
              <input
                type="text" 
                placeholder="Nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
              />
              <input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isLogin}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
            <p>Já tem uma conta? <a href="#" onClick={toggleForm}>Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
