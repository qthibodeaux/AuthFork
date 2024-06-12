import { createContext, useContext, useEffect, useState } from "react";
import supabaseClient from "./supabaseClient";

const AuthContext = createContext()

export function useSession () {
    const [userInfo, setUserInfo] = useState({
        profile: null,
        session: null
    })

    useEffect(() => {
        supabaseClient.auth.getSession()
            .then(({ data: { session } }) => {
                setUserInfo({ ...userInfo, session })
            })

        supabaseClient.auth.onAuthStateChange((_event, session) => {
            setUserInfo({ ...userInfo, session })
        })
            
    }, [])

    return userInfo;
}

export function AuthProvider ({ children }) {
    const { profile, session } = useSession()

    return (
        <AuthContext.Provider value={{ profile, session }}>
            {children}
        </AuthContext.Provider>
    )
}

export default function AuthConsumer () {
    return useContext(AuthContext)
}