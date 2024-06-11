import { useState } from 'react'
import supabaseClient from '../supabaseClient'

function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabaseClient.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }

    setLoading(false)
  }

  return (
    <section>
      <h1>Welcome</h1>
      <h4>Let's get your started.</h4>
      <h4>Sign in with your email. Click the link below to begin.</h4>

      <form onSubmit={handleLogin}>
        <div>
          <input 
            type='text'
            placeholder='Your email'
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
          <button disabled={loading}>
            {loading ? <span>Loading</span> : <span>Send link</span>}
          </button>
          {email}
        </div>
      </form>
    </section>
  )
}

export default Auth