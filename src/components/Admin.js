import { Link } from 'react-router-dom'

function Admin() {
  return (
    <section>
      <h1>Admin Page</h1>
      <br />
      <p>
        <div>
          Todo: Users Page
        </div>
        <div>
          <Link to="/">Home</Link>
        </div>
      </p>
    </section>
  )
}

export default Admin