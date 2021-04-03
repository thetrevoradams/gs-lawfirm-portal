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
  const pendingResponse =
    record.UpdateRequest && !record.UpdateResponse
      ? [
          {
            reqDate: record.updateRequestDateFormatted,
            reqMsg: record.UpdateRequest,
          },
        ]
      : []
  const oldRequest =
    record.UpdateRequest && record.UpdateResponse && !requestHistory
      ? [
          {
            reqDate: record.updateRequestDateFormatted,
            reqMsg: record.UpdateRequest,
            respDate: record.updateResponseDateFormatted,
            respMsg: record.UpdateResponse,
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
  const reqs = [...pendingResponse, ...oldRequest, ...formattedReqHistory]
  const displayedRequests = reqs.length > 3 ? reqs.slice(0, 3) : reqs

  return (
    <div>
      <h3 className="text-gsBlue font-semibold mb-6">Request History</h3>
      {urgent && (
        <button
          className="flex items-center text-red-500 bg-red-400 bg-opacity-10 ring-red-500 ring-opacity-30 p-4 text-sm rounded hover:text-white hover:bg-opacity-100 focus:outline-none focus:bg-opacity-100 focus:text-white w-2/3 shadow mx-auto transition-colors"
          type="button"
          onClick={() => navigate('/')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
          </svg>
          <span className="flex-grow ml-3 pl-3 border-l border-red-500 border-opacity-50 text-left">
            View URGENT information requested
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
        </button>
      )}
      {!displayedRequests.length && <StatusText text="No information has been requested." />}

      {displayedRequests.map(({ reqDate, reqMsg, respDate, respMsg, urgent: wasUrgent }, index) => (
        <div key={`${record.recordId}_request_${index}`}>
          <RequestBlock recordId={record.recordId} msg={reqMsg} date={reqDate} wasUrgent={wasUrgent} />
          <ResponseBlock msg={respMsg} date={respDate} showIcon />
        </div>
      ))}
      {expanded &&
        requestHistory.slice(3).map(({ reqDate, reqMsg, respDate, respMsg, urgent: wasUrgent }, index) => (
          <div key={`${record.recordId}_request_extra_${index}`}>
            <RequestBlock recordId={record.recordId} msg={reqMsg} date={reqDate} wasUrgent={wasUrgent} />
            {respMsg ? (
              <ResponseBlock msg={respMsg} date={respDate} showIcon />
            ) : (
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
