'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  DollarSign,
  User,
  Clock,
  FileText,
  Calendar,
  Settings
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import jsPDF from 'jspdf'

import { useFetchData } from '@/hooks/useFetchData'
import { getTicketRequest, getTicketByIdRequest } from '@/api/ticket'

const metodosPagoConfig = {
  Efectivo: { label: 'Efectivo', icon: '💵', variant: 'default' },
  'Tarjeta de Débito': {
    label: 'Tarjeta de Débito',
    icon: '💳',
    variant: 'secondary'
  },
  'Tarjeta de Crédito': {
    label: 'Tarjeta de Crédito',
    icon: '💳',
    variant: 'outline'
  }
}

// Configuración de columnas disponibles
const columnasDisponibles = [
  { key: 'numero', label: 'Número', enabled: true },
  { key: 'fecha', label: 'Fecha', enabled: true },
  { key: 'monto', label: 'Monto', enabled: true },
  { key: 'empleado', label: 'Empleado', enabled: true },
  { key: 'cliente', label: 'Cliente', enabled: true },
  { key: 'metodoDePago', label: 'Método de Pago', enabled: true },
  { key: 'estado', label: 'Estado', enabled: false },
  { key: 'id', label: 'ID', enabled: false },
  { key: 'detalles', label: 'Detalles de Productos', enabled: false }
]

