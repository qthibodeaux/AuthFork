import { useContext, useEffect, useState } from "react";
import supabaseClient from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export function useSupa () {
  const [session, setSession] = useState(null)
  useEffect(() => {
    const subscription = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSession(null)
        } else if (session) {
          setSession(session)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, []) 
}