import { auth } from './firebaseService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const fetchInstagramData = async (input: string): Promise<any> => {
  const user = auth.currentUser;
  const headers = new Headers();
  if (user) {
    headers.append('x-user-id', user.uid);
  }

  let url;
  // Verifica se o input é uma URL do Instagram
  if (input.includes('instagram.com/p/') || input.includes('instagram.com/reel/')) {
    // É uma URL de post
    url = `${BASE_URL}/instagram-post-dl?url=${encodeURIComponent(input)}`;
  } else if (input.includes('instagram.com/')) {
    // É uma URL de perfil
    const username = input.substring(input.lastIndexOf('/') + 1);
    url = `${BASE_URL}/instagram-profile?username=${username}`;
  } else {
    // Trata como nome de usuário
    url = `${BASE_URL}/instagram-profile?username=${input}`;
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too Many Requests');
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    throw error;
  }
};
