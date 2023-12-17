import { useLocation, Navigate, Outlet } from "react-router-dom"

function RequireAuth ({ allowedRoles }) {
    const location = useLocation()
    const auth = 
    { 
        roles: [1984, 5150], 
    }
  return (
    <div>
      req
      {allowedRoles}
      {auth.roles}
      {auth.user}
      {
        auth?.roles?.find(role => allowedRoles?.includes(role)) 
          ? <Outlet />
          : auth?.user 
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />
      }
    </div>
  )
}

export default RequireAuth