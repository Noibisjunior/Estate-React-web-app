import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export  function useAuthStatus() {
  const [loggedIn,setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => { //for one-time rendering
    const auth = getAuth()
    console.log(auth);
    onAuthStateChanged(auth,(user) => {
      if(user){
        setLoggedIn(true)
      }
      setCheckingStatus(false)
    })
  }, [])
  return {loggedIn ,checkingStatus}
}
//note if you are returning two state,dont export the function as a default