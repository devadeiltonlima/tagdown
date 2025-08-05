# Tagdown: Otimize suas Redes Sociais com Inteligência Artificial



## 🚀 Sobre o Projeto

O Tagdown é uma aplicação web inovadora projetada para criadores de conteúdo, influenciadores e agências de marketing que buscam otimizar sua presença no Instagram e TikTok. Com uma interface intuitiva e recursos poderosos, o Tagdown simplifica a criação de legendas e a busca por hashtags relevantes, utilizando inteligência artificial para maximizar o alcance e o engajamento.

Este projeto foi desenvolvido como parte do meu portfólio, demonstrando minhas habilidades em desenvolvimento full-stack com tecnologias modernas e foco na experiência do usuário.

## ✨ Funcionalidades

*   **Gerador de Legendas com IA:** Crie legendas criativas e personalizadas para suas postagens com o poder da inteligência artificial.
*   **Buscador de Hashtags Inteligente:** Encontre as hashtags mais relevantes e populares para o seu nicho, aumentando a visibilidade do seu conteúdo.
*   **Análise de Popularidade:** Obtenha insights sobre a popularidade de hashtags específicas para tomar decisões mais estratégicas.
*   **Interface Moderna e Intuitiva:** Uma experiência de usuário fluida e agradável, construída com as melhores práticas de design.
*   **Autenticação Segura:** Login com contas do Google para uma experiência personalizada e segura.

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: o frontend e o backend.

### Frontend

*   **React:** Biblioteca para construção de interfaces de usuário.
*   **Vite:** Ferramenta de build extremamente rápida para desenvolvimento frontend.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
*   **Framer Motion:** Para animações ricas e fluidas.
*   **Axios:** Cliente HTTP para realizar requisições às APIs.
*   **Marked:** Para renderização de conteúdo em Markdown.
*   **Lucide React:** Biblioteca de ícones.

### Backend

*   **Node.js:** Ambiente de execução JavaScript no servidor.
*   **Express:** Framework minimalista para aplicações web em Node.js.
*   **CORS:** Para habilitar requisições de diferentes origens.
*   **Dotenv:** Para gerenciar variáveis de ambiente.
*   **Axios:** Para realizar requisições a APIs externas (Instagram, TikTok, etc.).

### Infraestrutura e Serviços

*   **Firebase/Firestore:** Para autenticação de usuários e armazenamento de dados.

## 🎨 Design e UI

A interface do Tagdown foi projetada para ser limpa, moderna e fácil de usar. A combinação de cores, a tipografia e os elementos visuais foram cuidadosamente escolhidos para proporcionar uma experiência agradável e profissional. As animações, implementadas com Framer Motion, adicionam um toque de dinamismo e interatividade.

## 👨‍💻 Como Executar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)

### Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/devadeiltonlima/tagdown.git
    cd tagdown
    ```

2.  **Instale as dependências do Backend:**
    ```bash
    cd tagdown-backend
    npm install
    ```

3.  **Configure as variáveis de ambiente do Backend:**
    Crie um arquivo `.env` na pasta `tagdown-backend` e adicione as chaves de API necessárias.
    ```
    PORT=3001
    # Adicione outras chaves de API aqui (ex: API_KEY_TIKTOK, etc.)
    ```

4.  **Inicie o Backend:**
    ```bash
    npm start
    ```

5.  **Instale as dependências do Frontend:**
    ```bash
    cd ../tagdown-frontend
    npm install
    ```

6.  **Configure as variáveis de ambiente do Frontend:**
    Crie um arquivo `.env` na pasta `tagdown-frontend` e adicione as configurações do Firebase.
    ```
    VITE_FIREBASE_API_KEY=SUA_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID
    VITE_FIREBASE_APP_ID=SEU_APP_ID
    ```

7.  **Inicie o Frontend:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

## 📞 Contato

**Adeilton Lima**

*   **LinkedIn:** [https://www.linkedin.com/in/adeilton-lima/](https://www.linkedin.com/in/adeilton-lima/)
*   **GitHub:** [https://github.com/devadeiltonlima](https://github.com/devadeiltonlima)
*   **Email:** adeilton.lima.dev@gmail.com
