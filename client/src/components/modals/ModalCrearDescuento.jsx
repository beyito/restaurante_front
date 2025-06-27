import { useState } from 'react'
import { useFormHandler } from '../../hooks/useFormHandler'

 const ModalCrearDescuento = ({ isOpen, onClose, onGuardar, Request }) => {
  const [errores, setErrores] = useState({})

  const { formData, handleInputChange, handleSubmit } = useFormHandler(
    { descuento: '', costoFidelidad: '' },
    async (formData) => {
      try {
        const dataAEnviar = {
          descuento: parseFloat(formData.descuento),
          costoFidelidad: parseFloat(formData.costoFidelidad)
        }

        await Request(dataAEnviar)
        onClose()
      } catch (error) {
        console.error(error)
      }
    })

    //     useEffect(() => {
    //     if (!isOpen) {
    //     setErrores({})
    //     setFormData({ descuento: '', costoFidelidad: '' }) 
    //     }
    // }, [isOpen])


  const handleSaveClick = async () => {
    const nuevosErrores = {}

    if (!formData.descuento.trim()) {
      nuevosErrores.descuento = 'El campo descuento es obligatorio'
    }
    if (!formData.costoFidelidad.trim()) {
      nuevosErrores.costoFidelidad = 'El campo costo de fidelidad es obligatorio'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setErrores({})
    await handleSubmit()
    onGuardar()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Crear Descuento
        </h2>

        {/* Campo descuento */}
        <label className="block text-sm text-gray-700 mb-1">
          Descuento (ej: 0.06)
        </label>
        <input
          type="number"
          step="0.01"
          name="descuento"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="0.05"
          value={formData.descuento}
          onChange={handleInputChange}
        />
        {errores.descuento && (
          <p className="text-red-500 text-sm mb-2">{errores.descuento}</p>
        )}

        {/* Campo costo fidelidad */}
        <label className="block text-sm text-gray-700 mb-1">
          Costo Fidelidad
        </label>
        <input
          type="number"
          name="costoFidelidad"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="150"
          value={formData.costoFidelidad}
          onChange={handleInputChange}
        />
        {errores.costoFidelidad && (
          <p className="text-red-500 text-sm mb-2">{errores.costoFidelidad}</p>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm text-gray-700 border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 rounded text-sm text-white bg-indigo-600 hover:bg-indigo-500"
          >
            Guardar Descuento
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalCrearDescuento
