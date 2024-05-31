import { createContext, useContext, useEffect, useState } from "react";
import supabaseClient from "./supabaseClient";

const AuthContext = createContext()

export function useSession () {
    const [userInfo, setUserInfo] = useState({
        profile: null,
        session: null
    })

    const [channel, setChannel] = useState(null)

    useEffect(() => {
        supabaseClient.auth.getSession()
            .then(({ data: { session } }) => {
                setUserInfo({ ...userInfo, session })
                supabaseClient.auth.onAuthStateChange( (_event, session) => {
                    setUserInfo( {session, profile: null})
                })
            })
    }, [])

    useEffect(()=> {
        if (userInfo.session?.user && !userInfo.profile) {
            listenToUserProfileChanges(userInfo.session.user.id)
                .then(
                    (newChannel) => {
                        if (channel) {
                            channel.unsubscribe()
                        }
                        setChannel(newChannel)
                    }
                )
        } else if (!userInfo.session?.user) {
            channel?.unsubscribe()
            setChannel(null)
        }
    },[userInfo.session])

    async function listenToUserProfileChanges (userId) {
        const { data } = await supabaseClient
            .from("user_profiles")
            .select("*")
            .filter("user_id", "eq", userId)
        if (data?.[0]) {
            setUserInfo({ ...userInfo, profile: data?.[0] })
        }

        return supabaseClient
            .channel(`public:user_profiles`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_profiles",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setUserInfo({ ...userInfo, profile: payload.new })
                }
            )
            .subscribe()
    }

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