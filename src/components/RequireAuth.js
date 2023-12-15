import { useLocation, Navigate, Outlet } from "react-router-dom"

function RequireAuth ({ allowedRoles }) {
    const location = useLocation()
    const auth = 
    { 
        roles: [5150], 
        user: 'User'
    }
  return (
    auth?.roles?.find(role => allowedRoles?.includes(role))
        ? <Outlet />
        : auth?.user   
        ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        : <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth