import React, { useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { toast, Toaster } from 'sonner';
import {
  getClientRequest,
  aumentarPuntosFidelidadRequest,
  disminuirPuntosFidelidadRequest,
  editarPuntosFidelidadRequest
} from '../../api/user';
import ClienteModal from '../modals/ClienteModal';
import { useModal } from '../../hooks/useModal';
import { Button } from '../ui/button';

const extractClientes = (res) => res.data.clientes;

const ClientTable = () => {
  const { data: clientes, refresh } = useFetchData(getClientRequest, extractClientes);
  const editModal = useModal();
  const [currentCliente, setCurrentCliente] = useState(null);

  const handleAumentarPuntos = async (cliente, aumento) => {
    await aumentarPuntosFidelidadRequest(cliente.id, aumento);
    refresh();
    toast.success('Puntos de fidelidad actualizados correctamente');
  };

  const handleDisminuirPuntos = async (cliente, decremento) => {
    await disminuirPuntosFidelidadRequest(cliente.id, decremento);
    refresh();
    toast.success('Puntos de fidelidad actualizados correctamente');
  };

  const handleEditarPuntos = async (cliente, nuevoValor) => {
    await editarPuntosFidelidadRequest(cliente.id, nuevoValor);
    refresh();
    toast.success('Puntos de fidelidad actualizados correctamente');
  };

  return (
    <div className="p-4">
    <Toaster position="top-center" richColors toastOptions={{ className: 'animate-pulse' }} />
      <h2 className="text-xl font-bold mb-4">Clientes</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nombre Usuario</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Puntos Fidelidad</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="border-t">
              <td className="p-2 text-center">{cliente.nombreUsuario}</td>
              <td className="p-2 text-center">{cliente.nombre}</td>
              <td className="p-2 text-center">{cliente.puntosFidelidad}</td>
              <td className="p-2 space-x-2 text-center">
                <Button size="sm" onClick={() => handleDisminuirPuntos(cliente, 10)}>
                  -10
                </Button>
                <Button size="sm" onClick={() => handleAumentarPuntos(cliente, 10)}>
                  +10
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setCurrentCliente(cliente);
                    editModal.open();
                  }}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModal.isOpen && currentCliente && (
        <ClienteModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          clienteData={currentCliente}
          onEditarPuntos={handleEditarPuntos}
        />
      )}
    </div>
  );
};

export default ClientTable;