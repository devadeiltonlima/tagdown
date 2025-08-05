# Tagdown: Baixe Vídeos e Imagens do Instagram e TikTok

## 🚀 Sobre o Projeto

O Tagdown é uma aplicação web poderosa e intuitiva que permite aos usuários baixar vídeos, imagens e até mesmo extrair áudio de publicações do Instagram e TikTok de forma simples e rápida. Basta colar um link de um post, reel, vídeo do TikTok ou o nome de um perfil do Instagram para visualizar e baixar o conteúdo desejado.

Este projeto foi desenvolvido para demonstrar minhas habilidades em desenvolvimento full-stack, integrando serviços externos, construindo uma interface de usuário reativa e um backend proxy para lidar com requisições a APIs de terceiros.

## ✨ Funcionalidades Principais

*   **Download de Mídia do Instagram:**
    *   Baixe fotos e vídeos de posts com apenas um clique.
    *   Insira um nome de usuário para visualizar todos os posts e baixar individualmente.
    *   Suporte para posts de imagem, vídeo e reels.
*   **Download de Vídeos do TikTok:**
    *   Cole o link de um vídeo do TikTok para baixá-lo em alta qualidade.
*   **Extração de Áudio:**
    *   Converta vídeos do Instagram e TikTok para arquivos de áudio MP3 e baixe-os diretamente.
*   **Interface Intuitiva:**
    *   Uma interface limpa que permite colar o link e visualizar o conteúdo rapidamente.
    *   Preview da mídia antes de baixar.
*   **Autenticação de Usuários:**
    *   Login com Google para gerenciar o uso e limites de requisição.
*   **Histórico e Limites:**
    *   Sistema de controle de requisições para usuários logados e não logados.

## 🛠️ Tecnologias Utilizadas

O projeto é uma aplicação full-stack com um frontend moderno e um backend que atua como um proxy.

### Frontend

*   **React:** Biblioteca para construção da interface de usuário.
*   **Vite:** Ferramenta de build para um desenvolvimento frontend ágil.
*   **TypeScript:** Para um código mais robusto e seguro com tipagem estática.
*   **CSS Modules:** Para estilização de componentes de forma isolada.
*   **Axios:** Cliente HTTP para realizar requisições.
*   **Firebase (Client SDK):** Para autenticação de usuários.

### Backend

*   **Node.js & Express:** Para criar o servidor proxy.
*   **CORS:** Para permitir requisições do frontend.
*   **Dotenv:** Para gerenciamento de variáveis de ambiente.
*   **Axios:** Para fazer as requisições para as APIs do Instagram e TikTok.
*   **FFmpeg:** Utilizado no backend para a conversão de vídeo para áudio.

### Infraestrutura e Serviços

*   **Firebase Authentication:** Para o sistema de login com Google.
*   **Firestore:** Potencialmente para armazenar dados do usuário e controle de requisições.

## 👨‍💻 Como Executar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
*   [FFmpeg](https://ffmpeg.org/download.html) instalado no ambiente do backend (necessário para a conversão de áudio).

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
    Crie um arquivo `.env` na pasta `tagdown-backend`.
    ```
    PORT=3001
    # Outras chaves de API, se houver
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
    Crie um arquivo `.env` na pasta `tagdown-frontend` com suas credenciais do Firebase.
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

A aplicação estará disponível em `http://localhost:5173` (ou outra porta definida pelo Vite).

## 📞 Contato

**Adeilton Lima**

*   **LinkedIn:** [https://www.linkedin.com/in/adeilton-lima/](https://www.linkedin.com/in/adeilton-lima/)
*   **GitHub:** [https://github.com/devadeiltonlima](https://github.com/devadeiltonlima)
*   **Email:** adeilton.lima.dev@gmail.com
