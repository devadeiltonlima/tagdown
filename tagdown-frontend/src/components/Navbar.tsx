import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Menu, X, User as UserIcon } from 'lucide-react';
import styles from './Navbar.module.css';
import type { User } from 'firebase/auth';
import { ProfileDropdown } from './ProfileDropdown';

interface RequestStatus {
  limit: number;
  remaining: number;
  used: number;
}

interface NavbarProps {
  onExperimentClick: () => void;
  user: User | null;
  avatar: string | null;
  setAvatar: Dispatch<SetStateAction<string | null>>;
  requestStatus: RequestStatus | null;
}

export function Navbar({ onExperimentClick, user, avatar, setAvatar, requestStatus }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const handleLinkClick = () => setIsMenuOpen(false);

  const handleExperimentClick = () => {
    onExperimentClick();
    handleLinkClick();
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <a href="/" className={styles.logo}>TagDown</a>
          
          <div className={styles.desktopMenu}>
            <a href="#home">Home</a>
            <a href="#features">Recursos</a>
            <a href="#about">Sobre</a>
          </div>

          <div className={styles.desktopButtons}>
            {user ? (
              <div className={styles.profileContainer}>
                <button onClick={toggleProfile} className={styles.profileButton}>
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className={styles.avatarImage} />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </button>
                {isProfileOpen && <ProfileDropdown user={user} avatar={avatar} setAvatar={setAvatar} requestStatus={requestStatus} />}
              </div>
            ) : (
              <Link to="/login" className={styles.loginButton}>Login</Link>
            )}
            <button onClick={onExperimentClick} className={styles.experimentButton}>
              Experimente
            </button>
            <button className={styles.darkModeButton}>
              <Moon size={24} />
            </button>
          </div>

          <button className={styles.mobileMenuButton} onClick={toggleMenu}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <button className={styles.closeMenuButton} onClick={toggleMenu}>
          <X size={28} />
        </button>
        <div className={styles.mobileMenuLinks}>
            <a href="#home" onClick={handleLinkClick}>Home</a>
            <a href="#features" onClick={handleLinkClick}>Recursos</a>
            <a href="#about" onClick={handleLinkClick}>Sobre</a>
            {user ? (
               <Link to="/profile" className={styles.loginButton} onClick={handleLinkClick}>Conta</Link>
            ) : (
               <Link to="/login" className={styles.loginButton} onClick={handleLinkClick}>Login</Link>
            )}
            <button onClick={handleExperimentClick} className={styles.experimentButton}>
              Experimente
            </button>
        </div>
        <div className={styles.mobileMenuFooter}>
          <button className={styles.darkModeButton}>
            <Moon size={24} />
          </button>
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </>
  );
}
