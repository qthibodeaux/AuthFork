import { useLocation, Navigate, Outlet } from "react-router-dom"
import supabaseClient from '../supabaseClient'
import { useAuth } from "../useAuth"

function RequireAuth ({ allowedRoles }) {
    const location = useLocation()

    const auth = 
    { 
        roles: [1984, 5150, 2001], 
    }

    const { sess } = useAuth()

  return (
    <div>
      req
      {allowedRoles}
      {auth.roles}
      {auth.user}
      {sess + " sess "}
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