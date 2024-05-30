import { useParams } from "react-router-dom"
import { useState } from "react"
import supabaseClient from '../supabaseClient'
import { useAuth } from "../useAuth"

function Nest() {
  const { nest } = useParams()

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      console.log(session)
    }
    catch (error) {
      console.error('Error fetching object:', error);
    }
  };

  const sessionFunction = async () => {
    const response = await supabaseClient.auth.getSession()
    const data = await response.json()
    return data
  }

  return (
    <div>
      Nest
      {nest}
      <div>
      <h1>Fetch Data on Button Click</h1>
      <button onClick={handleButtonClick}>Fetch Data</button>
      
    </div>
    </div>
  )
}

export default Nest