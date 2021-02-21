/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react'
import { navigate } from '@reach/router'
import ResponseBlock from './responseBlock'
import RequestBlock from './requestBlock'
import StatusText from './statusText'
import { formatDate } from '../utils'

const SectionRequests = ({ record, urgent }) => {
  const [expanded, setExpanded] = useState(false)
  const requestHistory = record.requestHistory ? JSON.parse(record.requestHistory) : ''
  const oldRequest =
    record.UpdateRequest && !record.UpdateResponse
      ? [
          {
            reqDate: record.updateRequestDateFormatted,
            reqMsg: record.UpdateRequest,
          },
        ]
      : []
  const formattedReqHistory = requestHistory
    ? requestHistory.map((item) => ({
        ...item,
        reqDate: formatDate(item.reqDate),
        respDate: formatDate(item.respDate),
      }))
    : requestHistory
  const reqs = [...oldRequest, ...formattedReqHistory]
  const displayedRequests = reqs.length > 3 ? reqs.slice(0, 3) : reqs

  return (
    <div>
      <h3 className="text-gsBlue font-semibold mb-6">Information Requests</h3>
      {urgent && (
        <button
          className="text-white bg-red-500 border-2 border-red-400 px-2 py-1 text-sm rounded hover:bg-red-400"
          type="button"
          onClick={() => navigate('/')}
        >
          View URGENT information requested
        </button>
      )}
      {!displayedRequests.length && <StatusText text="No information has been requested." />}

      {displayedRequests.map(({ reqDate, reqMsg, respDate, respMsg, urgent: wasUrgent }, index) => (
        <div key={`${record.recordId}_request_${index}`}>
          <RequestBlock msg={reqMsg} date={reqDate} wasUrgent={wasUrgent} />
          <ResponseBlock msg={respMsg} date={respDate} showIcon />
        </div>
      ))}
      {expanded &&
        requestHistory.slice(3).map(({ reqDate, reqMsg, respDate, respMsg, urgent: wasUrgent }, index) => (
          <div key={`${record.recordId}_request_extra_${index}`}>
            <RequestBlock msg={reqMsg} date={reqDate} wasUrgent={wasUrgent} />
            {respMsg ? (
              <ResponseBlock msg={respMsg} date={respDate} showIcon />
            ) : (
              // <ResponseBlock customMsg={respMsg} date={respDate} showIcon />
              <div className="flex flex-col">
                <small className="font-semibold text-gsOrange mb-2">Awaiting your response</small>
                <button
                  className="text-white bg-gsOrange px-2 py-1 text-sm rounded hover:bg-opacity-70"
                  type="button"
                  onClick={() => navigate('/')}
                >
                  Enter a response
                </button>
              </div>
            )}
          </div>
        ))}
      {requestHistory.length > 3 && (
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
    </div>
  )
}

export default SectionRequests
