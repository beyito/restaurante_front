import { Outlet } from 'react-router'
import { MeseroHeader } from '@/components/mesero/MeseroHeader'
import { useAuth } from '@/context/AuthContext'

export default function LayoutMesero() {
  const { isAuthenticated, user, signOut } = useAuth()
  return (
    <>
      <MeseroHeader
        isAuthenticated={isAuthenticated}
        user={user}
        signOut={signOut}
      />
      <main>
        <Outlet />
      </main>
    </>
  )
}
