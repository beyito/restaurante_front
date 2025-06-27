'use client'

import { useState, useEffect } from 'react'
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ChefHat,
  AlertCircle,
  X,
  RotateCcw,
  Clock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  obtenerPedidosPendientes,
  obtenerPedidosCompletadosHoy,
  cambiarEstadoPedido
} from '@/api/pedido.js'

//componente cocinero:
export default function CocineroPage() {
  const [pedidosPendientes, setPedidosPendientes] = useState([])
  const [pedidosCompletados, setPedidosCompletados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [procesando, setProcesando] = useState(null)

  // Cargar pedidos al montar el componente
  useEffect(() => {
    cargarPedidos()
    // Actualizar cada 60 segundos
    const interval = setInterval(cargarPedidos, 600000)
    return () => clearInterval(interval)
  }, [])

  const cargarPedidos = async () => {
    try {
      setLoading(true)
      setError(null)

      const [pendientesRes, completadosRes] = await Promise.all([
        obtenerPedidosPendientes(),
        obtenerPedidosCompletadosHoy()
      ])

      setPedidosPendientes(pendientesRes.data.pedidos || [])
      setPedidosCompletados(completadosRes.data.pedidos || [])
    } catch (err) {
      setError('Error al cargar los pedidos')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCambiarEstado = async (idPedido, nuevoEstado) => {
    try {
      setProcesando(idPedido)
      await cambiarEstadoPedido(idPedido, nuevoEstado)

      // Actualizar la lista local
      if (nuevoEstado === 'Completado') {
        const pedido = pedidosPendientes.find((p) => p.id === idPedido)
        if (pedido) {
          setPedidosPendientes((prev) => prev.filter((p) => p.id !== idPedido))
          setPedidosCompletados((prev) => [...prev, pedido])
        }
      } else if (nuevoEstado === 'Pendiente') {
        const pedido = pedidosCompletados.find((p) => p.id === idPedido)
        if (pedido) {
          setPedidosCompletados((prev) => prev.filter((p) => p.id !== idPedido))
          setPedidosPendientes((prev) => [...prev, pedido])
        }
      } else if (nuevoEstado === 'Cancelado') {
        setPedidosPendientes((prev) => prev.filter((p) => p.id !== idPedido))
        setPedidosCompletados((prev) => prev.filter((p) => p.id !== idPedido))
      }
    } catch (err) {
      setError('Error al cambiar el estado del pedido')
      console.error('Error:', err)
    } finally {
      setProcesando(null)
    }
  }

  const formatearHora = (hora) => {
    return new Date(hora).toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading && pedidosPendientes.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <ChefHat className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-500'>Cargando pedidos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <ChefHat className='h-8 w-8 text-orange-600' />
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Panel de Cocina
              </h1>
              <p className='text-gray-600'>
                Gestión de pedidos pendientes y completados
              </p>
            </div>
          </div>
          <Button onClick={cargarPedidos} variant='outline' disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas rápidas */}
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pedidos Pendientes
              </CardTitle>
              <Clock className='h-4 w-4 text-orange-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-orange-600'>
                {pedidosPendientes.length}
              </div>
              <p className='text-xs text-muted-foreground'>por preparar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Completados Hoy
              </CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {pedidosCompletados.length}
              </div>
              <p className='text-xs text-muted-foreground'>pedidos listos</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para Pedidos */}
        <Tabs defaultValue='pendientes' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='pendientes' className='flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Pendientes ({pedidosPendientes.length})
            </TabsTrigger>
            <TabsTrigger
              value='completados'
              className='flex items-center gap-2'
            >
              <CheckCircle className='h-4 w-4' />
              Completados ({pedidosCompletados.length})
            </TabsTrigger>
          </TabsList>

          {/* Pedidos Pendientes */}
          <TabsContent value='pendientes' className='space-y-4'>
            {pedidosPendientes.length === 0 ? (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <CheckCircle className='h-12 w-12 text-green-500 mb-4' />
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    ¡Excelente trabajo!
                  </h3>
                  <p className='text-gray-500 text-center'>
                    No hay pedidos pendientes en este momento
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {pedidosPendientes.map((pedido) => (
                  <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    tipo='pendiente'
                    onCambiarEstado={handleCambiarEstado}
                    procesando={procesando === pedido.id}
                    formatearHora={formatearHora}
                    formatearFecha={formatearFecha}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pedidos Completados */}
          <TabsContent value='completados' className='space-y-4'>
            {pedidosCompletados.length === 0 ? (
              <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <Clock className='h-12 w-12 text-gray-400 mb-4' />
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Sin pedidos completados
                  </h3>
                  <p className='text-gray-500 text-center'>
                    Los pedidos completados aparecerán aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {pedidosCompletados.map((pedido) => (
                  <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    tipo='completado'
                    onCambiarEstado={handleCambiarEstado}
                    procesando={procesando === pedido.id}
                    formatearHora={formatearHora}
                    formatearFecha={formatearFecha}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Componente para mostrar cada pedido
function PedidoCard({
  pedido,
  tipo,
  onCambiarEstado,
  procesando,
  formatearHora,
  formatearFecha
}) {
  const totalItems = pedido.DetallePedidos.reduce(
    (sum, detalle) => sum + detalle.cantidad,
    0
  )

  return (
    <Card
      className={`${
        tipo === 'pendiente'
          ? 'border-orange-200 bg-orange-50'
          : 'border-green-200 bg-green-50'
      }`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>Pedido #{pedido.id}</CardTitle>
          <Badge variant={tipo === 'pendiente' ? 'secondary' : 'default'}>
            {tipo === 'pendiente' ? 'Pendiente' : 'Completado'}
          </Badge>
        </div>
        <CardDescription className='flex items-center gap-2'>
          <Clock className='h-4 w-4' />
          {formatearFecha(pedido.hora)} - {formatearHora(pedido.hora)}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Resumen del pedido */}
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-600'>Total de items:</span>
          <Badge variant='outline'>{totalItems} items</Badge>
        </div>

        <Separator />

        {/* Lista de productos */}
        <ScrollArea className='h-32'>
          <div className='space-y-3'>
            {pedido.DetallePedidos.map((detalle, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>{detalle.Producto.nombre}</span>
                  <Badge variant='secondary'>x{detalle.cantidad}</Badge>
                </div>

                {/* Exclusiones */}
                {detalle.ExclusionIngredientes &&
                  detalle.ExclusionIngredientes.length > 0 && (
                    <div className='ml-4 space-y-1'>
                      <p className='text-xs text-red-600 font-medium flex items-center gap-1'>
                        <X className='h-3 w-3' />
                        Sin:
                      </p>
                      <div className='flex flex-wrap gap-1'>
                        {detalle.ExclusionIngredientes.map((exclusion, idx) => (
                          <Badge
                            key={idx}
                            variant='destructive'
                            className='text-xs'
                          >
                            {exclusion.Ingrediente.nombre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Botones de acción para pedidos pendientes */}
        {tipo === 'pendiente' && (
          <div className='flex gap-2 pt-2'>
            <Button
              onClick={() => onCambiarEstado(pedido.id, 'Completado')}
              disabled={procesando}
              className='flex-1 bg-green-600 hover:bg-green-700'
            >
              <CheckCircle className='h-4 w-4 mr-2' />
              {procesando ? 'Procesando...' : 'Completar'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' disabled={procesando}>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <XCircle className='h-4 w-4 mr-2' />
                      Cancelar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción cancelará el pedido #{pedido.id}. Esta
                        acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, mantener</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onCambiarEstado(pedido.id, 'Cancelado')}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Sí, cancelar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Botones de acción para pedidos completados */}
        {tipo === 'completado' && (
          <div className='flex gap-2 pt-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='flex-1 bg-transparent'
                  disabled={procesando}
                >
                  <MoreHorizontal className='h-4 w-4 mr-2' />
                  Cambiar Estado
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={() => onCambiarEstado(pedido.id, 'Pendiente')}
                >
                  <RotateCcw className='h-4 w-4 mr-2' />
                  Volver a Pendiente
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <XCircle className='h-4 w-4 mr-2' />
                      Cancelar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción cancelará el pedido #{pedido.id}. Esta
                        acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, mantener</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onCambiarEstado(pedido.id, 'Cancelado')}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Sí, cancelar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
