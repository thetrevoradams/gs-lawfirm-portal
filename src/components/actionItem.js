import React, { useState, useRef, useEffect } from 'react'

const ActionItem = ({ record }) => {
  const [resp, setResp] = useState('')
  const [containerHeight, setContainerHeight] = useState(1)
  const containerRef = useRef()

  const onChange = ({ target }) => {
    if (target.name === 'response') setResp(target.value)
  }

  useEffect(() => {
    if (containerRef?.current) setContainerHeight(containerRef.current.clientHeight)
  }, [containerRef])

  return (
    <div className="flex flex-row rounded bg-white overflow-hidden mx-8 mb-4 actionItem">
      <div className="flex flex-col text-sm pl-6 py-2 actionItemDeets relative" ref={containerRef}>
        <div className="font-normal text-gsOrangeGray">Case</div>
        <span>
          {record.CaseName.split(',').map((name, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={`${record['GS DebtorID']}${index}`} className="text-gsDarkOrange opacity-80 font-semibold">
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
      <div className="flex flex-col mx-4 p-2 flex-grow">
        <div className="font-bold text-gsOrange ">Information Requested</div>
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
            <small className="font-semibold text-gsGrayText">
              {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                new Date(record.UpdateRequestDate)
              )}
            </small>
          )}
        </div>
        <div className="text-sm text-gsGrayText">{record.UpdateRequest}</div>
      </div>
      <div className="p-2 mx-4">
        <textarea
          className="bg-gsLightBg placeholder-gsLightGray text-gsGray appearance-none rounded-md text-sm shadow-inner focus:border-blue-500 focus:outline-none px-4 py-2 h-full w-72 resize-none "
          placeholder="Response"
          name="response"
          value={resp}
          onChange={onChange}
          autoComplete="off"
        />
      </div>
      <button
        type="button"
        disabled={resp}
        className={`bg-gsOrange hover:bg-Orange text-white w-20 justify-self-end disabled:bg-gsLightOrange ${
          resp ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
        style={{ minWidth: '5rem' }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white hover:text-gsBlue transition-colors"
        >
          <path
            d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a1.999 1.999 0 01-3.46 0"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default ActionItem
