import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { saveLoginRecord } from '../../services/firebaseService';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const toggleForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
        // Muda para o formulário de login com os dados preenchidos
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error(`Erro na ${isLogin ? 'autenticação' : 'criação de conta'}:`, error);
      await saveLoginRecord({
        userId: 'failed-attempt',
        email,
        platform: navigator.platform,
        success: false
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainerWrapper}>
        <div className={`${styles.cardContainer} ${!isLogin ? styles.showRegister : ''}`}>
          <div className={styles.card}>
            <h2>Login</h2>
            <form onSubmit={handleAuth}>
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
              <button type="submit">Entrar</button>
            </form>
            <p>Não tem uma conta? <a href="#" onClick={toggleForm}>Cadastre-se</a></p>
          </div>
          <div className={`${styles.card} ${styles.registerCard}`}>
            <h2>Cadastro</h2>
            <form onSubmit={handleAuth}>
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
              <button type="submit">Cadastrar</button>
            </form>
            <p>Já tem uma conta? <a href="#" onClick={toggleForm}>Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
