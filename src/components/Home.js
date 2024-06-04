import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import supabaseClient from "../supabaseClient";

function Home() {
  const navigate = useNavigate();
  const [dis, setDis] = useState('')

  const logout = async () => {
    navigate('/linkpage');
  }

  function getPromise(URL) {
    let promise = new Promise(function (resolve, reject) {
      let req = new XMLHttpRequest();
      req.open("GET", URL);
      req.onload = function () {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject("There is an Error!");
        }
      };
      req.send();
    });
    return promise;
  }

  function getSupaPromise () {
    let promise = new Promise(function (resolve, reject) {
      supabaseClient
        .from("testable")
        .insert([
          {
            name: "Quincy",
            numbe: 39
          }
        ])
    })
    return promise;
  }

  async function doPromise () {
    try {
      const response = await supabaseClient
        .from("testtable")
        .insert({
          name: "z time", numbe: 39
        })

        const data = await response
        console.log('data',data)
        return data
    } catch (error) {
      console.error(error)
    }
  }

  let sp = doPromise()

  const con = () => {
    sp.then(result => {
      let res = result
      return res
    }).catch(error => {
      console.log('In the catch', error)
    })
  }

  const ALL_POKEMONS_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50';

  let promise = getPromise(ALL_POKEMONS_URL);

  const consumer = () => {
    promise.then(result => {
      let onePokemon = JSON.parse(result).results[0].url;
      return onePokemon;
    }).then(onePokemonURL => {
        console.log(onePokemonURL);
        return getPromise(onePokemonURL);
    }).then(pokemon => {
        console.log(JSON.parse(pokemon));
    }).catch(error => {
        console.log('In the catch', error);
    });
  }

  const supaPromise = getSupaPromise()

  const supaConsumer = () => {
    supaPromise.catch(error => console.log(error))
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
          <button onClick={con}>Set Dis</button>
        </div>
      </div>
    </section>
  )
}

export default Home