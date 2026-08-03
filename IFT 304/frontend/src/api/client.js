import * as SecureStore from 'expo-secure-store';

// Replace with your local network IP address when testing on a physical device
const BASE_URL = 'http://10.148.30.183'; 

export async function apiFetch(endpoint, options = {}) {
  const token = await SecureStore.getItemAsync('user_jwt');
  
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set default JSON Content-Type unless uploading FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}