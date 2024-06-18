import { useState } from "react"
import { supabase } from "../supabaseClient"
import { Box, Button, Form, FormField, TextInput } from "grommet"
import { useNavigate } from "react-router-dom"
import { useSession } from "../useSession"


function MagicLink() {
  const defaultValue = { email: "" }
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.log('handle clicked')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: value.email,
      options: {
        emailRedirectTo: 'http://192.168.1.71:3000/welcome'
      }
    })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert("Check your email for the login link!")
    }

    setLoading(false)
  }

  const goHome = () => {
    navigate("/")
  }

  const cast = useSession()

  const handleButtonClick = async () => {
    /*try {
      const { data } =  await supabase.auth.getSession()
      console.log(data)
    }
    catch (error) {
      console.error('Error fetching object:', error);
    }*/
   console.log(cast)
  };

  return (
    <Box>
      Enter email for link
      <Form
        value={value}
        
        onChange={(nextValue, { touched }) => {
          console.log('change', nextValue, touched)
          setValue(nextValue)
        }}
        
        onReset={() => setValue(defaultValue)}
        
        onSubmit={handleLogin}
      >
        <FormField name="email" htmlFor="text-input-id" label="Email" required>
          <TextInput id="text-input-id" name="email" />
        </FormField>
        <Box direction="row" justify="between" margin={{ top: "medium" }} pad="small">
          <Button label="Cancel" onClick={goHome} />
          <Button type="reset" label="Reset" />
          {loading ? <Button type="submit" label="Loading" disabled={loading} /> : <Button type="submit" label="Submit" primary />}
        </Box>
      </Form>

        <Button label="Get Session" onClick={handleButtonClick}/>
    </Box>
  )
}

export default MagicLink