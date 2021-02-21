import React from 'react'

const ResponseBlock = ({ msg, date, showIcon }) => {
  return (
    <div className="flex bg-gsLightBg p-3 my-4 ml-2 rounded">
      {showIcon && (
        <svg width="26" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '24px' }}>
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
        {msg ? (
          <>
            <small className="font-semibold text-gsGrayText mb-2">{date || 'Unknown Date'}</small>
            <p className="text-sm ">{msg}</p>
          </>
        ) : (
          <>
            <small className="font-semibold text-gsDarkOrange mb-2">Awaiting your response</small>
            <small className="text-gsGrayText mb-2 italic">Please review your pending Action Items</small>
          </>
        )}
      </div>
    </div>
  )
}

export default ResponseBlock
