import React, { useState, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import styles from './ProfileDropdown.module.css';
import type { User } from 'firebase/auth';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
import { saveUserAvatar } from '../services/firebaseService';

interface RequestStatus {
  limit: number;
  remaining: number;
  used: number;
}

interface ProfileDropdownProps {
  user: User;
  avatar: string | null;
  setAvatar: Dispatch<SetStateAction<string | null>>;
  requestStatus: RequestStatus | null;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, avatar, setAvatar, requestStatus }) => {
  const auth = getAuth();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error('Erro ao fazer logout:', error));
  };

  const handleSave = async () => {
    if (auth.currentUser && displayName !== user.displayName) {
      try {
        await updateProfile(auth.currentUser, { displayName });
        setIsEditing(false);
        setSuccessMessage('Nome atualizado com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error("Erro ao atualizar o nome:", error);
        alert('Falha ao atualizar o nome.');
      }
    }
  };
  
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const options = {
      maxSizeMB: 0.5, // Comprime para no máximo 0.5MB
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await saveUserAvatar(user.uid, base64String);
        setAvatar(base64String); // Atualiza o estado no App.tsx
        alert('Avatar atualizado com sucesso!');
      };
    } catch (error) {
      console.error('Erro ao comprimir ou salvar a imagem:', error);
      alert('Falha ao atualizar o avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar} onClick={handleAvatarClick}>
          {isUploading ? (
            <div className={styles.loader}></div>
          ) : avatar ? (
            <img src={avatar} alt="User Avatar" />
          ) : (
            <span>{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</span>
          )}
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            style={{ display: 'none' }} 
            accept="image/*"
            disabled={isUploading}
          />
        </div>
        <p className={styles.email}>{user.email}</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            setIsEditing(true);
          }}
          className={styles.input}
        />
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      </div>

      <div className={styles.requestsInfo}>
        <p>Requisições Restantes</p>
        <div className={styles.requestsBar}>
          <div 
            className={styles.requestsBarFill} 
            style={{ width: `${requestStatus ? (requestStatus.remaining / requestStatus.limit) * 100 : 0}%` }}
          ></div>
        </div>
        <span>{requestStatus ? `${requestStatus.remaining} / ${requestStatus.limit}` : '0 / 0'}</span>
      </div>
      
      <div className={styles.actions}>
        {isEditing && (
          <button onClick={handleSave} className={`${styles.button} ${styles.saveButton}`}>
            Salvar
          </button>
        )}
        <button onClick={handleLogout} className={`${styles.button} ${styles.logoutButton}`}>
          Sair
        </button>
      </div>
    </div>
  );
};
