import { Button } from '@/components/ui/button'
import React, { useContext, useState } from 'react'
import { BitacoraContext } from '../context/BitacoraContext'
import { SkeletonBitacora } from '../components/SkeletonBitacora'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, FileClock, LogIn, LogOut, UserPlus, FileText, BookOpenCheck, ShoppingCart, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function BitacoraPage() {
  const { bitacora } = useContext(BitacoraContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [usuarioFilter, setUsuarioFilter] = useState('')
  const itemsPerPage = 9

  const filteredBitacora = bitacora?.filter((item) => {
    const fechaItem = new Date(item.fecha)
    const desde = startDate ? new Date(startDate) : null
    const hasta = endDate ? new Date(endDate) : null

    if (desde && fechaItem < desde) return false
    if (hasta && fechaItem > hasta) return false
    if (usuarioFilter && !item.usuario.toLowerCase().includes(usuarioFilter.toLowerCase())) return false

    return true
  }) || []

  const totalPages = Math.ceil(filteredBitacora.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredBitacora.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const getIcon = (accion) => {
    const palabras = accion.toLowerCase().split(' ')
    const ultima = palabras[palabras.length - 1]

    switch (ultima) {
      case 'sesión':
        if (accion.toLowerCase().includes('iniciar')) return <LogIn className="text-green-500 w-5 h-5" />
        if (accion.toLowerCase().includes('cerrar')) return <LogOut className="text-red-500 w-5 h-5" />
        if (accion.toLowerCase().includes('usuario')) return <UserPlus className="text-blue-500 w-5 h-5" />
        return <FileText className="text-gray-500 w-5 h-5" />
      case 'usuario':
        return <UserPlus className="text-blue-500 w-5 h-5" />
      case 'reserva':
        return <BookOpenCheck className="text-indigo-500 w-6 h-6" />
      case 'producto':
      case 'productos':
        return <ShoppingCart className="text-yellow-500 w-6 h-6" />
      default:
        return <FileText className="text-gray-500 w-6 h-6" />
    }
  }

  if (!bitacora) {
    return <SkeletonBitacora />
  }

  return (
    <div className="flex flex-col items-center py-4 px-4 space-y-6 container max-h-[calc(100vh-50px)] overflow-y-auto">
      <Card className="w-full max-w-7xl">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-center mb-2">
            <FileClock className="w-7 h-7 text-gray-700 mr-2" />
            <CardTitle className="text-3xl font-extrabold text-gray-800">Bitácora de Eventos</CardTitle>
          </div>
          <p className="text-gray-500 text-center">Aquí puedes consultar los eventos registrados en el sistema.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center items-center border rounded-xl p-4 mb-6 bg-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Desde" className="max-w-[140px]" />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Hasta" className="max-w-[140px]" />
            <Input type="text" placeholder="Buscar por usuario" value={usuarioFilter} onChange={(e) => setUsuarioFilter(e.target.value)} className="max-w-[200px]" />
          </div>

          {paginatedData.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No hay registros en la bitácora.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {paginatedData.map((valor) => (
                <Card key={valor.id} className="p-4 flex gap-2 items-start shadow-sm hover:shadow-md transition">
                  <div className="p-2 rounded-full bg-gray-100 flex items-center justify-center">{getIcon(valor.accion)}</div>
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Fecha:</span>
                      <span className="ml-1 text-gray-600">{valor.fecha}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Hora:</span>
                      <span className="ml-1 text-gray-600">{valor.hora}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Usuario:</span>
                      <span className="ml-1 text-gray-600">{valor.usuario}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Evento:</span>
                      <span className="ml-1 text-gray-600">{valor.accion}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700">Descripción:</span>
                      <span className="ml-1 text-gray-600">{valor.descripcion}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700">IP:</span>
                      <span className="ml-1 text-gray-600">{valor.ip}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-gray-700 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
