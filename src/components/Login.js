import { useEffect, useRef, useState  } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const userRef = useRef()
  const errRef = useRef()

  const [username, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [errMessage, setErrMessage] = useState('')

  useEffect(() => {
    setErrMessage('')
  }, [username, password])

  return (
    <section>
      <h1>Sign In</h1>
      <form>
        <label>Username:</label>
        <input 
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={username}
          required
        />

        <label>Password</label>
        <input 
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button>Sign In</button>

      </form>
      <p>
        Need an Account? <br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  )
}

export default Login