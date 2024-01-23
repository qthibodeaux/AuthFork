import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import supabaseClient from '../supabaseClient'

function RegisterButton () {
  let navigate = useNavigate()
  
  return (
      <button 
          type="button" 
          className="btn"
          id="navbutton"
          onClick={() => {
              navigate('/register')
          }}
      >
          <span className='nav-dev'>register</span>
      </button>
  )
}

function LogoutButton () {
  const handleLogout = () => supabaseClient.auth.signOut()

  return (
      <button type='button' className='btn ' id="navbutton" onClick={handleLogout}><span className='nav-dev'>log</span>out</button>
  )
}

function NavBar() {
  const { sess } = useAuth()
  let navigate = useNavigate()


  return (
    <div className='NavBar'>
      <h4>NavBar</h4>
      {sess 
        ? <LogoutButton />
        : <RegisterButton /> 
      }
    </div>
  )
}

export default NavBar