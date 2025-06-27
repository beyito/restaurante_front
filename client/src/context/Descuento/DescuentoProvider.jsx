import { useEffect, useState } from 'react'
import { DescuentoContext } from './DescuentoContext'
import {
  mostrarDescuentos,
  crearDescuento,
  editarDescuento,
  eliminarDescuento,
  mostrarDescuentosObtenidosSinCanjear
} from '../../api/descuento/descuento'

export const DescuentoProvider = ({ children }) => {
  const [descuentos, setDescuentos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refrescarDatos = () => setRefreshTrigger((prev) => prev + 1)

  useEffect(() => {
    const cargarDescuentos = async () => {
      setIsLoading(true)
      try {
        const response = await mostrarDescuentos()
        if (!response) throw new Error('No se pudieron cargar los descuentos')
        setDescuentos(response.data.descuentos)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    cargarDescuentos()
  }, [refreshTrigger])

  const CrearDescuento = async (input) => {
    try {
      const response = await crearDescuento(input)
      if (!response) throw new Error('No se pudo crear el descuento')
      refrescarDatos()
      return { mensaje: 'Descuento creado exitosamente', success: true }
    } catch (error) {
      console.error(error)
      return { mensaje: 'Error al crear el descuento', success: false }
    }
  }

  const EditarDescuento = async (input) => {
    try {
      const response = await editarDescuento(input)
      if (!response) throw new Error('No se pudo editar el descuento')
      refrescarDatos()
      return { mensaje: 'Descuento editado exitosamente', success: true }
    } catch (error) {
      console.error(error)
      return { mensaje: 'Error al editar el descuento', success: false }
    }
  }

  const EliminarDescuento = async (id) => {
    try {
      const response = await eliminarDescuento(id)
      if (!response) throw new Error('No se pudo eliminar el descuento')
      setDescuentos((prev) => prev.filter((d) => d.id !== id))
      return { mensaje: 'Descuento eliminado exitosamente', success: true }
    } catch (error) {
      console.error(error)
      return { mensaje: 'Error al eliminar el descuento', success: false }
    }
  }
 const mostrarDescuentosSinCanjear = async (idUsuario) => {
    try {
      const response = await mostrarDescuentosObtenidosSinCanjear(idUsuario)
      if (!response) throw new Error('No se pudieron cargar los descuentos obtenidos sin canjear')
      return response.data.descuentos
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <DescuentoContext.Provider
      value={{
        descuentos,
        isLoading,
        CrearDescuento,
        EditarDescuento,
        EliminarDescuento,
        refrescarDatos,
        mostrarDescuentosSinCanjear
      }}
    >
      {children}
    </DescuentoContext.Provider>
  )
}
