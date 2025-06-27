import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

const ClienteModal = ({ isOpen, onClose, clienteData, onEditarPuntos }) => {
  const [cliente, setCliente] = useState({});
  const [nuevoPuntos, setNuevoPuntos] = useState(0);

  useEffect(() => {
    setCliente(clienteData || {});
    setNuevoPuntos(clienteData?.puntosFidelidad || 0);
  }, [clienteData]);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value);
    setNuevoPuntos(isNaN(val) ? 0 : val);
  };

  const handleSave = () => {
    onEditarPuntos( {...cliente}, nuevoPuntos );
    onClose();
  };

  const handleAjuste = (delta) => {
    setNuevoPuntos((prev) => Math.max(0, prev + delta));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-full max-w-md shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-4">Editar Puntos de Fidelidad</Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre Usuario</label>
              <input
                type="text"
                name="nombreUsuario"
                value={cliente.nombreUsuario || ''}
                onChange={handleChange}
                disabled
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

           

            <div>
              <label className="block text-sm font-medium">Puntos Fidelidad</label>
              <div className="flex items-center space-x-2 mt-1">
                <Button onClick={() => handleAjuste(-10)} variant="outline">-10</Button>
                <input
                  type="number"
                  value={nuevoPuntos}
                  onChange={handleInputChange}
                  className="w-20 text-center border rounded p-1"
                />
                <Button onClick={() => handleAjuste(10)} variant="outline">+10</Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={onClose} variant="secondary">Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ClienteModal;
