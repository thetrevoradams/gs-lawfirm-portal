import { useState, useEffect } from 'react'
import auth from './firebase'

const useUser = () => {
  const [user, setUser] = useState('loading')
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => setUser(userAuth))
    return () => unsubscribe()
  }, [])
  return { user }
}

export default useUser
