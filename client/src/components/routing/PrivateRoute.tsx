import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../hooks'

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  if (!isAuthenticated && !loading) {
    return <Navigate to='/login' />
  }
  return <Outlet />
}

export default PrivateRoute
