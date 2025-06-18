import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://restaurante-jbe5.onrender.com',
  withCredentials: true, // Esto es CRUCIAL para cookies entre dominios
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar errores
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Manejar logout cuando el token expira
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default instance;