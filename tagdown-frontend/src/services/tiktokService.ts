import { auth } from './firebaseService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const getHeaders = () => {
  const headers = new Headers();
  const user = auth.currentUser;

  if (user) {
    headers.append('x-user-id', user.uid);
  }

  return headers;
};

export const getTikTokVideo = async (videoUrl: string) => {
  const url = `${BASE_URL}/tiktok-video?url=${encodeURIComponent(videoUrl)}`;
  const headers = getHeaders();

  try {
    const response = await fetch(url, { headers });

    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching TikTok video:', error);
    throw error;
  }
};
