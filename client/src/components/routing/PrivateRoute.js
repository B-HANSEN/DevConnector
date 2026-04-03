import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (!isAuthenticated && !loading) {
    return <Navigate to='/login' />
  }
  return <Outlet />
}

export default PrivateRoute
