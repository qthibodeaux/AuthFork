import { useState, createContext, useContext } from "react";

const authContext = createContext();

function useAut() {
  const [authentication, setauthentication] = useState(false)
  const [token, setToken] = useState()

  const saveToken = (userToken) => {
    setToken(userToken)
    sessionStorage.setItem('token', JSON.stringify(userToken))
  }

  return {
    authentication,
    setToken: saveToken,
    token,
    login() {
      return new Promise((res) => {
        setauthentication(true);
        res();
      });
    },
    logout() {
      return new Promise((res) => {
        setauthentication(false);
        sessionStorage.clear()
        res();
      });
    }
  };
}

export function AuthProvider({ children }) {
  const auth = useAut();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return useContext(authContext);
}
