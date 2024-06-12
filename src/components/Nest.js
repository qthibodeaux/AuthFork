import { useParams } from "react-router-dom"
import { useState } from "react"
import supabaseClient from '../supabaseClient'
import { useSession } from "../useSessionOne"

function Nest() {
  const { nest } = useParams()

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { session } = useSession()

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
    console.log(session)
  }

  return (
    <div>
      Nest
      {nest}
      <div>
      <h1>Fetch Data on Button Click</h1>
      <button onClick={sessionFunction}>Fetch Data</button>
      
    </div>
    </div>
  )
}

export default Nest