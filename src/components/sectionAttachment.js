import React from 'react'
import StatusText from './statusText'

const SectionAttachments = ({ attachments = [] }) => {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-gsBlue font-semibold">Attached Documents</h3>
        <button
          type="button"
          className="text-sm bg-gsBlue text-white rounded-full py-2 px-3 flex items-center hover:bg-opacity-70"
        >
          <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 3.75v10.5M3.75 9h10.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Upload Document</span>
        </button>
      </div>
      {!attachments.length && <StatusText text="No documents have been attached to this record." />}
    </div>
  )
}

export default SectionAttachments
