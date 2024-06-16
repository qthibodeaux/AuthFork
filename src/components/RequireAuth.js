import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSession } from "../useSessionOne"

function RequireAuth ({ allowedRoles }) {
    const location = useLocation()

    const auth = 
    { 
        roles: [1984, 2021, 5150], 
    }

    const { profile, session } = useSession()

  return (
    <div>
      req
      
      {
        !session
          ? <Navigate to="/register" state={{ from: location }} replace /> 
          : profile?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : <Navigate to="/unauthorized" state={{ from: location }} replace />
      }
    </div>
  )
}

export default RequireAuth

/*
{"allowed roles: " + allowedRoles}
      {"auth role: " + profile?.roles}
      {"auth user:" + profile?.user}
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

*/