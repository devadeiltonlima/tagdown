import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCyYkBkyHD_yF0Oo4rMCqy1KGAFdYgOMH0",
  authDomain: "liikmaprojectflow.firebaseapp.com",
  projectId: "liikmaprojectflow",
  storageBucket: "liikmaprojectflow.firebasestorage.app",
  messagingSenderId: "367027021739",
  appId: "1:367027021739:web:570d93ac423e7dd8a154ee"
};

// Inicializa o FirebaseApp
const firebaseApp = initializeApp(firebaseConfig);

// Inicializa o serviço de backend da API Gemini Developer
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

// Cria uma instância `GenerativeModel` com um modelo que suporte seu caso de uso
const model = getGenerativeModel(ai, { model: "gemini-1.5-flash" });

export { model };
