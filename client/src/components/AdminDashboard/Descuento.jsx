import { useState } from 'react'
import { useFetchData } from '../../hooks/useFetchData'
import { useModal } from '../../hooks/useModal'

import ModalCrearDescuento from '../modals/ModalCrearDescuento'
import ModalDelete from '../modals/ModalDelete'
import SuccessModal from '../modals/SuccessModal'

// Importa tus funciones API para descuentos
import {
  mostrarDescuentos,
  crearDescuento,
  eliminarDescuento,
  editarDescuento
} from '../../api/descuento/descuento' // ajusta la ruta si es necesario

const extractDescuentos = (res) => res.data.descuentos
// Modal sencillo para editar descuento
const ModalEditarDescuento = ({ isOpen, onClose, descuento, onGuardar }) => {
  const [formData, setFormData] = useState({
    id: descuento?.id || '',
    descuento: descuento?.descuento || '',
    costoFidelidad: descuento?.costoFidelidad || ''
  })
  const [errores, setErrores] = useState({})

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const nuevosErrores = {}
    if (formData.descuento === '')
      nuevosErrores.descuento = 'El campo descuento es obligatorio'
    if (formData.costoFidelidad === '')
      nuevosErrores.costoFidelidad = 'El campo costo fidelidad es obligatorio'

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    try {
      await editarDescuento({
        id: formData.id,
        descuento: parseFloat(formData.descuento),
        costoFidelidad: parseFloat(formData.costoFidelidad)
      })
      onGuardar()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>
          Editar Descuento
        </h2>

        <label className='block text-sm text-gray-700 mb-1'>
          Descuento (ej: 0.06)
        </label>
        <input
          type='number'
          step='0.01'
          name='descuento'
          className='w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='0.05'
          value={formData.descuento}
          onChange={handleChange}
        />
        {errores.descuento && (
          <p className='text-red-500 text-sm mb-2'>{errores.descuento}</p>
        )}

        <label className='block text-sm text-gray-700 mb-1'>
          Costo Fidelidad
        </label>
        <input
          type='number'
          name='costoFidelidad'
          className='w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='150'
          value={formData.costoFidelidad}
          onChange={handleChange}
        />
        {errores.costoFidelidad && (
          <p className='text-red-500 text-sm mb-2'>{errores.costoFidelidad}</p>
        )}

        <div className='flex justify-end gap-2 mt-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded text-sm text-gray-700 border border-gray-300 hover:bg-gray-100'
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 rounded text-sm text-white bg-indigo-600 hover:bg-indigo-500'
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}

const Descuento = () => {
  const { data: descuentos, refresh } = useFetchData(
    mostrarDescuentos,
    extractDescuentos
  )
  const crearModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()
  const successModal = useModal()

  const [descuentoActual, setDescuentoActual] = useState(null)

  // Función para manejar eliminación
  const handleDelete = async () => {
    if (!descuentoActual) return
    try {
      console.log(descuentoActual.id)
      await eliminarDescuento(descuentoActual.id)

      refresh()
      successModal.open()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='max-w-screen-xl mx-auto px-4 mt-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-2xl font-bold text-gray-800'>
          Gestión de Descuentos
        </h3>
        <button
          onClick={() => crearModal.open()}
          className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500'
        >
          Crear Descuento
        </button>
      </div>

      <div className='overflow-x-auto rounded shadow border'>
        <table className='min-w-full divide-y divide-gray-200 text-left text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3'>ID</th>
              <th className='px-6 py-3'>Descuento</th>
              <th className='px-6 py-3'>Costo Fidelidad</th>
              <th className='px-6 py-3 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {descuentos.map((d) => (
              <tr key={d.id} className='odd:bg-white even:bg-gray-50'>
                <td className='px-6 py-4'>{d.id}</td>
                <td className='px-6 py-4'>{d.descuento}</td>
                <td className='px-6 py-4'>{d.costoFidelidad}</td>
                <td className='px-6 py-4 text-right space-x-2'>
                  <button
                    onClick={() => {
                      setDescuentoActual(d)
                      editModal.open()
                    }}
                    className='text-indigo-600 hover:text-indigo-500'
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setDescuentoActual(d)
                      deleteModal.open()
                    }}
                    className='text-red-600 hover:text-red-500'
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {descuentos.length === 0 && (
              <tr>
                <td colSpan='4' className='px-6 py-4 text-center text-gray-500'>
                  No hay descuentos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {crearModal.isOpen && (
        <ModalCrearDescuento
          isOpen={crearModal.isOpen}
          onClose={crearModal.close}
          onGuardar={() => {
            crearModal.close()
            refresh()
            successModal.open()
          }}
          Request={crearDescuento}
        />
      )}

      {editModal.isOpen && (
        <ModalEditarDescuento
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          descuento={descuentoActual}
          onGuardar={() => {
            editModal.close()
            refresh()
            successModal.open()
          }}
        />
      )}

      {deleteModal.isOpen && (
        <ModalDelete
          setIsOpen={deleteModal.toggle}
          message={`¿Seguro que quieres eliminar el descuento con ID ${descuentoActual?.id}?`}
          refresh={() => {
            deleteModal.close()
            refresh()
            successModal.open()
          }}
          handleDelete={handleDelete}
        />
      )}

      {successModal.isOpen && (
        <SuccessModal
          setIsOpen={successModal.toggle}
          message='Operación realizada con éxito'
          refresh={refresh}
        />
      )}
    </div>
  )
}

export default Descuento
