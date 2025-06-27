import { Outlet } from 'react-router'
import SideBar from '../components/AdminDashboard/SideBar'
import { useAuth } from '@/context/AuthContext'

export const DashboardPage = () => {
  const { user } = useAuth()
  if (user && user.user.rol !== 1) {
    return <h1 className='text-center text-2xl font-bold'>No tienes
      permisos para acceder a esta página</h1>
  }
  return (
    <div className='flex md:flex-row flex-col gap-2'>
      <SideBar />
      <div className='flex-1 justify-center items-center w-full p-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardPage
