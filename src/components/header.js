import React from 'react'
import { navigate } from '@reach/router'
import logo from '../assets/logo.svg'
import { signOut } from '../utils'

const Header = ({ actionCount }) => {
  const actionStyle =
    actionCount < 100
      ? { height: 26, width: 26, top: '-14px', right: '-10px' }
      : { height: 24, width: 32, top: '-12px', right: '-16px' }
  return (
    <div className="flex justify-between bg-gsGray px-5 py-3">
      <div className="flex flex-row items-center">
        <div className=" border-r border-gray-50 pr-7">
          <img src={logo} alt="Guaranty Solutions" className="select-none" draggable="false" style={{ height: 45 }} />
        </div>
        <div className="select-none pl-4 tracking-wide text-2xl text-white font-regular ml-2 mdMax:text-xl smMax:text-xl">
          Law Firm Portal
        </div>
      </div>
      <div className="flex flex-row items-center">
        <button
          type="button"
          aria-label="action items"
          className="focus:ring-2 ring-text-gsBlue outline-none border-none relative"
          onClick={() => navigate('/')}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white hover:text-gsBlue transition-colors"
          >
            <path
              d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a1.999 1.999 0 01-3.46 0"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {actionCount > 0 && (
            <div
              className="box-border absolute bg-gsDarkOrange text-white text-xs border-4 border-gsGray flex justify-center items-center font-semibold"
              style={{ ...actionStyle, borderRadius: 26 }}
            >
              {actionCount < 100 ? actionCount : '99+'}
            </div>
          )}
        </button>
        <button
          type="button"
          aria-label="logout"
          className="ml-5 focus:ring-2 ring-text-gsBlue outline-none border-none"
          onClick={signOut}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white hover:text-gsBlue transition-colors"
          >
            <path
              d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Header
