import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import supabaseClient from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../useSession'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export const setReturnPath = () => {
  localStorage.setItem("returnPath", window.location.pathname)
}

function Register () {
  const { profile, session } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    console.log(profile)
    if (profile) {
      navigate("../success")
      console.log("profile: "+ profile)
      console.log("session: " + session)
    }
  }, [profile])

  return (
    <section>
      <div>
        <Auth 
          supabaseClient={supabaseClient}
          appearance={{ 
            style: {
              button: { background: 'white', color: 'black', padding: '.25rem', borderRadius: '.5rem', fontSize: '22px', fontFamily: 'Nunito, sans-serif' },
              anchor: { color: 'white' },
              input: { padding: '.5rem', borderRadius: '.5rem' },
              message: { color: 'red' },
              label: { color: 'black', marginTop: '1rem', fontSize: '22px' }
            }
          }}
          providers={['google']}
        />
      </div>
    </section>
  )
}


export default Register