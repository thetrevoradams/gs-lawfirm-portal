import React from 'react'
import { Link } from '@reach/router'

const Nav = () => {
  return (
    <div className="flex justify-between items-center bg-white px-5 py-3">
      <nav>
        <Link
          to="/"
          getProps={({ isCurrent }) => ({
            className: `relative nav-link  py-5 text-sm ${
              isCurrent ? 'text-gsBlue active-link text-gsBlue hover:text-gsBlue' : 'text-gsLightGray'
            }`,
          })}
        >
          Action Items
        </Link>
        <Link
          to="/records"
          getProps={({ isCurrent }) => ({
            className: `relative nav-link ml-5 py-5 text-sm ${
              isCurrent ? 'text-gsBlue active-link text-gsBlue hover:text-gsBlue' : 'text-gsLightGray'
            }`,
          })}
        >
          All Records
        </Link>
      </nav>
      <div className="relative text-gsLightGray focus-within:text-gsGray">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          className="bg-gsLightBg placeholder-gsLightGray text-gsGray pl-10 appearance-none block rounded-full text-sm shadow-inner focus:border-blue-500 focus:outline-none focus:w-2/3 px-4 py-2"
          placeholder="Search"
          type="text"
          name="search"
          autoComplete="off"
        />
      </div>
    </div>
  )
}

export default Nav
