import { auth } from './firebaseService';

const getHeaders = () => {
  const headers = new Headers();
  const user = auth.currentUser;

  if (user) {
    headers.append('x-user-id', user.uid);
  }

  return headers;
};

export const getTikTokVideo = async (videoUrl: string) => {
  const url = `http://localhost:3001/tiktok-video?url=${encodeURIComponent(videoUrl)}`;
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
