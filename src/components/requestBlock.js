import React from 'react'
import Tooltip from './tooltip'

const RequestBlock = ({ msg, date, wasUrgent, recordId }) => {
  return (
    <div className="flex flex-col mt-3 ml-2">
      <div className="flex items-center mb-2">
        <small className="font-semibold text-gsGrayText mr-3">{date || 'Unknown Date'}</small>
        {wasUrgent && (
          <Tooltip msg="Urgent Request Via Email">
            <svg width="27" height="27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13.5" cy="13.5" r="13.5" fill="#ECF0F9" />
              <path
                d="M8.5 8.5h10c.688 0 1.25.563 1.25 1.25v7.5c0 .688-.563 1.25-1.25 1.25h-10c-.688 0-1.25-.563-1.25-1.25v-7.5c0-.688.563-1.25 1.25-1.25z"
                stroke="#7C7F93"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.75 9.75l-6.25 4.375L7.25 9.75"
                stroke="#7C7F93"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Tooltip>
        )}
      </div>
      <div className="text-sm ">
        {msg
          .replace(/[\n\r]{2,}/g, '\r')
          .split('\r')
          .filter(Boolean)
          .map((request, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={`${recordId}_req_${index}`} className="mb-2">
              - {request}{' '}
            </p>
          ))}
      </div>
    </div>
  )
}

export default RequestBlock
