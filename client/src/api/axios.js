import axios from 'axios'

const instancia = axios.create({
  baseURL: 'https://restauranteback-1.onrender.com',
  withCredentials: true
})

export default instancia
