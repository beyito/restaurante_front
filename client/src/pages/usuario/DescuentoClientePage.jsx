import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { mostrarDescuentos, registrarDescuento, obtenerPuntosFidelidad, mostrarDescuentosObtenidosSinCanjear } from "@/api/descuento/descuento"
import { useAuth } from "@/context/AuthContext"

export default function DescuentosClientePage() {
  const { user } = useAuth()
  const clienteId = user?.user?.id

  const [descuentos, setDescuentos] = useState([])
  const [puntosFidelidad, setPuntosFidelidad] = useState(0)
  const [loading, setLoading] = useState(false)

  // Códigos ya obtenidos (sin canjear)
  const [codigosObtenidos, setCodigosObtenidos] = useState([])

  useEffect(() => {
    if (!clienteId) return

    const cargarDatos = async () => {
      setLoading(true)
      try {
        // Cargar descuentos
        const response = await mostrarDescuentos()
        const lista = response.data.descuentos || response.data || []
        if (!Array.isArray(lista)) throw new Error("Lista descuentos inválida")
        setDescuentos(lista)

        // Cargar puntos fidelidad
        const puntosResp = await obtenerPuntosFidelidad(clienteId)
        setPuntosFidelidad(puntosResp.data.puntosFidelidad || 0)

        // Cargar códigos obtenidos (sin canjear)
        // Filtra solo los códigos con idEstado=2 y del usuario actual
const responseCodigos = await mostrarDescuentosObtenidosSinCanjear(clienteId)
setCodigosObtenidos(responseCodigos.data || [])
      } catch (error) {
        console.error(error)
        toast.error("Error cargando datos")
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [clienteId])

  const handleObtenerCodigo = async (descuento) => {
    if (puntosFidelidad < descuento.costoFidelidad) {
      toast.error("No tienes puntos suficientes para obtener este descuento")
      return
    }

    const codigo = `DESC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
    try {
      const resultado = await registrarDescuento(clienteId, {
        idDescuento: descuento.idDescuento || descuento.id,
        codigo,
        idEstado: 2 // Sin canjear
      })

      if (resultado.error) {
        toast.error(resultado.error)
        return
      }

      toast.success("¡Código generado!", { description: `Código: ${codigo}` })

      // Actualizar puntos fidelidad restando costo del descuento
      setPuntosFidelidad((prev) => prev - descuento.costoFidelidad)

      // Actualizar lista de códigos obtenidos
      setCodigosObtenidos((prev) => [...prev, { idUsuario: clienteId, idEstado: 2, codigo, descuento: descuento.descuento }])
    } catch (error) {
      console.error(error)
      toast.error("Error al obtener código")
    }
  }

  if (loading) return <p>Cargando descuentos y puntos...</p>

  return (
    <div className="container py-8">
      <Toaster richColors position="top-center" />

      <h1 className="text-3xl font-bold mb-4">Mis Descuentos</h1>
      <p className="mb-8 font-semibold">Puntos de Fidelidad: {puntosFidelidad}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Descuentos Disponibles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {descuentos.length === 0 && <p>No hay descuentos disponibles.</p>}
          {descuentos.map((desc) => (
            <Card key={desc.idDescuento || desc.id}>
              <CardHeader>
                <CardTitle>{desc.descuento * 100}% Descuento</CardTitle>
                <CardDescription>{desc.costoFidelidad} pts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleObtenerCodigo(desc)}>Obtener Código</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Códigos Obtenidos (sin canjear)</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {codigosObtenidos.length === 0 && <p>No tienes códigos sin canjear.</p>}
          {codigosObtenidos.map((c, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{c.descuento * 100}% Descuento</CardTitle>
                <CardDescription>Código: {c.codigo}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
