import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://restaurante-jbe5.onrender.com',
  withCredentials: true, // Esto es CRUCIAL para cookies entre dominios
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// axios.js - Interceptor corregido
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Solo redirige si no está ya en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
)

export default instance;