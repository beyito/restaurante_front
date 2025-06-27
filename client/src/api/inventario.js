import instancia from "./axios";

export const getInventarioRequest = () => instancia.get("/inventario/mostrarStocks")

export const getInventarioBajo = () => instancia.get("/inventario/stock-bajo")

export const updateInventarioRequest = (stock) => instancia.put(`inventario/actualizar`, stock)