import instancia from "./axios"

export const getTicketRequest = async () => instancia.get('/ticket/mostrar')

export const getTicketByIdRequest = async (id) => instancia.get(`/ticket/mostrar/${id}`)

export const getTicketsPagadosRequest = async () => instancia.get('/ticket/pagados')