import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvide } from './context/AuthContext'
import DashboardRoutes from './routes/AdminRoutes'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedRoute } from './ProtectedRoute'
// import { Task } from './pages/task'
import { ReservaProvider } from './context/Reserva/ReservaProvider'
import MeseroPedidos from './components/mesero/Pedido'
import ClienteRoutes from './routes/ClienteRoutes'
import { RecetaProvider } from './context/Receta/RecetaProvider'
import Verificar from './pages/auth/Verificar'
import { BitacoraProvider } from './bitacora/context/BitacoraProvider'
import LayoutMesero from './Layouts/MeseroLayout'
import CocineroPage from './pages/cocinero/cocinero'
import { DescuentoProvider } from './context/Descuento/DescuentoProvider'
import RegisterPage from './pages/RegisterPage'

//import { BitacoraPage } from './bitacora/pages/BitacoraPage'
// import MeseroPedidos from './components/mesero/Pedido'

export default function App() {
  // todas las rutas hijas tendran el contexto
  return (
    <AuthProvide>
      <BrowserRouter>
        <ReservaProvider>
          <RecetaProvider>
            <BitacoraProvider>
              <DescuentoProvider>
                <Routes>
                  <Route path='/profile' element={<ProfilePage />} />
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/mesero' element={<MeseroPedidos />} />
                  <Route element={<LayoutMesero />}>
                    <Route path='/mesero' element={<MeseroPedidos />} />
                  </Route>
                  <Route path='/cocinero' element={<CocineroPage />} />
                  <Route element={<ProtectedRoute />}>
                    {DashboardRoutes()}
                  </Route>
                  <Route path='/verificar' element={<Verificar />} />
                  {ClienteRoutes()}
                </Routes>
              </DescuentoProvider>
            </BitacoraProvider>
          </RecetaProvider>
        </ReservaProvider>
      </BrowserRouter>
    </AuthProvide>
  )
}
