/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react'
import ResponseBlock from './responseBlock'
import StatusText from './statusText'

const SectionLegal = ({ record }) => {
  // Split on new line, and remove dup carriage returns
  const legalActions = record.LegalActionStatus ? record.LegalActionStatus.replace(/[\n\r]{2,}/g, '/r').split('\r') : []
  const [expanded, setExpanded] = useState(false)
  const displayedActions = legalActions.length > 3 ? legalActions.slice(0, 3) : legalActions

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-gsBlue font-semibold">Legal Actions</h3>
        <button type="button" className="text-sm bg-gsBlue text-white rounded-full py-2 px-3 flex items-center">
          <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 3.75v10.5M3.75 9h10.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Legal Action</span>
        </button>
      </div>
      {record.legalActionStatusDateFormatted && (
        <small className="font-semibold text-gsGrayText">{record.legalActionStatusDateFormatted}</small>
      )}

      {!displayedActions.length && <StatusText text="No legal actions have been entered." />}

      {displayedActions.map((action, index) => (
        <ResponseBlock
          key={`${record.recordId}_legal_${index}`}
          msg={action}
          date={record.legalActionStatusDateFormatted}
        />
      ))}
      {legalActions.length > 3 && (
        <button
          onClick={() => setExpanded((isExpanded) => !isExpanded)}
          type="button"
          className="text-sm text-gsBlue flex items-center rounded p-2 border border-transparent hover:border-gsBlue focus:border-gsBlue transition-colors focus:outline-none"
        >
          <span>Show {expanded ? 'Less' : 'More'} Legal Actions</span>
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-2 transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" stroke="#0AA0EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {expanded &&
        legalActions
          .slice(3)
          .map((action, index) => (
            <ResponseBlock
              key={`${record.recordId}_legal_extra_${index}`}
              msg={action}
              date={record.legalActionStatusDateFormatted}
            />
          ))}
    </div>
  )
}

export default SectionLegal
