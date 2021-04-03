import React, { useState, useRef, useEffect, useContext } from 'react'
import { submitResp } from '../utils'
import { RecordsContext } from '../context/recordsContext'
import Tooltip from './tooltip'
import LoadingIconSwap from './loadingIconSwap'

const ActionItem = ({ record, uid, setErrorMsg, setSuccessMsg }) => {
  const { dispatch, lawFirmData } = useContext(RecordsContext)
  const [resp, setResp] = useState('')
  const [loading, setLoading] = useState(false)
  const [containerHeight, setContainerHeight] = useState(1)
  const containerRef = useRef()

  const onChange = ({ target }) => {
    if (target.name === 'response') setResp(target.value)
  }
  const handleSubmit = async () => {
    setLoading(true)
    const date = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
    const pastActions = record.requestHistory ? JSON.parse(record.requestHistory) : ''
    let itemHistory = [
      {
        reqDate: record.UpdateRequestDate,
        reqMsg: record.UpdateRequest,
        respDate: date,
        respMsg: resp,
        urgent: Boolean(record.UrgentRequest),
        submittedBy: uid,
      },
    ]
    if (pastActions) itemHistory = [...itemHistory, ...pastActions]
    const data = await submitResp({
      recordId: record.recordId,
      urgent: record.UrgentRequest,
      response: resp,
      date,
      itemHistory,
      lawFirmData,
      record,
    })
    setLoading(false)
    if (data.success) {
      setSuccessMsg('Successfully saved your response.')
      dispatch({ type: 'clearActionItem', recordId: record.recordId, itemHistory })
    } else {
      // console.error('error', data)
      setErrorMsg('There was an error saving your response.')
    }
  }

  useEffect(() => {
    if (containerRef?.current) setContainerHeight(containerRef.current.clientHeight)
  }, [containerRef])

  return (
    <div
      className={`flex flex-row rounded bg-white mx-8 mb-4 max-w-screen-lg lg:w-full overflow-hidden ${
        record.UrgentRequest ? 'border-l-4 border-red-400' : ''
      }`}
    >
      <div className="flex flex-col text-sm pl-6 py-2 actionItemDeets relative" ref={containerRef}>
        <div className="font-normal text-gsGrayText opacity-80">Case</div>
        <span>
          {record.CaseName.split('\r').map((name, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={`${record.recordId}_${index}`} className="text-gsDarkOrange opacity-90 font-semibold">
              {name}{' '}
            </p>
          ))}
        </span>
        <div className="font-normal text-gsGrayText opacity-80 mt-2">File #</div>
        <span className="text-gsDarkOrange opacity-90 font-semibold">{record.CounselFileNumber}</span>
        <div className="font-normal text-gsGrayText opacity-80 mt-2">State</div>
        <span className="text-gsDarkOrange opacity-90 font-semibold">
          {record['GS JudgmentMaster::JudgmentRecordingState']}
        </span>
        <div
          className="actionItemsDeetsTriangle"
          style={{
            borderTop: `${containerHeight / 2}px solid transparent`,
            borderBottom: `${containerHeight / 2}px solid transparent`,
          }}
        />
      </div>
      <div className="flex flex-col lg:flex-row flex-grow">
        <div className="flex flex-col mx-4 p-2 flex-grow">
          <div className={`font-bold ${record.UrgentRequest ? 'text-red-500 opacity-90' : 'text-gsOrange'}`}>
            Information Requested{record.UrgentRequest ? ' (URGENT)' : ''}
          </div>
          <div className="flex items-center my-2">
            <svg width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <rect width="25" height="25" rx="12.5" fill="#F7DCB9" />
              <path
                d="M17.222 14.667c0 .294-.108.577-.3.785a.986.986 0 01-.724.326h-6.149L8 18V9.111c0-.295.108-.577.3-.786A.986.986 0 019.025 8h7.173c.271 0 .532.117.724.325.192.209.3.491.3.786v5.556z"
                stroke="#E68917"
                strokeOpacity=".8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {record.UpdateRequestDate && (
              <small className="font-semibold text-gsGrayText">{record.UpdateRequestDateFormatted}</small>
            )}
          </div>
          <div className="text-sm text-gsGrayText">
            {record.UpdateRequest.replace(/[\n\r]{2,}/g, '\r')
              .split('\r')
              .filter(Boolean)
              .map((request, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={`${record.recordId}_req_${index}`} className="mb-2">
                  - {request}{' '}
                </p>
              ))}
          </div>
        </div>
        <div className="p-2 mx-4">
          <textarea
            className="bg-gsLightBg placeholder-gsLightGray text-gsGray appearance-none rounded-md text-sm shadow-inner focus:border-blue-500 focus:outline-none px-4 py-2 h-full w-full lg:w-72 lg:min-w-72 resize-none"
            placeholder="Your Response"
            name="response"
            value={resp}
            onChange={onChange}
            autoComplete="off"
          />
        </div>
      </div>
      <Tooltip msg={resp ? 'Submit response' : 'Enter your response before submitting'} position="left">
        <button
          type="button"
          disabled={!resp}
          className={`bg-gsLightGray text-white w-20 justify-self-end h-full disabled:bg-gsLightOrange flex items-center justify-center ${
            resp && !loading ? 'cursor-pointer bg-gsOrange hover:bg-gsDarkOrange' : 'cursor-not-allowed bg-opacity-40'
          }`}
          style={{ minWidth: '5rem' }}
          onClick={handleSubmit}
        >
          <LoadingIconSwap loading={loading}>
            <svg width="24" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2.156l-11 11.86M22 2.156L15 23.72l-4-9.703-9-4.313 20-7.548z"
                stroke={`#${resp && !loading ? 'fff' : '7C7F93'}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LoadingIconSwap>
        </button>
      </Tooltip>
    </div>
  )
}

export default ActionItem
