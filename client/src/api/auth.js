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

export const verifyTokenRequest = (token = null) => {
  const config = {
    withCredentials: true,
    timeout: 5000
  };
  
  // Si se proporciona un token explícito (para SSR o casos especiales)
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`
    };
  }

  return instancia.get('/auth/verificar', config);
};
