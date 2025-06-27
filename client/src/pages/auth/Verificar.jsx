import { useAuth } from '@/context/AuthContext'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Loader2 } from 'lucide-react'

export default function Verificar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.user) {
      const rol = user.user.rol
      if (rol === 1) {
        navigate('/dashboard') // Redirige al panel admin
      } else if (rol === 3) {
        navigate('/mesero') // Redirige al panel mesero
      } else if (rol === 2) {
        navigate('/cocinero') // Redirige al panel cocinero
      }
    }
  }, [user, navigate])

  // Si el usuario no tiene rol válido o no está logueado
  if (!user || !user.user || (user.user.rol !== 1 && user.user.rol !== 3)) {
    return (
      <div className='max-w-md mx-auto mt-16 p-8 border border-gray-200 rounded-xl shadow-md text-center bg-white'>
        <h2 className='text-2xl font-semibold text-red-600 mb-4'>
          Acceso Denegado
        </h2>
        <p className='mb-8 text-gray-700'>
          No tienes permisos para acceder a esta página.
        </p>
        <Link
          to='/'
          className='px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition'
        >
          Ir al Menú Principal
        </Link>
      </div>
    )
  }

  // Mientras se redirige, podrías mostrar algo simple
  return (
    <div className='flex flex-col items-center justify-center mt-24 text-center gap-4 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      <span className='text-sm'>Verificando permisos...</span>
    </div>
  )
}
