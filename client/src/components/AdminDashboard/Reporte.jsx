    'use client'
    import jsPDF from 'jspdf'

    import { useState, useMemo, useEffect } from 'react'
    import { getTicketsPagadosRequest, getTicketByIdRequest } from '@/api/ticket'
    import { useFetchData } from '@/hooks/useFetchData'
    import {
    Search, Download, DollarSign, FileText
    } from 'lucide-react'
    import { Button } from '@/components/ui/button'
    import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
    } from '@/components/ui/card'
    import { Input } from '@/components/ui/input'
    import { Badge } from '@/components/ui/badge'
    import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
    } from '@/components/ui/table'
    import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
    } from '@/components/ui/select'

    const metodosPagoConfig = {
    Efectivo: { label: 'Efectivo' },
    'Tarjeta de Débito': { label: 'Tarjeta de Débito' },
    'Tarjeta de Crédito': { label: 'Tarjeta de Crédito' }
    }

    const extractTicket = (res) => res.data

    const generarPDF = (tickets) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    })

    const startX = 10
    let y = 15

    doc.setFontSize(16)
    doc.text('Reporte de Ventas - Detalle por Ticket', startX, y)
    y += 10

    tickets.forEach((ticket, index) => {
        doc.setFontSize(12)
        doc.setFont(undefined, 'bold')
        doc.text(`Ticket #${ticket.numero}`, startX, y)
        doc.setFont(undefined, 'normal')
        doc.text(`Fecha: ${ticket.fecha}`, startX + 60, y)
        doc.text(`Empleado: ${ticket.empleado || 'No asignado'}`, startX + 120, y)
        doc.text(`Método de pago: ${ticket.metodoDePago || 'N/A'}`, startX + 200, y)
        y += 6

        doc.setFont(undefined, 'bold')
        doc.text('Producto', startX, y)
        doc.text('Cantidad', startX + 80, y)
        doc.text('Precio', startX + 120, y)
        doc.text('Subtotal', startX + 160, y)
        doc.setFont(undefined, 'normal')
        y += 5

        ticket.detalles?.forEach((detalle) => {
        doc.text(`${detalle.producto}`, startX, y)
        doc.text(`${detalle.cantidad}`, startX + 80, y)
        doc.text(`Bs ${parseFloat(detalle.precio).toFixed(2)}`, startX + 120, y)
        doc.text(`Bs ${parseFloat(detalle.subtotal).toFixed(2)}`, startX + 160, y)
        y += 5

        if (y > 190) {
            doc.addPage()
            y = 15
        }
        })


        doc.setFont(undefined, 'bold')
        doc.text(`TOTAL: Bs ${ticket.monto.toFixed(2)}`, startX + 160, y)
        y += 10

        if (y > 190) {
        doc.addPage()
        y = 15
        }
    })

    return doc
    }

    const descargarArchivo = (contenido, nombreArchivo, tipo, esPDF = false) => {
    if (esPDF) {
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


    export default function TicketPagados() {
    const { data: tickets } = useFetchData(getTicketsPagadosRequest, extractTicket)

    const [searchTerm, setSearchTerm] = useState('')
    const [metodoPagoFilter, setMetodoPagoFilter] = useState('todos')
    const [empleadoFilter, setEmpleadoFilter] = useState('todos')
    //const [fechaFilter, setFechaFilter] = useState(undefined)
    const [fechaDesde, setFechaDesde] = useState(undefined)
    const [fechaHasta, setFechaHasta] = useState(undefined)


    const [ticketsConDetalles, setTicketsConDetalles] = useState([])
    const [cargandoDetalles, setCargandoDetalles] = useState(true)

    useEffect(() => {
        const fetchDetalles = async () => {
        if (!tickets || tickets.length === 0) return

        setCargandoDetalles(true)

        try {
            const detallesCompletos = await Promise.all(
            tickets.map(async (ticket) => {
                try {
                const { data } = await getTicketByIdRequest(ticket.id)
                return data
                } catch (e) {
                console.error(`Error al obtener detalles del ticket ${ticket.id}`, e)
                return null
                }
            })
            )

            setTicketsConDetalles(detallesCompletos.filter(Boolean))
        } finally {
            setCargandoDetalles(false)
        }
        }

        fetchDetalles()
    }, [tickets])


    const empleados = useMemo(() => {
        return [...new Set(tickets.map((t) => t.empleado).filter(Boolean))]
    }, [tickets])

    const metodosPago = useMemo(() => {
        return [...new Set(tickets.map((t) => t.metodoDePago).filter(Boolean))]
    }, [tickets])

    
    const ticketsConDetallesFiltrados = useMemo(() => {
    return ticketsConDetalles.filter((t) => {
        const matchesSearch =
        t.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.empleado && t.empleado.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesMetodoPago =
        metodoPagoFilter === 'todos' || t.metodoDePago === metodoPagoFilter

        const matchesEmpleado =
        empleadoFilter === 'todos' || t.empleado === empleadoFilter

        const fechaTicket = new Date(t.fecha)

        const matchesFecha =
        (!fechaDesde || fechaTicket >= fechaDesde) &&
        (!fechaHasta || fechaTicket <= fechaHasta)

        return matchesSearch && matchesMetodoPago && matchesEmpleado && matchesFecha
    })
    }, [ticketsConDetalles, searchTerm, metodoPagoFilter, empleadoFilter, fechaDesde, fechaHasta])


    const estadisticas = useMemo(() => {
        const total = ticketsConDetallesFiltrados.length
        const montoTotal = ticketsConDetallesFiltrados.reduce((acc, t) => acc + t.monto, 0)
        return { total, montoTotal }
    }, [ticketsConDetallesFiltrados])

    const productosMasVendidos = useMemo(() => {
        const contador = {}

        ticketsConDetallesFiltrados.forEach((ticket) => {
        ticket.detalles?.forEach((detalle) => {
            const producto = detalle.producto
            const cantidad = detalle.cantidad

            if (!contador[producto]) {
            contador[producto] = 0
            }

            contador[producto] += cantidad
        })
        })

        return Object.entries(contador)
        .sort((a, b) => b[1] - a[1])
        .map(([producto, cantidad]) => ({ producto, cantidad }))
    }, [ticketsConDetallesFiltrados])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB'
        }).format(amount)
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-')
        const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ]
        return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-3xl font-bold">Reporte de Ventas</h2>
            <p className="text-gray-600">Tickets en estado <strong>Pagado</strong></p>
            </div>
            <Button onClick={() => {
                if (!ticketsConDetallesFiltrados || ticketsConDetallesFiltrados.length === 0) {
                    alert('No hay tickets para exportar.')
                    return
                }

                const doc = generarPDF(ticketsConDetallesFiltrados)
                descargarArchivo(
                    doc,
                    `reporte-de-ventas-tickets-${new Date().toISOString().split('T')[0]}.pdf`,
                    '',
                    true
                )
                }}>
                <FileText className="w-4 h-4 mr-2" />
                Descargar Reporte
                </Button>


        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
            <CardHeader>
                <CardTitle>Total Tickets</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{estadisticas.total}</CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Monto Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">
                {formatCurrency(estadisticas.montoTotal)}
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                {productosMasVendidos.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between">
                    <span>{item.producto}</span>
                    <span className="font-medium">{item.cantidad} ventas</span>
                </div>
                ))}
            </CardContent>
            </Card>
        </div>

        {/* Filtros */}
        <Card>
            <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por número o empleado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                />
                </div>

                <Select value={metodoPagoFilter} onValueChange={setMetodoPagoFilter}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Método de pago" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos">Todos los métodos</SelectItem>
                    {metodosPago.map((metodo) => (
                    <SelectItem key={metodo} value={metodo}>
                        {metodosPagoConfig[metodo]?.icon} {metodo}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

                <Select value={empleadoFilter} onValueChange={setEmpleadoFilter}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Empleado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos">Todos los empleados</SelectItem>
                    {empleados.map((empleado) => (
                    <SelectItem key={empleado} value={empleado}>
                        {empleado}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

                <div className="flex gap-2">
                <div className="flex items-center gap-2 w-full">
                    <label className="text-sm text-muted-foreground whitespace-nowrap">Desde</label>
                    <Input
                    type="date"
                    className="w-full"
                    value={fechaDesde ? fechaDesde.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const value = e.target.value
                        setFechaDesde(value ? new Date(value) : undefined)
                    }}
                    />
                </div>
                <div className="flex items-center gap-2 w-full">
                    <label className="text-sm text-muted-foreground whitespace-nowrap">Hasta</label>
                    <Input
                    type="date"
                    className="w-full"
                    value={fechaHasta ? fechaHasta.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const value = e.target.value
                        setFechaHasta(value ? new Date(value) : undefined)
                    }}
                    />
                </div>
                </div>
            </div>
            </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
            <CardHeader>
            <CardTitle>Listado de ventas realizadas</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Método Pago</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {ticketsConDetallesFiltrados.map((t) => (
                    <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.numero}</TableCell>
                    <TableCell>{formatDate(t.fecha)}</TableCell>
                    <TableCell>{formatCurrency(t.monto)}</TableCell>
                    <TableCell>{t.empleado}</TableCell>
                    <TableCell>{t.metodoDePago || 'No especificado'}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </div>
    )
    }
