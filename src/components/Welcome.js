import { useContext, useMemo, useState } from "react"
import { redirect, useNavigate } from "react-router-dom"
import { useSession } from "../useSession"
import supabaseClient from "../supabaseClient"

export async function welcomeLoader () {
    /*const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
        return redirect("/")
    } 
    const { data } =  await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single()
    if (data?.username) {
        return redirect("/")
    }
    return user*/
    return "yes"
}

export function Welcome () {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const { session } = useSession()
    const [serverError, setServerError] = useState("");

    async function getAuthUser () {
        const { data: user, error } = await supabaseClient.auth.getUser()
        if (error) {
            console.error(error)
        } else if (!user) {
            console.log('User does exist')
        } else {
            console.log(user)
            return user.id
        }
    }

    async function setUserNam  (userId, username) {
        const { error } = await supabaseClient
            .from('user_profiles')
            .insert(([
                {
                    user_id: userId,
                    username: username
                }
            ]))
            .then(({ error }) => {
                if (error) {
                    setServerError(`Username "${userName}" is already taken`)
                } 
            })
    }

    async function welcomeSet (username) {
        const getUser = await getAuthUser()
        await setUserNam(getUser, username)
        console.log("completed")
    }


    const getUser = () => {
        console.log(session)
    }

  return (
    <section>
        <h2>Welcome!</h2>
        <p>Let's create a username</p>
        <form
            onSubmit={(event) => {}}
                
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
            <button onClick={welcomeSet}>Get user</button>
        </div>
    </section>
  )
}

/*



*/