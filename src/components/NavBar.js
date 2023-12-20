import { Link } from 'react-router-dom'
import { useAuth } from '../useAuth'
import supabaseClient from '../supabaseClient'

function NavBar() {
  const { sess } = useAuth()

  return (
    <div className='NavBar'>
      <h4>NavBar</h4>
      {sess 
        ? <div>true</div>
        : <div>false</div>
      }
    </div>
  )
}

export default NavBar