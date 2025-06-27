// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  logoutRequest
} from '../api/auth';
import { actualizarPerfil } from '@/api/cliente/actualizarPerfil';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe estar dentro de un AuthProvider');
  }
  return context;
}

export const AuthProvide = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const signUp = async (userData) => {
    try {
      const res = await registerRequest(userData);
      refrescarDatos()
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      handleError(error);
    }
  };

  const signIn = async (credentials) => {
    try {
      const res = await loginRequest(credentials); // debe usar withCredentials: true
      setUser(res.data.user);
      setIsAuthenticated(true);
      refrescarDatos()
    } catch (error) {
      handleError(error);
    }
  };

  const signOut = async () => {
    try {
      await logoutRequest(); // debe limpiar la cookie en el backend
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      handleError(error);
    }
  };

  const editarUsuario = async (id, userData) => {
    try {
      const res = await actualizarPerfil(id, userData);
      setUser(res.data);
      return { success: true, data: res.data };
    } catch (error) {
      handleError(error);
    }
  };

  const reloadUser = async () => {
    try {
      const res = await verifyTokenRequest();
      setUser(res.data);
    } catch (error) {
      console.error('Error recargando usuario:', error);
    }
  };

  const handleError = (error) => {
    const msg = error?.response?.data?.error || 'Ocurrió un error inesperado';
    setErrors([{ msg }]);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyTokenRequest(); // debe usar withCredentials: true
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, [refreshTrigger]);

  const refrescarDatos = () => setRefreshTrigger(prev => prev + 1);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        editarUsuario,
        reloadUser,
        refrescarDatos,
        user,
        isAuthenticated,
        isLoading,
        errors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};