import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import supabaseClient from "../supabaseClient";

function Home() {
  const navigate = useNavigate();
  const [dis, setDis] = useState('')

  const logout = async () => {
    navigate('/linkpage');
  }

  function con () {
    console.log('clicked')
  }

  async function setTable () {
    try {
      const { data, error } = await supabaseClient.from('testtable').insert({ name: 'Ashanti', numbe: 456 }).select()
      if (error) {
        console.error(error)
      } else {
        console.log(data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  async function getSession () {
    try {
      const { session, error } = await supab
    } catch (error) {
      
    }
  }

  return (
    <section>
      <h1>Home</h1>
      <br />
      <p>You are logged in!</p>
      <br />
      <Link to="/editor">Go to the Editor page</Link>
      <br />
      <Link to="/admin">Go to the Admin page</Link>
      <br />
      <Link to="/lounge">Go to the Lounge</Link>
      <br />
      <Link to="/linkpage">Go to the link page</Link>
      <br />
      <div>
        <button onClick={logout}>Sign Out</button>
      </div>

      <div>
        test promises
        <div>1</div>
        <div>
          {dis}
          <button onClick={setTable}>Set Dis</button>
        </div>
      </div>
    </section>
  )
}

export default Home