import instancia from './axios.js'

export const registrarPedidoDomicilio = async (idCliente, descuento, productos) => {
  try {
    const response = await instancia.post(`/pedido/registrarPedidoDomicilio/${idCliente}`, {
      descuento,
      productos
    })
    return response.data
  } catch (error) {
    console.error('Error al registrar pedido a domicilio:', error)
    throw error
  }
}

export const pagarTicket = async (idPedido,idMetodoPago) => {
  try {
    const response = await instancia.post(`/pedido/pagarTicket/${idPedido}`,{
      idMetodoPago
    })
    return response.data
  } catch (error) {
    console.error('Error al pagar el ticket:', error)
    throw error
  }
}
//cocinero

export const obtenerPedidosPendientes = async () => {
  try {
    const response = await instancia.get('/pedido/pendientes')
    return response
  } catch (error) {
    console.error('Error al obtener pedidos pendientes:', error)
    throw error
  }
}

export const obtenerPedidosCompletadosHoy = async () => {
  try {
    const response = await instancia.get('/pedido/completados')
    return response
  } catch (error) {
    console.error('Error al obtener pedidos completados hoy:', error)
    throw error
  }
}

export const cambiarEstadoPedido = async (idPedido, estado) => {
  try {
    const response = await instancia.patch(`/pedido/estado/${idPedido}`, { nuevoEstado: estado })
    return response
  } catch (error) {
    console.error('Error al cambiar el estado del pedido:', error)
    throw error
  }
}
