import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { BadgePercent, Gift, X, Check } from "lucide-react"
import { mostrarDescuentos } from "@/api/descuento/descuento"
import { registrarDescuento } from "@/api/descuento/descuento" 
import { Toaster } from "@/components/ui/sonner"

export function ReclamarDescuento({ idUsuario }) {
  const [isOpen, setIsOpen] = useState(false)
  const [descuentos, setDescuentos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    const fetchDescuentos = async () => {
      try {
        const res = await mostrarDescuentos()
        setDescuentos(res.data.descuentos)
      } catch (error) {
        console.error("Error al cargar descuentos", error)
      }
    }
    fetchDescuentos()
  }, [])

  const handleReclamar = async () => {
    try {
      const codigo = generarCodigoAleatorio()
      const input = {
        idDescuento: seleccionado.id,
        codigo,
        idEstado: 2 // Sin canjear
      }

      const res = await registrarDescuento(idUsuario, input)
      if (res.data?.mensaje) {
        toast.success("¡Descuento reclamado!", {
          description: `Código: ${codigo}`
        })
        setIsOpen(false)
      }
    } catch (error) {
      toast.error("No se pudo reclamar el descuento")
      console.error(error)
    }
  }

  const generarCodigoAleatorio = () => {
    const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `DESC${num}`
  }

  const handleClose = () => {
    setIsOpen(false)
    setSeleccionado(null)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white hover:bg-green-500"
      >
        <Gift className="mr-2 h-4 w-4" />
        Obtener Descuento
      </Button>

      <Toaster richColors position="top-center" />

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BadgePercent className="h-5 w-5" />
              Reclamar un Descuento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-60 overflow-y-auto">
            {descuentos.map(d => (
              <div
                key={d.id}
                className={`border p-4 rounded cursor-pointer ${
                  seleccionado?.id === d.id ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSeleccionado(d)}
              >
                <p><strong>Descuento:</strong> {(d.descuento * 100).toFixed(0)}%</p>
                <p><strong>Fidelidad requerida:</strong> {d.costoFidelidad} puntos</p>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleReclamar} disabled={!seleccionado}>
              <Check className="mr-2 h-4 w-4" />
              Reclamar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
