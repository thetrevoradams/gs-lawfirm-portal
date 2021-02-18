import React, { useState, useRef, useEffect, useContext } from 'react'
import { submitResp } from '../utils'
import ActionItemsContext from '../context/actionItemsContext'

const ActionItem = ({ record, uid, setErrorMsg, setSuccessMsg }) => {
  const { setActionItems, setSearchTerm, urgentId, setUrgentId } = useContext(ActionItemsContext)
  const [resp, setResp] = useState('')
  const [containerHeight, setContainerHeight] = useState(1)
  const containerRef = useRef()

  const onChange = ({ target }) => {
    if (target.name === 'response') setResp(target.value)
  }
  const handleSubmit = async () => {
    const date = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
    const pastActions = JSON.parse(record.LegalActionStatus_app)
    const data = await submitResp({
      recordId: record.recordId,
      urgentId,
      response: resp,
      date,
      itemHistory: [
        {
          reqDate: record.updateRequestDate,
          reqMsg: record.UpdateRequest,
          respDate: date,
          respMsg: resp,
          urgent: Boolean(urgentId),
          submittedBy: uid,
        },
        ...pastActions,
      ],
    })
    if (data.success) {
      setUrgentId('')
      setSearchTerm('')
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.delete('u')
      setSuccessMsg('Successfully saved your response.')
      setActionItems((items) => items.filter((item) => item.recordId !== record.recordId))
    } else {
      // console.error('error', data)
      setErrorMsg('There was an error saving your response.')
    }
  }

  useEffect(() => {
    if (containerRef?.current) setContainerHeight(containerRef.current.clientHeight)
  }, [containerRef])

  return (
    <div className="flex flex-row rounded bg-white overflow-hidden mx-8 mb-4 max-w-screen-lg lg:w-full">
      <div className="flex flex-col text-sm pl-6 py-2 actionItemDeets relative" ref={containerRef}>
        <div className="font-normal text-gsOrangeGray">Case</div>
        <span>
          {record.CaseName.split(',').map((name, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={`${record.recordId}_${index}`} className="text-gsDarkOrange opacity-80 font-semibold">
              {name}
            </p>
          ))}
        </span>
        <div className="font-normal text-gsOrangeGray mt-2">File #</div>
        <span className="text-gsDarkOrange opacity-80 font-semibold">{record.CounselFileNumber}</span>
        <div className="font-normal text-gsOrangeGray mt-2">State</div>
        <span className="text-gsDarkOrange opacity-80 font-semibold">
          {record['Judgments 2::JudgmentRecordingState']}
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
          <div className={`font-bold ${urgentId === record.recordId ? 'text-red-500' : 'text-gsOrange'}`}>
            Information Requested {urgentId === record.recordId ? '(URGENT)' : ''}
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
              <small className="font-semibold text-gsGrayText">{record.updateRequestDateFormatted}</small>
            )}
          </div>
          <div className="text-sm text-gsGrayText">{record.UpdateRequest}</div>
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
      <button
        type="button"
        disabled={!resp}
        title={resp ? 'Submit response' : 'Enter your response before submitting'}
        className={`bg-gsLightGray text-white w-20 justify-self-end disabled:bg-gsLightOrange flex items-center justify-center ${
          resp ? 'cursor-pointer bg-gsDarkOrange hover:bg-gsOrange' : 'cursor-not-allowed'
        }`}
        style={{ minWidth: '5rem' }}
        onClick={handleSubmit}
      >
        <svg width="24" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22 2.156l-11 11.86M22 2.156L15 23.72l-4-9.703-9-4.313 20-7.548z"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default ActionItem
