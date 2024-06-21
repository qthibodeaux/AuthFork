import { useState } from "react"
import {Box, Button, Form, FormField, Heading, TextInput} from "grommet"
import { useNavigate } from "react-router-dom"

function Register () {
  const defaultValue = { email: "" }
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    alert("Check your email for the login link!")
    setLoading(false)
  }

  const goHome = () => {
    navigate("/")
  }

  return (
    <Box>
      <Box margin={{ vertical: 'xlarge'}} pad='large'>
        <Heading textAlign='center'>Enter your email to get a link to sign in</Heading>
      </Box>
      <Box
        pad='large'
      >
        <Form
          value={value}
          
          onChange={(nextValue) => {
            setValue(nextValue)
          }}
          
          onReset={() => setValue(defaultValue)}
          
          onSubmit={handleLogin}
        >
          <FormField name="email" htmlFor="text-input-id" label="Email" required>
            <TextInput id="text-input-id" name="email" />
          </FormField>
          <Box direction="row" justify="between" margin={{ top: "medium" }} pad="small" >
            <Button label="Cancel" onClick={goHome} />
            <Button type="reset" label="Reset" />
            {loading ? <Button type="submit" label="Loading" disabled={loading} /> : <Button type="submit" label="Submit" primary />}
          </Box>
        </Form>
        <Box margin={{ vertical: 'xlarge'}} pad='large'>
          <Heading textAlign='center' level='3'>The email will be tied to your profile.</Heading>
      </Box>
      </Box>
    </Box>
  )
}

export default Register