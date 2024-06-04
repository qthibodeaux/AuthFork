import { useLocation, Navigate, Outlet } from "react-router-dom"
import supabaseClient from '../supabaseClient'
import { useSession } from "../useSession"
import { profile, session } from '../useSession'

function RequireAuth ({ allowedRoles }) {
    const location = useLocation()

    const auth = 
    { 
        roles: [1984, 2021, 5150], 
    }

    const { profile } = useSession()

  return (
    <div>
      req
      {"allowed roles: " + allowedRoles}
      {"auth role: " + profile?.roles}
      {"auth user:" + profile?.user}
      {
        profile?.roles?.find(role => allowedRoles?.includes(role)) 
        ? "true"
        : "false"
      }
      {
        profile?.roles?.find(role => allowedRoles?.includes(role)) 
          ? <Outlet />
          : profile?.user 
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/register" state={{ from: location }} replace />
      }
    </div>
  )
}

export default RequireAuth