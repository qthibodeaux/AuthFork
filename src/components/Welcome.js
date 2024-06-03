import { useContext, useMemo, useState } from "react"
import { redirect, useNavigate } from "react-router-dom"
import { useSession } from "../useSession"
import supabaseClient from "../supabaseClient"

export async function welcomeLoader () {
    const { data: { user } } = await supabaseClient.auth.getUser()
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
    return user
}

export function Welcome () {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const { session } = useSession()
    const [serverError, setServerError] = useState("");

  return (
    <section>
        <h2>Welcome!</h2>
        <p>Let's create a username</p>
        <form
            onSubmit={(event) => {
                event.preventDefault()
                supabaseClient
                    .from("user_profiles")
                    .insert([
                        {
                            user_id: session?.user.id,
                            username: userName,
                            role: 2001
                        }
                    ])
                    .then(({ error }) => {
                        if (error) {
                            setServerError(`Username "${userName}" is already taken`)
                        } else {
                            const target =localStorage.getItem("returnPath") || "/"
                            localStorage.removeItem("returnPath")
                            navigate(target)
                        }
                    })
            }}
        >
            <input
                name="userName"
                placeHolder="Username"
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
    </section>
  )
}