import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, Timestamp, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCyYkBkyHD_yF0Oo4rMCqy1KGAFdYgOMH0",
  authDomain: "liikmaprojectflow.firebaseapp.com",
  projectId: "liikmaprojectflow",
  storageBucket: "liikmaprojectflow.firebasestorage.app",
  messagingSenderId: "367027021739",
  appId: "1:367027021739:web:570d93ac423e7dd8a154ee"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

interface LoginRecord {
  userId: string;
  email: string;
  timestamp: Date;
  platform: string;
  success: boolean;
}

export const saveLoginRecord = async (loginData: Omit<LoginRecord, 'timestamp'>) => {
  try {
    const loginCollection = collection(db, 'login');
    const docRef = await addDoc(loginCollection, {
      ...loginData,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar registro de login:', error);
    throw error;
  }
};

/**
 * Salva a imagem de avatar de um usuário, em formato Base64, no Firestore.
 * @param userId - O ID do usuário.
 * @param base64Image - A string da imagem em Base64.
 */
export const saveUserAvatar = async (userId: string, base64Image: string) => {
  try {
    const avatarDocRef = doc(db, 'user_avatars', userId);
    await setDoc(avatarDocRef, {
      imageData: base64Image,
      updatedAt: Timestamp.now()
    });
    console.log('Avatar salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar avatar:', error);
    throw error;
  }
};

/**
 * Busca a imagem de avatar de um usuário no Firestore.
 * @param userId - O ID do usuário.
 * @returns A string da imagem em Base64 ou null se não for encontrada.
 */
export const getUserAvatar = async (userId: string): Promise<string | null> => {
  try {
    const avatarDocRef = doc(db, 'user_avatars', userId);
    const docSnap = await getDoc(avatarDocRef);

    if (docSnap.exists()) {
      return docSnap.data().imageData;
    } else {
      console.log('Nenhum avatar encontrado para o usuário.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar avatar:', error);
    throw error;
  }
};

export interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Timestamp;
}

/**
 * Salva ou atualiza o histórico de conversas de um usuário no Firestore.
 * @param userId - O ID do usuário.
 * @param messages - A lista de mensagens a ser salva.
 */
export const saveConversation = async (userId: string, messages: Omit<Message, 'timestamp'>[]) => {
  try {
    const conversationDocRef = doc(db, 'conversations', userId);
    const messagesWithTimestamp = messages.map(msg => ({ ...msg, timestamp: Timestamp.now() }));
    
    // Usar setDoc com merge: true para criar o documento se não existir ou mesclar se existir.
    await setDoc(conversationDocRef, { messages: messagesWithTimestamp }, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar conversa:', error);
    throw error;
  }
};

/**
 * Busca o histórico de conversas de um usuário no Firestore.
 * @param userId - O ID do usuário.
 * @returns A lista de mensagens ou um array vazio se não for encontrada.
 */
export const getConversation = async (userId: string): Promise<Message[]> => {
  try {
    const conversationDocRef = doc(db, 'conversations', userId);
    const docSnap = await getDoc(conversationDocRef);

    if (docSnap.exists()) {
      // Ordenar as mensagens por timestamp para garantir a ordem correta
      const data = docSnap.data();
      return data.messages.sort((a: Message, b: Message) => a.timestamp.toMillis() - b.timestamp.toMillis());
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    throw error;
  }
};

/**
 * Exclui o histórico de conversas de um usuário no Firestore.
 * @param userId - O ID do usuário.
 */
export const deleteConversation = async (userId: string) => {
  try {
    const conversationDocRef = doc(db, 'conversations', userId);
    await deleteDoc(conversationDocRef);
  } catch (error) {
    console.error('Erro ao excluir conversa:', error);
    throw error;
  }
};
