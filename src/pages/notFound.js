import React from 'react'
import { Link } from '@reach/router'

const NotFound = () => {
  return (
    <div className="w-screen max-w-screen-lg h-full min-h-screen min-h-screen py-6 flex flex-col">
      <p className="font-semibold mx-8 mb-4 text-gsGrayText">Whoops</p>
      <p className="font-normal mx-8 text-gsGrayText">The page you are looking for doesn&apos;t seem to exist.</p>
      <Link
        to="/records"
        className="m-8 text-center w-48 py-2 text-sm text-white rounded-md hover:text-white hover:bg-opacity-70 uppercase bg-gsBlue"
      >
        Back to All Records
      </Link>
    </div>
  )
}

export default NotFound
