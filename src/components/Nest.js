import { useParams } from "react-router-dom"
import { useState } from "react"
import supabaseClient from '../supabaseClient'

function Nest() {
  const { nest } = useParams()

  const [sess, setSess] = useState(null)
  const [data, setData] = useState(null)

  const getSession = async () => {
    const {data, error} = await supabaseClient.auth.getSession()
    if (error) {
      console.error("error retrieving session", error)
    } else {
      setSess(data.session)
      console.log("Session: ", data.session)
    }
  }

  const getData = async () => {
    const {data, error} = await supabaseClient
      .from('user_profiles')
      .select()

      if (error) {
        console.error("error retrieving session", error)
      } else {
        setData(data.session)
        console.log("Session: ", data.session)
      }
  }

  return (
    <div>
      Nest
      {nest}
      <div>
        <div>
          
        </div>
        <div>2</div>
      </div>
      <div>
        hello
        <button onClick={getSession}>Get Session</button>
        {sess 
          ? "true"
          : "false"
        }
      </div>
      <div>
        data
        <button onClick={getData}>Get Data</button>
        {data 
          ? "true"
          : "false"
        }
      </div>
    </div>
  )
}

export default Nest