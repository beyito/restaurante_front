import { Route } from 'react-router'
import { DashboardPage } from '../pages/DashboardPage'

import UserTable from '../components/AdminDashboard/UserTable'
import Rol from '../components/AdminDashboard/Rol'
import Menu from '../components/AdminDashboard/Menu'
import ProviderTable from '../components/AdminDashboard/Providers'
import Inventario from '../components/AdminDashboard/Inventario'
import TicketAdmin from '@/components/AdminDashboard/ticket'
import TicketPagados from '../components/AdminDashboard/Reporte'
import Ingrediente from '../components/AdminDashboard/Ingrediente'

import ClientTable from '../components/AdminDashboard/ClientTable'
import { RecetaPage } from '@/pages/recetas/RecetaPage'
import { BitacoraPage } from '@/bitacora/pages/BitacoraPage'
import { DescuentoPage } from '@/pages/descuento/DescuentoPage'

export default function DashboardRoutes() {
  return (
    <Route path='dashboard' element={<DashboardPage />}>
      <Route index element={<h2>Bienvenido al Sistema</h2>} />
      <Route path='usuarios' element={<UserTable />} />
      <Route path='roles' element={<Rol />} />
      <Route path='proveedores' element={<ProviderTable />} />
      <Route path='menu' element={<Menu />} />
      <Route path='recetas' element={<RecetaPage />} />
      <Route path='descuentos' element={<DescuentoPage />} />
      <Route path='inventario' element={<Inventario />} />
      <Route path='tickets' element={<TicketAdmin />} />
      <Route path='reporte' element={<TicketPagados />} />
      <Route path='ingrediente' element={<Ingrediente />} />
      <Route path='bitacora' element={<BitacoraPage />} />
      <Route path='cliente' element={<ClientTable />} />
    </Route>
  )
}
