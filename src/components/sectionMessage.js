import React from 'react'
import { navigate } from '@reach/router'

const SectionMessage = ({ urgent }) => {
  return (
    <div>
      <p>Message</p>
      {urgent && (
        <button
          className="text-white bg-red-500 border-2 border-red-400 px-2 py-1 text-sm rounded hover:bg-red-400"
          type="button"
          onClick={() => navigate('/')}
        >
          View URGENT information requested
        </button>
      )}
    </div>
  )
}

export default SectionMessage
