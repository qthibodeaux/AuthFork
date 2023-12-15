import { useParams } from "react-router-dom"

function Nest() {
  const { nest } = useParams()

  return (
    <div>
      Nest
      {nest}
    </div>
  )
}

export default Nest