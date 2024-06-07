import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../useSession'
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
  async function handleLogOut () {
    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.log(error)
    }
  }
  
  return (
      <button type='button' className='btn ' id="navbutton" onClick={handleLogOut}><span className='nav-dev'>log</span>out</button>
  )
}

function NavBar() {
  let navigate = useNavigate()
  const { session } = useSession()


  return (
    <div className='NavBar'>
      <h4>NavBar</h4>
      
      {session 
        ? <LogoutButton />
        : <RegisterButton /> 
      }
    </div>
  )
}

export default NavBar