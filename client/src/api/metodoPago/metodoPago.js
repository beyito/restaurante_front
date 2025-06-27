import instancia from  "../axios"

export const crearMetodoPago = async (input) => instancia.post('/metodoPago/crear', input)

export const consultarPagosPorEmail = async (email) => instancia.get(`/metodoPago/consultar/${email}`)