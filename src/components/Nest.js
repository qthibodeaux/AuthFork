import { useParams } from "react-router-dom"
import { useState } from "react"
import supabaseClient from '../supabaseClient'
import { useAuth } from "../useAuth"

function Nest() {
  const { nest } = useParams()

  const [data, setData] = useState(null)

  const { sess, profile } = useAuth()

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
        
        {sess 
          ? <div>"true" {sess?.user.id} </div>
          : "false"
        }
        {profile
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