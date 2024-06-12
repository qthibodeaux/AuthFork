import { useState } from "react"
import { useSession } from "../useSessionOne"
import supabaseClient from "../supabaseClient"

function Welcome () {
    const [userName, setUserName] = useState("")
    const { session, profile } = useSession()
    const [serverError, setServerError] = useState("");

    
    async function getAuthUser () {
        const { data: user, error } = await supabaseClient.auth.getUser()
        if (error) {
            console.error(error)
        } else if (!user) {
            console.log('User does exist')
        } else {
            console.log("User Id",user.id)
            return user.id
        }
    }

    async function setUserNam  () {
        try {
            const { data, error } = await supabaseClient
            .from('profiles')
            .update({ username: userName })
            .eq('id', session.user.id)
            .select()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    async function welcomeSet (username) {
        const getUser = await getAuthUser()
        await setUserNam(getUser, username)
        console.log("completed")
    }
    
    


    const getUser = () => {
        console.log( "Getting user", session.user )
    }

  return (
    <section>
        <h2>Welcome!</h2>
        <p>Let's create a username</p>
        <form
            onSubmit={setUserNam}
                
        >
            <input
                name="userName"
                onChange={({ target }) => {
                    setUserName(target.value)
                }}
            ></input>
            <p>{userName && userName}</p>
            <button
                type="submit"
            >
                Submit
            </button>
        </form>
        <div>
            Get User
            <button onClick={getUser}>Get user</button>
        </div>
    </section>
  )
}

export default Welcome