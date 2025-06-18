import instancia from "./axios"

export const registerRequest = user =>instancia.post(`/auth/register`,user,{
  withCredentials: true // Obligatorio para cookies entre dominios
});

export const loginRequest = user => instancia.post(`/auth/login`,user,{
  withCredentials: true // Obligatorio para cookies entre dominios
});

export const logoutRequest = () => instancia.get('/auth/logout',{
  withCredentials: true // Obligatorio para cookies entre dominios
});

export const verifyTokenRequest = () => instancia.get('/auth/verificar',{
  withCredentials: true, // Obligatorio para cookies entre dominios
  timeout: 5000 // Timeout para no bloquear la UI
});
