import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import supabaseClient from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export const setReturnPath = () => {
  localStorage.setItem("returnPath", window.location.pathname)
}

function Register () {
  const [authMode, setAuthMode] = useState("sign_in")
  const { sess } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (sess?.user) {
      navigate("../")
    }
  }, [sess])

  return (
    <section>
      <div>
        <Auth 
          supabaseClient={supabaseClient}
          appearance={{ 
            theme: ThemeSupa,
          }}
          view={authMode}
        />
      </div>
    </section>
  )
}

/*
{
            style: {
              button: { background: 'white', color: 'black', padding: '.5rem', borderRadius: '.5rem' },
              anchor: { color: 'white' },
              input: { padding: '.5rem', borderRadius: '.5rem' },
              message: { color: 'red' }
            }
          }
*/

export default Register