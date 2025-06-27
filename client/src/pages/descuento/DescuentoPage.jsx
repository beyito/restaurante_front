import { useEffect, useState, useContext, useMemo } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { DescuentoContext } from "@/context/Descuento/DescuentoContext"
import ModalCrearDescuento from "@/components/AdminDashboard/Descuento"

export function DescuentoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const {
    descuentos,
    CrearDescuento,
    EditarDescuento,
    EliminarDescuento,
    refrescarDatos
  } = useContext(DescuentoContext)

  const descuentosFiltrados = useMemo(() => {
    if (!searchTerm) return []
    return descuentos.filter(d =>
      d.descuento.toString().includes(searchTerm) ||
      d.costoFidelidad.toString().includes(searchTerm)
    )
  }, [descuentos, searchTerm])

  //Editar
  const handleGuardar = async (formData) => {
    try {
      if (editing) {
        await EditarDescuento({ ...formData, idDescuento: editing.idDescuento })
        // toast.success("Descuento actualizado")
      } else {
        await CrearDescuento(formData)
        // toast.success("Descuento creado")
      }
      refrescarDatos()
      setShowForm(false)
      setEditing(null)
    } 
    catch {
    //   toast.error("Error al procesar la solicitud")
    }
//    toast.success("Descuento actualizado exitosamente")
    refrescarDatos()
  }

  const handleEliminar = async (id) => {
    
    await EliminarDescuento(id)
    toast.success("Descuento eliminado")
    refrescarDatos()
  }

  return (
    <div className="space-y-6 container max-h-[calc(100vh-128px)] overflow-y-auto">
     <Toaster position="top-center" richColors toastOptions={{ className: 'animate-pulse' }} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Descuentos</h2>
          <p className="text-muted-foreground">Administra los descuentos del restaurante</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Descuento
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar descuento por porcentaje ej: 0.05"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {searchTerm && (
        descuentosFiltrados.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {descuentosFiltrados.map((d) => (
              <Card key={d.idDescuento}>
                <CardHeader className="pb-3 flex justify-between items-center">
                  <CardTitle className="text-lg">ID: {d.idDescuento}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditing(d)
                      setShowForm(true)
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" size="icon">
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>¿Eliminar descuento?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta acción no se puede deshacer. El descuento será eliminado permanentemente.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction
        asChild
      >
        <Button
          onClick={async () => {
            await handleEliminar(d.idDescuento);
          }}
        >
          Eliminar
        </Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p><strong>Descuento:</strong> {d.descuento * 100}%</p>
                  <p><strong>Costo Fidelidad:</strong> {d.costoFidelidad}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 col-span-full">
            <h3 className="mt-4 text-lg font-semibold">No se encontraron descuentos</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
          </div>
        )
      )}

      <ModalCrearDescuento
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditing(null)
        }}
        onGuardar={() => {
          refrescarDatos()
          setShowForm(false)
          setEditing(null)
        }}
        Request={handleGuardar}
        initialData={editing}
      />
    </div>
  )
}
