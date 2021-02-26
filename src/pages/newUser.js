import React, { useReducer, useContext } from 'react'
import { navigate } from '@reach/router'
import Toast from '../components/toast'
import Tooltip from '../components/tooltip'
import MustContainItem from '../components/mustContain'
import { updatePassword } from '../utils'
import { RecordsContext } from '../context/recordsContext'

const reducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        loading: true,
      }
    case 'onChange': {
      let meetsRules = state.meetsRules
      let samePass = state.samePass
      if (action.isPass) {
        meetsRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,}$/g.test(
          action.val
        )
        samePass = state.dupPassword === action.val
      } else {
        samePass = state.password === action.val
      }
      return {
        ...state,
        password: action.isPass ? action.val : state.password,
        dupPassword: action.isPass ? state.dupPassword : action.val,
        meetsRules,
        samePass,
      }
    }
    case 'updateError':
      return {
        ...state,
        loading: false,
        errorMsg: 'Error updating your password. Please try again.',
      }
    case 'updateSuccess':
      return {
        ...state,
        password: '',
        dupPassword: '',
        loading: false,
      }
    case 'showSuccess':
      return {
        ...state,
        successMsg: 'Password successfully reset',
      }
    case 'setSuccess':
      return {
        ...state,
        successMsg: action.msg,
      }
    case 'setError':
      return {
        ...state,
        errorMsg: action.msg,
      }
    default:
      return state
  }
}

const NewUser = () => {
  const { isNewUser, lawFirmData, dispatch: recordsDispatch } = useContext(RecordsContext)
  if (!isNewUser) navigate('/')

  const [state, dispatch] = useReducer(reducer, {
    password: '',
    dupPassword: '',
    meetsRules: false,
    samePass: false,
    loading: false,
    errorMsg: '',
    successMsg: '',
  })

  const { password, dupPassword, meetsRules, samePass, loading, errorMsg, successMsg } = state

  const onChange = ({ target }) => {
    dispatch({ type: 'onChange', val: target.value, isPass: target.name === 'password' })
  }
  const onSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'loading' })

    updatePassword(password, lawFirmData.recordId)
      .then((resp) => {
        if (resp.error) {
          dispatch({ type: 'updateError' })
        } else {
          dispatch({ type: 'showSuccess' })
          setTimeout(() => {
            dispatch({ type: 'updateSuccess' })
            recordsDispatch({ type: 'passwordUpdated' })
          }, 1000)
        }
      })
      .catch(() => {
        dispatch({ type: 'updateError' })
      })
  }

  const notAMatch = password.length > 0 && dupPassword.length > 0 && !samePass

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 w-screen h-screen min-h-screen py-6 flex flex-col justify-center sm:py-12 z-10 bg-gsLightBg">
      {errorMsg && (
        <Toast
          type="error"
          msg={errorMsg}
          onComplete={(msg) => {
            dispatch({ type: 'setError', msg })
          }}
        />
      )}
      {successMsg && (
        <Toast
          type="success"
          msg={successMsg}
          onComplete={(msg) => {
            dispatch({ type: 'setSuccess', msg })
          }}
        />
      )}
      <div className="relative py-3 px-2 w-3/5 max-w-xl mx-auto smMax:w-full slideUp">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-5">
            <p className="select-none tracking-wide text-3xl text-gsBlue font-regular mdMax:text-2xl smMax:text-2xl mb-2 text-center">
              Welcome
            </p>
            <p>For security please set a new password</p>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="py-2 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <form method="POST" className="flex flex-col items-start" onSubmit={onSubmit}>
                <div className="flex flex-col items-start w-full mb-4 items-center">
                  <div className="text-sm mb-8 py-4 px-6 w-full rounded-md shadow-lg bg-gsBlue bg-opacity-10 text-gsBlue">
                    <p className="text-sm text-center mb-4">Your password must contain at least</p>
                    <div className="flex justify-center flex-wrap">
                      <div>
                        <MustContainItem label="8 characters" isMet={password.length >= 8} />
                        <MustContainItem label="A lowercase letter" isMet={/[a-z]+/g.test(password)} />
                        <MustContainItem label="An uppercase letter" isMet={/[A-Z]+/g.test(password)} />
                      </div>
                      <div className="ml-8">
                        <MustContainItem label="A number" isMet={/\d+/g.test(password)} />
                        <MustContainItem
                          label="A special character"
                          isMet={/[$&+,:;=?@#|'<>.^*()%!-]+/g.test(password)}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={onChange}
                    className="border border-gray-300 bg-white text-gray-900 appearance-none block w-full rounded-md p-2 focus:border-blue-500 focus:outline-none text-base"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={password}
                  />
                  <input
                    onChange={onChange}
                    className={`border bg-white text-gray-900 appearance-none block w-full rounded-md p-2 my-3 focus:outline-none text-base ${
                      notAMatch ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Confirm Password"
                    type="password"
                    name="dupPassword"
                    value={dupPassword}
                  />
                </div>
                <Tooltip msg="Enter a new password" position="bottom" fullWidth>
                  <button
                    type="submit"
                    disabled={!meetsRules || !samePass || loading}
                    className={`w-full flex-grow px-5 py-3 text-sm text-white font-semibold rounded-md  hover:text-white hover:bg-opacity-70 
                  uppercase hover:border-transparent focus:outline-none focus:ring-2 focus:ring-gsLightOrange focus:ring-offset-2 text-center disabled:opacity-50 transition-colors ${
                    !meetsRules || !samePass || loading
                      ? 'cursor-not-allowed bg-gsLightGray'
                      : 'cursor-pointer bg-gsBlue'
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
