import { navigate } from '@reach/router'
import auth from './firebase'

// *** Auth Services ***
// const postUserToken = async (token) => {
//   const resp = await fetch(`${process.env.BASE_URL}/api/auth`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ token }),
//   })
//   const postTokenResp = resp.json()
//   return postTokenResp
// }

const signIn = async (email, password) => {
  try {
    const authResp = await auth.signInWithEmailAndPassword(email, password)
    if (authResp?.user) {
      // const userToken = await authResp?.user.getIdToken()
      // const postResp = await postUserToken(userToken)
      // return postResp
    }
    return null
  } catch (error) {
    return { error }
  }
}

const signOut = async () => {
  auth.signOut()
  navigate('/')
}
//
const passwordReset = async (email) => {
  try {
    const emailResp = await auth.sendPasswordResetEmail(email)
    return emailResp
  } catch (error) {
    return { error }
  }
}
const updatePassword = async (password, recordId) => {
  try {
    await auth.currentUser.updatePassword(password)
    const updateResp = await fetch('/.netlify/functions/updateUser', {
      method: 'POST',
      body: JSON.stringify({ recordId }),
    })
    return updateResp
  } catch (error) {
    return { error }
  }
}

export { signIn, signOut, passwordReset, updatePassword }
