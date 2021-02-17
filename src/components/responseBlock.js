import React from 'react'

const ResponseBlock = ({ msg, date, icon }) => {
  return (
    <div className="flex bg-gsLightBg p-3 my-4 ml-2 rounded">
      {icon === 'downArrow' && (
        <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.25 7.5L15 11.25 11.25 15"
            stroke="#525461"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 3v5.25a3 3 0 003 3h9"
            stroke="#525461"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <div className="flex flex-col ml-2" style={{ paddingTop: '2px' }}>
        <small className="font-semibold text-gsGrayText mb-2">{date || 'Unknown Date'}</small>
        <p className="text-sm ">{msg}</p>
      </div>
    </div>
  )
}

export default ResponseBlock
