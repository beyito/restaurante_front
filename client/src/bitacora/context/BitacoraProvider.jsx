
import React from 'react'
import { BitacoraContext } from './BitacoraContext'
import { ConsultarBitacora } from '../api/bitacora'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export const BitacoraProvider = ({ children }) => {

  const { user } = useAuth()

  const [bitacora, setBitacora] = useState([])

  useEffect(() => {
    const ConsultarBitacoraEffect = async () => {
      if (user && user.user.rol === 1) {
        try {
          const response = await ConsultarBitacora()
          if (!response) {
            throw new Error(response.data.mensaje || "No se encontraron registros en la bitácora")
          }
          setBitacora(response.data)
        } catch (error) {
          console.error("Error fetching bitacora:", error)
        }
      }
    }
    ConsultarBitacoraEffect()
  }, [user])

  const consultarBitacora = async () => {
    try {
      const respuesta = await ConsultarBitacora()
      if (!respuesta) {
        throw new Error(respuesta.data.mensaje || "No se encontraron registros en la bitácora")
      }
      return respuesta.data
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <BitacoraContext.Provider value={{
      consultarBitacora,
      bitacora
    }}>
      {children}
    </BitacoraContext.Provider>
  )
}
