import { useEffect, useRef, useState  } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import supabaseClient from '../supabaseClient'

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

  const [userInfo, setUserInfo] = useState({
    profile: null,
    session: null
  })
  const [data, setData] = useState(null)

  const sessionFunction = async () => {
    await supabaseClient.auth.getSession()
      .then(({ data: { session } }) => {
          setUserInfo({ ...userInfo, session })
          console.log("Session data"+userInfo)
      })
  }

  const getData = async () => {
    const {data, error} = await supabaseClient
      .from('countries')
      .select()

      if (error) {
        console.error("error retrieving session", error)
      } else {
        setData(data)
        console.log("Data: ", data)
      }
  }

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

      <div>
        hello
        <button onClick={sessionFunction}>Get Session</button>
        {userInfo 
          ? "true"
          : "false"
        }
      </div>
      <div>
        data
        <button onClick={getData}>Get Session</button>
        {data 
          ? "true"
          : "false"
        }
      </div>
    </section>
  )
}

export default Login