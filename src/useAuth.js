import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseClient from "./supabaseClient"

const AuthContext = createContext()

export function useAuth () {
    const [profile, setProfile] = useState(null)
    const [sess, setSess] = useState(null)
    const [channel, setChannel] = useState(null)
    const navigate = useNavigate()
    
    useEffect(() => {
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        setSess(session)
      })

      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setSess(session)
      })
      
      return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
      if (sess?.user && !profile) {
        listenToUserProfileChanges(sess.user.id)
          .then(
            (newChannel) => {
              if (channel) {
                channel.unsubscribe()
              }
              setChannel(newChannel)
            }
          )
      } else if (!sess?.user) {
        channel?.unsubscribe()
        setChannel(null)
      }
    }, [sess])

    async function listenToUserProfileChanges (userId) {
      const { data } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .filter("user_id", "eq", userId)
      if (data?.[0]) {
        setProfile(data?.[0])
      } else {
        navigate("/success")
      }

      return supabaseClient
        .channel('public:user_profiles')
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_profiles",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            setProfile(payload)
          }
        )
        .subscribe()
    }

  return {
    profile,
    sess
  }
}

export function AuthProvider ({ children }) {
    const auth = useAuth()

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export default function AuthConsumer () {
    return useContext(AuthContext)
}