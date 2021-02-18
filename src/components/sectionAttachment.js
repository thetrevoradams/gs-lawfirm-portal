import React from 'react'

const SectionAttachments = () => {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-gsBlue font-semibold">Attached Files</h3>
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
          <span>Upload File</span>
        </button>
      </div>
    </div>
  )
}

export default SectionAttachments
