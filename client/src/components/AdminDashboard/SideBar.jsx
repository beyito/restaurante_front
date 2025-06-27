import {
  UsersIcon,
  ComputerDesktopIcon,
  ArchiveBoxIcon,
  ArrowLeftStartOnRectangleIcon,
  LockClosedIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BookOpenIcon,
  BanknotesIcon,
  FolderOpenIcon,
  TruckIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

import { NavLink } from 'react-router'
import { logoutRequest } from '@/api/auth'
import { useState, useEffect } from 'react'
import { getInventarioBajo } from '@/api/inventario'

const SideBar = ({ setActiveTab }) => {
  const [isOpen, setIsOpen] = useState({
    user: false,
    inventory: false,
    menu: false,
    ventas: false,
    pedidos: false
  })
  const [sidebarOpen, setSidebarOpen] = useState(false) // Sidebar móvil
  const [stockCritico, setStockCritico] = useState([])

  useEffect(() => {
    async function fetchStockCritico() {
      try {
        const response = await getInventarioBajo()
        setStockCritico(response.data.productosConStockBajo) // o response si ya es el array
      } catch (error) {
        console.error('Error al obtener inventario bajo:', error)
      }
    }

    fetchStockCritico()
  }, [])
  console.log(stockCritico)
  const cantidadNotificaciones = stockCritico.length
  return (
    <>
      {/* Mobile menu button */}
      <div className='md:hidden p-4 bg-[#171717] text-white flex items-center justify-between'>
        <h1 className='text-sm font-bold'>Restaurante</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <XMarkIcon className='w-6 h-6' />
          ) : (
            <Bars3Icon className='w-6 h-6' />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 w-72 bg-gradient-to-b from-[#162a3f] to-[#171717]
      text-white p-6 flex flex-col
        transform transition-transform duration-300 z-50
        h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        `}
      >
        {/* SidebarHeader */}
        <div
          className='flex gap-4 items-center border-b border-[#3a4b58] pb-6'
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <img
            src='https://png.pngtree.com/png-clipart/20220921/ourmid/pngtree-fire-logo-png-image_6209600.png'
            alt='Logo'
            className='w-10 h-10'
          />
          <h1 className='text-xl font-bold text-[#f8f9fa] tracking-wide'>
            Restaurante
          </h1>
        </div>

        {/* SidebarContent */}
        <div className='mt-6 overflow-y-automt-6 overflow-y-auto flex-1 pr-2 custom-scrollbar'>
          <label className='uppercase mb-4 block text-gray-400 text-xs font-semibold'>
            Secciones
          </label>

          <div className='space-y-5'>
            <h2 className='flex items-center gap-4 text-lg font-medium text-[#b0bec5] hover:text-[##615FFF] cursor-pointer transition-all duration-300'>
              <ComputerDesktopIcon className='w-8 h-8' />
              Dashboard
            </h2>

            <h2
              className='flex items-center gap-4 text-lg font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer transition-all duration-300'
              onClick={() => setIsOpen({ ...isOpen, user: !isOpen.user })}
            >
              <UsersIcon className='w-8 h-8' />
              Gestionar Usuarios
            </h2>

            {isOpen.user && (
              <div className='ml-8'>
                <NavLink
                  to='/dashboard/usuarios'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                >
                  <UserIcon className='w-8 h-8' />
                  Usuarios
                </NavLink>
                <NavLink
                  to='/dashboard/cliente'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${
                      isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <ClipboardDocumentCheckIcon className='w-8 h-8' />
                  Puntos de Fidelidad
                </NavLink>
                {/* <h2 className='flex items-center gap-4 text-sm font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer transition-all duration-300 mt-2'>
                  <UserIcon className='w-8 h-8' />
                  Empleados
                </h2>

                <h2 className='flex items-center gap-4 text-sm font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer transition-all duration-300 mt-2'>
                  <UserIcon className='w-8 h-8' />
                  ClienteWeb
                </h2> */}
                <NavLink
                  to='/dashboard/roles'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <ClipboardDocumentCheckIcon className='w-8 h-8' />
                  Roles y Permisos
                </NavLink>
              </div>
            )}

            <h2
              className='flex items-center gap-4 text-lg font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer transition-all duration-300'
              onClick={() => setIsOpen({ ...isOpen, menu: !isOpen.menu })}
            >
              <BookOpenIcon className='w-8 h-8' />
              Gestión de Menú
            </h2>
            {isOpen.menu && (
              <div className='ml-8'>
                <NavLink
                  to='/dashboard/menu'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <BookOpenIcon className='w-8 h-8' />
                  Gestionar menú
                </NavLink>
                <NavLink
                  to='/dashboard/ingrediente'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <ShoppingBagIcon className='w-8 h-8' />
                  Gestionar Ingredientes
                </NavLink>
              </div>
            )}
            <h2
              className='flex items-center justify-between gap-4 text-lg font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer transition-all duration-300'
              onClick={() =>
                setIsOpen({ ...isOpen, inventory: !isOpen.inventory })
              }
            >
              <div className='flex items-center gap-3 relative'>
                <ArchiveBoxIcon className='w-8 h-8' />
                <span>Gestión de Inventario</span>

                {/* Badge */}
                {cantidadNotificaciones > 0 && (
                  <span className='absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
                    {'!'}
                  </span>
                )}
              </div>
            </h2>

            {isOpen.inventory && (
              <div className='ml-8'>
                <NavLink
                  to='/dashboard/proveedores'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <UserGroupIcon className='w-8 h-8' />
                  Gestionar Proveedores
                </NavLink>
                <NavLink
                  to='/dashboard/inventario'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <FolderOpenIcon className='w-8 h-8' />
                  Gestionar Inventario
                  {cantidadNotificaciones > 0 && (
                    <span className='bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
                      {cantidadNotificaciones}
                    </span>
                  )}
                </NavLink>
              </div>
            )}
            {/* Gestión de Ventas */}
            <h2
              className='flex items-center gap-4 text-lg font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer transition-all duration-300'
              onClick={() => setIsOpen({ ...isOpen, ventas: !isOpen.ventas })}
            >
              <BanknotesIcon className='w-8 h-8' />
              Gestión de Ventas
            </h2>

            {isOpen.ventas && (
              <div className='ml-8'>
               <NavLink
                to='/dashboard/reporte'
                className={({ isActive }) =>
                  `flex items-center gap-4 text-sm font-medium mt-2 transition-all duration-300 ${
                    isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                  } hover:text-[#615FFF]`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FolderOpenIcon className='w-8 h-8' />
                Generar Reporte
              </NavLink>
                <NavLink
                  to='/dashboard/tickets'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <DocumentTextIcon className='w-8 h-8' />
                  Emitir tickets
                </NavLink>

                <NavLink
                  to='/dashboard/descuentos'
                  className={({ isActive }) =>
                    `flex items-center gap-4 text-sm font-medium ${
                      isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
                    } hover:text-[#615FFF] transition-all duration-300 mt-2`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <DocumentTextIcon className='w-8 h-8' />
                  Gestionar Descuentos
                </NavLink>

              </div>
            )}

            
          </div>
          <NavLink
            to='/dashboard/recetas'
            className={({ isActive }) =>
              `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
              } hover:text-[#615FFF] transition-all duration-300 mt-2`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <ClipboardDocumentCheckIcon className='w-8 h-8' />
            recetas
          </NavLink>

          <NavLink
            to='/dashboard/bitacora'
            className={({ isActive }) =>
              `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
              } hover:text-[#615FFF] transition-all duration-300 mt-2`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <ClipboardDocumentListIcon className='w-8 h-8' />
            <h2 className='flex items-center gap-4 text-sm font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer'>Bitácora</h2>
          </NavLink>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `flex items-center gap-4 text-sm font-medium ${isActive ? 'text-[#615FFF]' : 'text-[#b0bec5]'
              } hover:text-[#615FFF] transition-all duration-300 mt-2`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <UserCircleIcon className='w-8 h-8' />
            <h2 className='flex items-center gap-4 text-sm font-medium text-[#b0bec5] hover:text-[#615FFF] cursor-pointer'>Modo Cliente</h2>
          </NavLink>
        </div>

        {/* SidebarFooter */}
        <div className='mt-auto pt-6 border-t border-[#3a4b58]'>
          <button
            className='flex items-center gap-3 text-xl text-red-500 hover:text-red-400 font-semibold transition-all duration-300'
            onClick={() => {
              setSidebarOpen(false);// Cierra sidebar en móvil
              logoutRequest()
            }}
          >
            <NavLink to='/login' className='flex items-center gap-3 text-xl text-red-500 hover:text-red-400 font-semibold transition-all duration-300'>
              <ArrowLeftStartOnRectangleIcon className='w-8 h-8' />
              Cerrar sesión
            </NavLink>
          </button>
        </div>
      </div>
    </>
  )
}

export default SideBar
