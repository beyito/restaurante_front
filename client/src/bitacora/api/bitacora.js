import instancia from "@/api/axios";

export const ConsultarBitacora = async () => instancia.get('/admin/bitacora')