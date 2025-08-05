import React, { useState, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { Bot, Minus, X } from 'lucide-react';
import { marked } from 'marked';
import styles from './FloatingAI.module.css';
import { model } from '../services/aiService';
import { saveConversation, getConversation, deleteConversation, type Message } from '../services/firebaseService';
import { tagdownContext } from '../services/aiContext';

interface RequestStatus {
  limit: number;
  remaining: number;
  used: number;
}

interface FloatingAIProps {
  user: User | null;
  requestStatus: RequestStatus | null;
}

const FloatingAI: React.FC<FloatingAIProps> = ({ user, requestStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Omit<Message, 'timestamp'>[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleCloseAndReset = async () => {
    setIsOpen(false);

    if (user) {
      // Exclui a conversa do Firebase
      await deleteConversation(user.uid);
    }
    
    // Reseta a conversa no frontend para uma mensagem de boas-vindas
    const initialMessage = user
      ? `Olá, ${user.displayName || user.email}! Como posso te ajudar hoje?`
      : 'Olá! Como posso te ajudar? Para uma experiência completa e para salvar suas conversas, recomendo fazer o login.';
      
    setMessages([{ text: initialMessage, sender: 'bot' }]);
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  // Efeito para carregar o histórico da conversa quando o usuário muda (login/logout)
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (user) {
        setIsLoading(true);
        const history = await getConversation(user.uid);
        if (history.length > 0) {
          setMessages(history);
        } else {
          const userName = user.displayName || user.email;
          setMessages([{ text: `Olá, ${userName}! Como posso te ajudar hoje?`, sender: 'bot' }]);
        }
        setIsLoading(false);
      } else {
        // Se o usuário deslogar, limpa as mensagens.
        setMessages([]);
      }
    };

    loadConversationHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    // Se o chat estiver sendo aberto e estiver vazio (após logout), mostra a mensagem de boas-vindas.
    if (!isOpen && messages.length === 0 && !user) {
      setMessages([{ text: 'Olá! Como posso te ajudar? Para uma experiência completa e para salvar suas conversas, recomendo fazer o login.', sender: 'bot' }]);
    }
    setIsOpen(prev => !prev);
  };

  const typeMessage = (text: string) => {
    let i = 0;
    const botMessage = { text: '', sender: 'bot' as const };
    setMessages((prev) => [...prev, botMessage]);

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setMessages((prev) => {
          const allButLast = prev.slice(0, -1);
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = {
            ...lastMessage,
            text: lastMessage.text + text.charAt(i),
          };
          return [...allButLast, updatedLastMessage];
        });
        i++;
      } else {
        clearInterval(typingInterval);
        if (user) {
          // Salva a conversa após a IA terminar de "digitar"
          setMessages(prev => {
            saveConversation(user.uid, prev);
            return prev;
          });
        }
      }
    }, 20); // Velocidade da digitação
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { text: input, sender: 'user' as const };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    if (user) {
      await saveConversation(user.uid, newMessages);
    }

    try {
      const historyForPrompt = newMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
      
      let userInfo;
      if (user) {
        const userName = user.displayName || user.email;
        userInfo = `O usuário está logado como ${userName}.`;
        if (requestStatus) {
          userInfo += ` Ele tem ${requestStatus.remaining} de ${requestStatus.limit} downloads restantes.`;
        }
      } else {
        userInfo = "O usuário não está logado.";
      }

      const prompt = `
${tagdownContext}

---
Histórico da Conversa:
${historyForPrompt}
---
Informação do Usuário: ${userInfo}
---
Baseado em todo o contexto, responda a última mensagem. Se o usuário estiver logado, não peça para ele fazer login.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setIsLoading(false);
      typeMessage(text);

    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = 'Desculpe, ocorreu um erro. Tente novamente.';
      setIsLoading(false);
      typeMessage(errorMessage);
    }
  };

  return (
    <div className={styles.floatingContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h2>Assistente de IA</h2>
            <div className={styles.headerButtons}>
              <button onClick={handleMinimize} className={styles.headerButton}>
                <Minus size={18} />
              </button>
              <button onClick={handleCloseAndReset} className={styles.headerButton}>
                <X size={18} />
              </button>
            </div>
          </div>
          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${styles[msg.sender]}`}
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
              />
            ))}
            {isLoading && <div className={`${styles.message} ${styles.bot}`}>Digitando...</div>}
          </div>
          <div className={styles.chatFooter}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pergunte-me qualquer coisa..."
            />
            <button onClick={handleSendMessage} disabled={isLoading}>Enviar</button>
          </div>
        </div>
      )}
      <button onClick={toggleChat} className={styles.chatButton}>
        <Bot size={32} />
      </button>
    </div>
  );
};

export default FloatingAI;
