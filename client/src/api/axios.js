import axios from 'axios'

const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

export default instancia