const extractTicket = (res) => res.data
export default function TicketAdmin() {
  const { data: tickets } = useFetchData(getTicketRequest, extractTicket)
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('todos')
  const [metodoPagoFilter, setMetodoPagoFilter] = useState('todos')
  const [empleadoFilter, setEmpleadoFilter] = useState('todos')
  const [fechaFilter, setFechaFilter] = useState()
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Estados para el modal de descarga
  const [modalDescargaAbierto, setModalDescargaAbierto] = useState(false)
  const [tipoDescarga, setTipoDescarga] = useState('general') // "general" o "individual"
  const [ticketSeleccionado, setTicketSeleccionado] = useState('')
  const [formatoDescarga, setFormatoDescarga] = useState('csv')
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState(
    columnasDisponibles.filter((col) => col.enabled).map((col) => col.key)
  )

  // Función para obtener un ticket por su ID
  const handleViewTicket = async (id) => {
    try {
      const { data } = await getTicketByIdRequest(id)
      setSelectedTicket(data)
    } catch (error) {
      console.error('Error al cargar ticket:', error)
    }
  }
  // Obtener empleados únicos
  const empleados = useMemo(() => {
    const uniqueEmpleados = [
      ...new Set(
        tickets
          .filter((ticket) => ticket.empleado)
          .map((ticket) => ticket.empleado)
      )
    ]
    return uniqueEmpleados
  }, [tickets])

  // Obtener métodos de pago únicos
  const metodosPago = useMemo(() => {
    const uniqueMetodos = [
      ...new Set(
        tickets
          .filter((ticket) => ticket.metodoDePago)
          .map((ticket) => ticket.metodoDePago)
      )
    ]
    return uniqueMetodos
  }, [tickets])

  // Filtrar tickets
  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.empleado &&
          ticket.empleado.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.cliente &&
          ticket.cliente.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesEstado =
        estadoFilter === 'todos' ||
        (estadoFilter === 'pendientes' && !ticket.empleado) ||
        (estadoFilter === 'entregados' && ticket.empleado)

      const matchesMetodoPago =
        metodoPagoFilter === 'todos' || ticket.metodoDePago === metodoPagoFilter
      const matchesEmpleado =
        empleadoFilter === 'todos' || ticket.empleado === empleadoFilter

      // Filtro por fecha
      const matchesFecha =
        !fechaFilter || ticket.fecha === fechaFilter.toISOString().split('T')[0]

      return (
        matchesSearch &&
        matchesEstado &&
        matchesMetodoPago &&
        matchesEmpleado &&
        matchesFecha
      )
    })
  }, [
    tickets,
    searchTerm,
    estadoFilter,
    metodoPagoFilter,
    empleadoFilter,
    fechaFilter
  ])

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = ticketsFiltrados.length
    const montoTotal = ticketsFiltrados.reduce(
      (sum, ticket) => sum + ticket.monto,
      0
    )
    const pendientes = ticketsFiltrados.filter(
      (ticket) => !ticket.empleado
    ).length
    const entregados = ticketsFiltrados.filter(
      (ticket) => ticket.empleado
    ).length

    return { total, montoTotal, pendientes, entregados }
  }, [ticketsFiltrados])

  const handlePrintTicket = (ticket) => {
    const printContent = `
    <html>
      <head>
        <title>Ticket ${ticket.numero}</title>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              width: 8cm;
              margin: 0;
              padding: 0.5cm 0.5cm 0.5cm 0.5cm;
            }
            .ticket-header {
              text-align: center;
              border-bottom: 1.5px solid #333;
              padding-bottom: 0.3cm;
              margin-bottom: 0.5cm;
            }
            .ticket-info {
              display: flex;
              justify-content: space-between;
              margin: 0.2cm 0;
              font-size: 0.9rem;
            }
            .ticket-total {
              font-size: 1.1rem;
              font-weight: bold;
              text-align: center;
              margin-top: 0.7cm;
              padding-top: 0.3cm;
              border-top: 1px solid #333;
            }
          }
          /* Para visualización en pantalla antes de imprimir */
          body {
            font-family: Arial, sans-serif;
            width: 8cm;
            margin: 10px auto;
            padding: 0.5cm;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 1.5px solid #333;
            padding-bottom: 0.3cm;
            margin-bottom: 0.5cm;
          }
          .ticket-info {
            display: flex;
            justify-content: space-between;
            margin: 0.2cm 0;
            font-size: 0.9rem;
          }
          .ticket-total {
            font-size: 1.1rem;
            font-weight: bold;
            text-align: center;
            margin-top: 0.7cm;
            padding-top: 0.3cm;
            border-top: 1px solid #333;
          }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <h2>TICKET DE VENTA</h2>
          <p>${ticket.numero}</p>
        </div>
        <div class="ticket-info">
          <span>Fecha:</span>
          <span>${ticket.fecha}</span>
        </div>
        <div class="ticket-info">
          <span>Empleado:</span>
          <span>${ticket.empleado || 'No asignado'}</span>
        </div>
        <div class="ticket-info">
          <span>Cliente:</span>
          <span>${ticket.cliente || 'Sin cliente'}</span>
        </div>
        <div class="ticket-info">
          <span>Método de Pago:</span>
          <span>${ticket.metodoDePago || 'No especificado'}</span>
        </div>
        ${ticket.detalles
          ?.map(
            (d) => `
        <div class="ticket-info">
          <span>${d.cantidad} x ${d.producto}</span>
          <span>$${Number.parseFloat(d.subtotal).toFixed(2)}</span>
        </div>
        `
          )
          .join('')}
        <div class="ticket-total">
          TOTAL: $${Number.parseFloat(ticket.monto).toFixed(2)}
        </div>
      </body>
    </html>
  `

    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  // Función para obtener el valor de una columna
  const obtenerValorColumna = (ticket, columna) => {
    switch (columna) {
      case 'numero':
        return ticket.numero
      case 'fecha':
        return ticket.fecha
      case 'monto':
        return `${ticket.monto} Bs`
      case 'empleado':
        return ticket.empleado || 'No asignado'
      case 'cliente':
        return ticket.cliente || 'Sin cliente'
      case 'metodoDePago':
        return ticket.metodoDePago || 'No especificado'
      case 'estado':
        return ticket.estado || (ticket.empleado ? 'Entregado' : 'Pendiente')
      case 'id':
        return ticket.id
      case 'detalles':
        return (
          ticket.detalles
            ?.map((d) => `${d.cantidad}x ${d.producto} (${d.subtotal} Bs)`)
            .join('; ') || 'Sin detalles'
        )
      default:
        return ''
    }
  }

  // Función para generar CSV
  const generarCSV = (datosTickets, columnas) => {
    const headers = columnas.map(
      (col) => columnasDisponibles.find((c) => c.key === col)?.label || col
    )
    const filas = datosTickets.map((ticket) =>
      columnas.map((col) => obtenerValorColumna(ticket, col))
    )
    const csvContent = [headers, ...filas]
      .map((fila) => fila.map((celda) => `"${celda}"`).join(','))
      .join('\n')
    return csvContent
  }

  // Función para generar PDF real
  const generarPDF = (datosTickets, columnas) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const startX = 15
    const usableWidth = 270
    const columnWidth = usableWidth / columnas.length

    const drawHeader = (y) => {
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      const headers = columnas.map(
        (col) => columnasDisponibles.find((c) => c.key === col)?.label || col
      )
      headers.forEach((header, index) => {
        doc.text(header, startX + index * columnWidth, y)
      })
      doc.line(startX, y + 5, startX + usableWidth, y + 5)
      return y + 15
    }

    // Título y fecha
    doc.setFontSize(16)
    doc.text('REPORTE DE TICKETS', startX, 20)

    doc.setFontSize(10)
    doc.text(
      `Generado el: ${new Date().toLocaleDateString('es-ES')}`,
      startX,
      30
    )

    let yPosition = drawHeader(40)
    doc.setFont(undefined, 'normal')

    datosTickets.forEach((ticket) => {
      if (yPosition > 180) {
        doc.addPage()
        yPosition = drawHeader(20)
      }

      columnas.forEach((col, index) => {
        const valor = obtenerValorColumna(ticket, col)
        const texto = doc.splitTextToSize(String(valor), columnWidth - 2)
        doc.text(texto, startX + index * columnWidth, yPosition)
      })

      yPosition += 10

      // Agregar detalles si existen
      if (columnas.includes('detalles') && ticket.detalles?.length > 0) {
        doc.setFontSize(8)
        ticket.detalles.forEach((detalle) => {
          if (yPosition > 180) {
            doc.addPage()
            yPosition = drawHeader(20)
          }
          doc.text(
            `• ${detalle.cantidad}x ${detalle.producto}: ${detalle.subtotal} Bs`,
            startX + 5,
            yPosition
          )
          yPosition += 5
        })
        doc.setFontSize(12)
        yPosition += 5
      }
    })

    return doc
  }

  // Función para descargar archivo
  const descargarArchivo = (contenido, nombreArchivo, tipo, esPDF = false) => {
    if (esPDF) {
      // Para PDFs, contenido es el objeto jsPDF
      contenido.save(nombreArchivo)
    } else {
      const blob = new Blob([contenido], { type: tipo })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nombreArchivo
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  // Manejar descarga
  const handleDescarga = async () => {
    let datosParaDescargar = []
    let nombreArchivo = ''

    if (tipoDescarga === 'general') {
      // Para reporte general, necesitamos obtener detalles de cada ticket si está seleccionado
      if (columnasSeleccionadas.includes('detalles')) {
        const ticketsConDetalles = await Promise.all(
          ticketsFiltrados.map(async (ticket) => {
            try {
              const { data } = await getTicketByIdRequest(ticket.id)
              return data
            } catch (error) {
              console.error(
                `Error al cargar detalles del ticket ${ticket.id}:`,
                error
              )
              return ticket
            }
          })
        )
        datosParaDescargar = ticketsConDetalles
      } else {
        datosParaDescargar = ticketsFiltrados
      }
      nombreArchivo = `reporte-tickets-${
        new Date().toISOString().split('T')[0]
      }`
    } else {
      const { data } = await getTicketByIdRequest(ticketSeleccionado)
      datosParaDescargar = [data]
      nombreArchivo = `ticket-${data.numero}-${
        new Date().toISOString().split('T')[0]
      }`
    }

    if (formatoDescarga === 'csv') {
      const csvContent = generarCSV(datosParaDescargar, columnasSeleccionadas)
      descargarArchivo(csvContent, `${nombreArchivo}.csv`, 'text/csv')
    } else {
      const pdfDoc = generarPDF(datosParaDescargar, columnasSeleccionadas)
      descargarArchivo(pdfDoc, `${nombreArchivo}.pdf`, 'application/pdf', true)
    }

    setModalDescargaAbierto(false)
  }

  const toggleColumna = (columna) => {
    setColumnasSeleccionadas((prev) =>
      prev.includes(columna)
        ? prev.filter((c) => c !== columna)
        : [...prev, columna]
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'bob'
    }).format(amount)
  }

  //   const formatDate = (dateString) => {
  //     return new Date(dateString).toLocaleDateString('es-MX', {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric'
  //     })
  //   }
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]
    return `${Number.parseInt(day)} de ${
      meses[Number.parseInt(month) - 1]
    } de ${year}`
  }

  const getPaymentMethodBadge = (metodo) => {
    if (!metodo) return <Badge variant='secondary'>No especificado</Badge>

    const config = metodosPagoConfig[metodo]
    if (!config) return <Badge variant='secondary'>{metodo}</Badge>

    return (
      <Badge variant={config.variant}>
        {config.icon} {config.label}
      </Badge>
    )
  }

  return (
    <div className=' p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>
              Panel de Administración
            </h2>
            <p className='text-gray-600'>Gestión de tickets y ventas</p>
          </div>
          <Dialog
            open={modalDescargaAbierto}
            onOpenChange={setModalDescargaAbierto}
          >
            <DialogTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Download className='h-4 w-4' />
                Descargar Reporte
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  <Settings className='h-5 w-5' />
                  Configurar Descarga
                </DialogTitle>
                <DialogDescription>
                  Personaliza tu reporte seleccionando el tipo, formato y
                  columnas
                </DialogDescription>
              </DialogHeader>

              <Tabs
                value={tipoDescarga}
                onValueChange={setTipoDescarga}
                className='space-y-4'
              >
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='general'>Reporte General</TabsTrigger>
                  <TabsTrigger value='individual'>
                    Ticket Individual
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='general' className='space-y-4'>
                  <div className='p-4 bg-blue-50 rounded-lg'>
                    <p className='text-sm text-blue-800'>
                      Se descargarán {ticketsFiltrados.length} tickets con los
                      filtros aplicados
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value='individual' className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Seleccionar Ticket:</Label>
                    <Select
                      value={ticketSeleccionado}
                      onValueChange={setTicketSeleccionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona un ticket' />
                      </SelectTrigger>
                      <SelectContent>
                        {tickets.map((ticket) => (
                          <SelectItem
                            key={ticket.id}
                            value={ticket.id.toString()}
                          >
                            {ticket.numero} - {formatCurrency(ticket.monto)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Selección de formato */}
              <div className='space-y-3'>
                <Label>Formato de descarga:</Label>
                <div className='flex gap-4'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      id='csv'
                      name='formato'
                      value='csv'
                      checked={formatoDescarga === 'csv'}
                      onChange={(e) => setFormatoDescarga(e.target.value)}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                    />
                    <Label htmlFor='csv' className='text-sm'>
                      📊 CSV (Excel)
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      id='pdf'
                      name='formato'
                      value='pdf'
                      checked={formatoDescarga === 'pdf'}
                      onChange={(e) => setFormatoDescarga(e.target.value)}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                    />
                    <Label htmlFor='pdf' className='text-sm'>
                      📄 PDF
                    </Label>
                  </div>
                </div>
              </div>

              {/* Selección de columnas */}
              <div className='space-y-3'>
                <Label>Columnas a incluir:</Label>
                <ScrollArea className='h-32 border rounded-lg p-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    {columnasDisponibles.map((columna) => (
                      <div
                        key={columna.key}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          id={columna.key}
                          checked={columnasSeleccionadas.includes(columna.key)}
                          onCheckedChange={() => toggleColumna(columna.key)}
                        />
                        <Label htmlFor={columna.key} className='text-sm'>
                          {columna.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <p className='text-xs text-muted-foreground'>
                  {columnasSeleccionadas.length} columnas seleccionadas
                </p>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setModalDescargaAbierto(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDescarga}
                  disabled={
                    columnasSeleccionadas.length === 0 ||
                    (tipoDescarga === 'individual' && !ticketSeleccionado)
                  }
                >
                  <Download className='h-4 w-4 mr-2' />
                  Descargar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estadísticas */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Tickets
              </CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{estadisticas.total}</div>
              <p className='text-xs text-muted-foreground'>
                tickets procesados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Monto Total</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(estadisticas.montoTotal)}
              </div>
              <p className='text-xs text-muted-foreground'>en ventas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pendientes</CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {estadisticas.pendientes}
              </div>
              <p className='text-xs text-muted-foreground'>
                tickets pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Entregados</CardTitle>
              <User className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {estadisticas.entregados}
              </div>
              <p className='text-xs text-muted-foreground'>
                tickets completados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Filter className='h-5 w-5' />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
              {/* Búsqueda */}
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar por número, empleado o cliente...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 w-full'
                />
              </div>

              {/* Filtro por estado */}
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder='Estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los estados</SelectItem>
                  <SelectItem value='pendientes'>Pendientes</SelectItem>
                  <SelectItem value='entregados'>Entregados</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por método de pago */}
              <Select
                value={metodoPagoFilter}
                onValueChange={setMetodoPagoFilter}
              >
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder='Método de pago' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los métodos</SelectItem>
                  {metodosPago.map((metodo) => (
                    <SelectItem key={metodo} value={metodo}>
                      {metodosPagoConfig[metodo]?.icon} {metodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por empleado */}
              <Select value={empleadoFilter} onValueChange={setEmpleadoFilter}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder='Empleado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los empleados</SelectItem>
                  {empleados.map((empleado) => (
                    <SelectItem key={empleado} value={empleado}>
                      {empleado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por fecha */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='justify-start text-left font-normal bg-transparent w-full'
                  >
                    <Calendar className='mr-2 h-4 w-4' />
                    {fechaFilter
                      ? fechaFilter.toLocaleDateString('es-MX')
                      : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <CalendarComponent
                    mode='single'
                    selected={fechaFilter}
                    onSelect={setFechaFilter}
                    initialFocus
                  />
                  <div className='p-3 border-t'>
                    <Button
                      variant='outline'
                      className='w-full bg-transparent'
                      onClick={() => setFechaFilter(undefined)}
                    >
                      Limpiar fecha
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets ({ticketsFiltrados.length})</CardTitle>
            <CardDescription>
              Lista de todos los tickets filtrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border overflow-y-auto max-h-[160px] custom-scrollbar'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Método Pago</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsFiltrados.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className='font-medium'>
                        #{ticket.id}
                      </TableCell>
                      <TableCell>
                        <div className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
                          {ticket.numero}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(ticket.fecha)}</TableCell>
                      <TableCell>
                        <span className='font-semibold text-green-600'>
                          {formatCurrency(ticket.monto)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {ticket.empleado ? (
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4 text-gray-500' />
                            {ticket.empleado}
                          </div>
                        ) : (
                          <span className='text-gray-400 italic'>
                            No asignado
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.cliente ? (
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4 text-blue-500' />
                            {ticket.cliente}
                          </div>
                        ) : (
                          <span className='text-gray-400 italic'>
                            Sin cliente
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodBadge(ticket.metodoDePago)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleViewTicket(ticket.id)}
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-2xl'>
                              <DialogHeader>
                                <DialogTitle>
                                  Detalles del Ticket {selectedTicket?.numero}
                                </DialogTitle>
                                <DialogDescription>
                                  Información completa del ticket de venta
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTicket && (
                                <TicketDetails ticket={selectedTicket} />
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={async () => {
                              const { data } = await getTicketByIdRequest(
                                ticket.id
                              )
                              handlePrintTicket(data)
                            }}
                          >
                            <Printer className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setTipoDescarga('individual')
                              setTicketSeleccionado(ticket.id.toString())
                              setModalDescargaAbierto(true)
                            }}
                          >
                            <Download className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {ticketsFiltrados.length === 0 && (
              <div className='text-center py-12'>
                <div className='text-muted-foreground'>
                  No se encontraron tickets con los filtros aplicados
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente para mostrar detalles del ticket
export function TicketDetails({ ticket }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]
    return `${Number.parseInt(day)} de ${
      meses[Number.parseInt(month) - 1]
    } de ${year}`
  }

  return (
    <div className='space-y-6'>
      {/* Información general */}
      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <div className='text-sm text-muted-foreground'>Número de Ticket</div>
          <div className='text-lg font-bold'>{ticket.numero}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Estado</div>
          <Badge variant={ticket.estado === 'Pagado' ? 'default' : 'secondary'}>
            {ticket.estado}
          </Badge>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Fecha</div>
          <div>{formatDate(ticket.fecha)}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Empleado</div>
          <div>{ticket.empleado || 'No asignado'}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Cliente</div>
          <div>{ticket.cliente || 'Sin cliente'}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Método de Pago</div>
          <div>{ticket.metodoDePago || 'No especificado'}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Monto Total</div>
          <div className='text-lg font-bold text-green-600'>
            {formatCurrency(ticket.monto)}
          </div>
        </div>
      </div>

      <Separator />

      {/* Detalles de productos */}
      <div className='space-y-4'>
        <div className='text-lg font-semibold'>Productos</div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='text-left text-muted-foreground'>
              <tr>
                <th className='p-2'>Producto</th>
                <th className='p-2'>Cantidad</th>
                <th className='p-2'>Precio</th>
                <th className='p-2 text-right'>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {ticket.detalles?.map((item, i) => (
                <tr key={i} className='border-t'>
                  <td className='p-2'>{item.producto}</td>
                  <td className='p-2'>{item.cantidad}</td>
                  <td className='p-2'>{formatCurrency(item.precio)}</td>
                  <td className='p-2 text-right'>
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
