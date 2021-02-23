import React, { useState, useContext } from 'react'
import { navigate } from '@reach/router'
import Toast from '../components/toast'
import Tooltip from '../components/tooltip'
import { updatePassword } from '../utils'
import { RecordsContext } from '../context/recordsContext'

const NewUser = () => {
  const { isNewUser, lawFirmData, dispatch } = useContext(RecordsContext)
  if (!isNewUser) navigate('/')

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const onChange = ({ target }) => {
    setPassword(target.value)
  }
  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    updatePassword(password, lawFirmData.recordId)
      .then((resp) => {
        if (resp.error) {
          setLoading(false)
          setPassword('')
          setErrorMsg('Error updating your password. Please try again.')
        } else {
          setSuccessMsg('Password successfully reset')
          setTimeout(() => {
            setLoading(false)
            dispatch({ type: 'passwordUpdated' })
          }, 1000)
        }
      })
      .catch(() => {
        setLoading(false)
        setErrorMsg('Error updating your password. Please try again.')
      })
  }

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 w-screen h-screen min-h-screen py-6 flex flex-col justify-center sm:py-12 z-10 bg-gsLightBg">
      {errorMsg && <Toast type="error" msg={errorMsg} onComplete={setErrorMsg} />}
      {successMsg && <Toast type="success" msg={successMsg} onComplete={setSuccessMsg} />}
      <div className="relative py-3 px-2 w-3/5 max-w-xl mx-auto smMax:w-full slideUp">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-5">
            <p className="select-none pl-4 tracking-wide text-3xl text-gsBlue font-regular ml-2 mdMax:text-2xl smMax:text-2xl mb-2 text-center">
              Welcome
            </p>
            <p>For security please set a new password</p>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <form method="POST" className="flex flex-col items-start" onSubmit={onSubmit}>
                <div className="flex flex-col items-start w-full mb-4">
                  <input
                    onChange={onChange}
                    className="border border-gray-300 bg-white text-gray-900 appearance-none block w-full rounded-md p-2 my-3 focus:border-blue-500 focus:outline-none text-base"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={password}
                  />
                </div>
                <Tooltip msg="Enter a new password" position="bottom" fullWidth>
                  <button
                    type="submit"
                    disabled={!password || loading}
                    className={`w-full flex-grow px-5 py-3 text-sm text-white font-semibold rounded-md  hover:text-white hover:bg-opacity-70 
                  uppercase hover:border-transparent focus:outline-none focus:ring-2 focus:ring-gsLightOrange focus:ring-offset-2 text-center disabled:opacity-50 transition-colors ${
                    !password || loading ? 'cursor-not-allowed bg-gsLightGray' : 'cursor-pointer bg-gsBlue'
                  }`}
                  >
                    {loading ? 'Loading...' : 'Submit'}
                  </button>
                </Tooltip>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewUser
