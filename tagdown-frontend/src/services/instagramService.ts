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

export const getProfileData = async (username: string) => {
  const url = `${BASE_URL}/instagram-profile?username=${username}`;
  const headers = getHeaders();

  try {
    const response = await fetch(url, { headers });
    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPostDownloadLink = async (postUrl: string) => {
  const url = `${BASE_URL}/instagram-post-dl?url=${encodeURIComponent(postUrl)}`;
  const headers = getHeaders();

  try {
    const response = await fetch(url, { headers });
    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }
    if (!response.ok) {
      throw new Error('Network response was not ok for post-dl');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPostInfo = async (postUrl: string) => {
  const url = `${BASE_URL}/instagram-post-info?url=${encodeURIComponent(postUrl)}`;
  const headers = getHeaders();

  try {
    const response = await fetch(url, { headers });
    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }
    if (!response.ok) {
      throw new Error('Network response was not ok for post');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserPosts = async (username: string) => {
  const url = `${BASE_URL}/instagram-posts?username=${username}`;
  const headers = getHeaders();

  try {
    const response = await fetch(url, { headers });
    if (response.status === 429) {
      throw new Error('Too Many Requests');
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
