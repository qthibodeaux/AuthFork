import { useParams } from "react-router-dom"

function NestTwo() {
  const { nest, nestTwo } = useParams()
  return (
    <div>
      <h1>NestTwo</h1>
      Nest {nest}
      NestTwo {nestTwo}
    </div>
  )
}

export default NestTwo