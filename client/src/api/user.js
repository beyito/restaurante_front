import axios from './axios.js'

export const getUserRequest = async () => axios.get('/user/verUsuarios')
export const editUserRequest = async (user) => {
    const { id, ...otrosDatos } = user
    console.log(otrosDatos)
    return axios.patch(`/user/editarUsuario?id=${id}`, otrosDatos)
  }
export const registerEmployeeRequest = async (user) => axios.post('/user/register', user)
export const aumentarPuntosFidelidadRequest = (id, puntosFidelidad) =>
  axios.patch(`/user/aumentarPuntosFidelidad/${id}`, { puntosFidelidad }) // si solo sube +1 no hace falta body

export const disminuirPuntosFidelidadRequest = (id, puntosFidelidad) =>
  axios.patch(`/user/disminuirPuntosFidelidad/${id}`, { puntosFidelidad }) // si solo resta -1 no hace falta body

export const editarPuntosFidelidadRequest = (id, puntosFidelidad) =>
  axios.patch(`/user/editarPuntosFidelidad/${id}`, { puntosFidelidad })

export const getClientRequest = () =>
  axios.get('/user/verClientes')
