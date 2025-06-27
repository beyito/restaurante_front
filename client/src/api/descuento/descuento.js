import instancia from '../axios'

// Crear descuento
export const crearDescuento = async (input) => {
  return instancia.post('/descuentos/crear', input)
}

// Editar descuento
export const editarDescuento = async (input) => {
  return instancia.put('/descuentos/editar', input)
}

// Eliminar descuento
export const eliminarDescuento = async ( id ) => {
  console.log('iddescuento eliminar: ',id)
  return instancia.delete(`/descuentos/eliminar/${id}`)
}


// Mostrar descuentos
export const mostrarDescuentos = async () => {
  return instancia.get('/descuentos/mostrar')
}

// Registrar o canjear descuento
export const registrarDescuento = async (idUsuario, input) => {
  return instancia.post(`/descuentos/canjear/${idUsuario}`, input)
}

// Obtener puntos de fidelidad de un usuario
export const obtenerPuntosFidelidad = async (idUsuario) => {
  return instancia.get(`/descuentos/obtenerPuntosFidelidad/${idUsuario}`)
}

export const mostrarDescuentosObtenidosSinCanjear = async (idUsuario) => {
  return instancia.get(`/descuentos/obtenerDescuentosObtenidosSinCanjear/${idUsuario}`)
}
