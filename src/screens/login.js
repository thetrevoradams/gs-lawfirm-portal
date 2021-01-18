/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { signIn, passwordReset } from '../utils/useAuth'
import Toast from '../components/toast'
import logo from '../assets/logo.svg'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [forgotPass, setForgotPass] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onChange = ({ target }) => {
    if (target.name === 'email') setEmail(target.value)
    if (target.name === 'password') setPassword(target.value)
  }
  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    if (forgotPass) {
      passwordReset(email).then((resp) => {
        setLoading(false)
        if (resp?.error) {
          setErrorMsg('Issue sending email. Verify what email was entered.')
        } else {
          setSuccessMsg('The password reset email has been sent.')
        }
      })
    } else {
      signIn(email, password)
        .then((resp) => {
          if (resp.error) {
            setLoading(false)
            setEmail('')
            setPassword('')
            setErrorMsg('Invalid email or password')
          }
        })
        .catch(() => {
          setLoading(false)
          setErrorMsg('Invalid email or password')
        })
    }
  }
  const validEmail = () => {
    if (email.length > 1) {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      const error = valid ? '' : 'Invalid email'
      setErrorMsg(error)
    } else {
      setErrorMsg('')
    }
  }

  return (
    <div className="min-h-screen w-full bg-gsGray py-6 flex flex-col justify-center sm:py-12">
      {errorMsg && <Toast type="error" msg={errorMsg} onComplete={setErrorMsg} />}
      {successMsg && <Toast type="success" msg={successMsg} onComplete={setSuccessMsg} />}
      <div className="relative py-3 px-2 w-3/5 max-w-xl mx-auto smMax:w-full slideUp">
        <div className="max-w-md mx-auto">
          <div className="flex flex-row items-center mb-5">
            <div className=" border-r border-gray-50 pr-7">
              <img src={logo} alt="Guaranty Solutions" className="select-none" draggable="false" />
            </div>
            <div className="select-none pl-4 tracking-wide text-3xl text-white font-regular ml-2 mdMax:text-2xl smMax:text-2xl">
              Law Firm Portal
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <form method="POST" className="flex flex-col items-start" onSubmit={onSubmit}>
                <div className="flex flex-col items-start w-full">
                  <input
                    onChange={onChange}
                    onBlur={validEmail}
                    className="border border-gray-300 bg-white text-gray-900 appearance-none block w-full rounded-md p-2 text-base focus:border-blue-500 focus:outline-none"
                    placeholder="Email"
                    type="text"
                    name="email"
                    value={email}
                  />
                  {!forgotPass && (
                    <input
                      onChange={onChange}
                      className="border border-gray-300 bg-white text-gray-900 appearance-none block w-full rounded-md p-2 my-3 focus:border-blue-500 focus:outline-none text-base"
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={password}
                    />
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!email || (!password && !forgotPass) || loading}
                  className={`my-4 w-full px-5 py-3 text-sm text-white font-semibold rounded-md bg-gsOrange hover:text-white hover:bg-gsDarkOrange 
                  uppercase hover:border-transparent focus:outline-none focus:ring-2 focus:ring-gsLightOrange focus:ring-offset-2 text-center disabled:opacity-50 transition-colors ${
                    !email || (!password && !forgotPass) || loading ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {loading ? 'Loading...' : forgotPass ? 'Send Password Reset Email' : 'Sign In'}
                </button>
                <button
                  className="text-gray-500 text-sm transition-colors hover:text-gsDarkOrange focus:outline-none focus:ring-1 focus:ring-gsLightOrange"
                  type="button"
                  onClick={() => setForgotPass(!forgotPass)}
                >
                  {forgotPass ? 'Back to Sign In' : 'Forgot password?'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
