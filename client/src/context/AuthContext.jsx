import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest } from "../api/auth.js";

import Cookies from 'js-cookie'
import { actualizarPerfil } from "@/api/cliente/actualizarPerfil.js";

const AuthContext = createContext()

//hook para importar el useContext
//para exporta automaticamente el uso de contexto
function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deberia estar dentro de un AuthProvider");
  }
  return context
}

export { useAuth };

// para guardar el contexto del usuario y poder ocupar sus datos
// otras paginas
export const AuthProvide = ({ children }) => {

  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [isLoading, setLoading] = useState(true)


  const signUp = async (user) => {
    try {
      //paso 1
      const res = await registerRequest(user);
      setUser(res.data)
      //paso 2
      setIsAuthenticated(true)
    } catch (error) {
      //paso 3
      const msjDeError = error?.response?.data?.error || "Ocurrio un error inesperado"
      setErrors([{ msg: msjDeError }])
    }
  }

  const signIn = async (user) => {
    try {
      const res = await loginRequest(user)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      const msjDeError = error?.response?.data?.error || "Ocurrio un error inesperado"
      setErrors([{ msg: msjDeError }])
      console.log(error)
    }
  }

  const signOut = async () => {
    try {
      await logoutRequest()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      setErrors([{ msg: "Error al cerrar sesión" }])
      console.log(error)
    }
  }

  const editarUsuario = async (id, user) => {
    try {
      const res = await actualizarPerfil(id, user)
      if (!res.data) {
        throw new Error("No se recibieron datos en la respuesta")
      }
      setUser(res.data)
      setIsAuthenticated(true);
      return { success: true, data: res.data }
    } catch (error) {
      const msjDeError = error?.response?.data?.error || "Ocurrio un error inesperado"
      setErrors([{ msg: msjDeError }])
    }
  }

  const reloadUser = async () => {
    try {
      const res = await verifyTokenRequest('/auth/verificar');
      setUser(res.data);
    } catch (error) {
      console.error("Error recargando usuario:", error);
    }
  };

  //para eliminar los errores que aparecen en el form
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([])
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [errors])
  //para guardar la cookie con js-cookie
 useEffect(() => {
  const checkLogin = async () => {
    setLoading(true);
    try {
      // Opción 1: Usando solo withCredentials (recomendado para tu caso)
      const res = await verifyTokenRequest();
      
      // Opción 2: Usando js-cookie (alternativa)
      // const token = Cookies.get('access_token');
      // const res = await verifyTokenRequest(token);

      if (!res.data) {
        throw new Error('No hay datos de usuario');
      }
      
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      
      // Limpia cookies si el token es inválido
      Cookies.remove('access_token');
    } finally {
      setLoading(false);
    }
  };

  checkLogin();
}, []); // <-- Array vacío para ejecutar solo al montar
  return (
    <AuthContext.Provider value={{
      signUp,
      signIn,
      signOut,
      editarUsuario,
      reloadUser,
      user,
      isAuthenticated,
      isLoading,
      errors,

    }}>
      {children}
    </AuthContext.Provider>
  )
}
