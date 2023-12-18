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
    </section>
  )
}

export default Login