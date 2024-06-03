import { useLocation, Navigate, Outlet } from "react-router-dom"
import supabaseClient from '../supabaseClient'
import { useAuth } from "../useAuth"
import { profile, session } from '../useSession'

function RequireAuth ({ allowedRoles }) {
    const location = useLocation()

    const auth = 
    { 
        roles: [1984, 2021, 5150], 
    }

    

  return (
    <div>
      req
      {"allowed roles: " + allowedRoles}
      {"auth role: " + auth.roles}
      {"auth user:" + auth.user}
      {
        auth?.roles?.find(role => allowedRoles?.includes(role)) 
        ? "true"
        : "false"
      }
      {
        auth?.roles?.find(role => allowedRoles?.includes(role)) 
          ? <Outlet />
          : auth?.user 
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/register" state={{ from: location }} replace />
      }
    </div>
  )
}

export default RequireAuth