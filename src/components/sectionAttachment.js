import React from 'react'
import StatusText from './statusText'

const SectionAttachments = ({ record }) => {
  const attachments = record.attachments || []

  return (
    <div>
      <h3 className="text-gsBlue font-semibold mb-6">Attached Documents</h3>
      {!attachments.length || (attachments.length === 1 && !attachments[0].url) ? (
        <StatusText text="No documents have been attached to this record." />
      ) : (
        <div className="flex flex-col items-center">
          {attachments.map((file) => {
            if (!file.url) return null
            return (
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                key={file.ID}
                className="flex items-center text-gsBlue hover:bg-gsBlue hover:text-white focus:outline-none focus:bg-gsBlue focus:text-white rounded p-2 shadow bg-gsBlue bg-opacity-10 p-4 my-2 w-2/3 transition-colors"
              >
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex-grow ml-3 pl-3 border-l border-gsBlue border-opacity-50">
                  {file.FileDescription}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SectionAttachments
