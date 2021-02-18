/* eslint-disable react/no-array-index-key */
import React, { useEffect, useReducer } from 'react'
import ResponseBlock from './responseBlock'
import StatusText from './statusText'
import { formatDate, addLegalAction } from '../utils'

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { LegalActionStatus_app: newActions, LegalActionStatus_archive: oldActions } = action.record
      // Split on new line, and remove dup carriage returns
      const newLegalActions = newActions ? JSON.parse(newActions) : []
      const oldLegalActions = oldActions ? oldActions.replace(/[\n\r]{2,}/g, '\r').split('\r') : []
      const actions = [...newLegalActions, ...oldLegalActions]
      return {
        ...state,
        legalActions: actions,
        displayedActions: actions.length > 3 ? actions.slice(0, 3) : actions,
      }
    }
    case 'toggleExpanded':
      return {
        ...state,
        expanded: !state.expanded,
      }
    case 'addAction':
      return {
        ...state,
        addingAction: true,
      }
    case 'actionValChange':
      return {
        ...state,
        actionVal: action.value,
      }
    case 'onCancel':
      return {
        ...state,
        actionVal: '',
        dateVal: '',
        addingAction: false,
      }
    case 'onSuccess': {
      const { dateVal: date, actionVal: response, legalActions } = state
      const newActions = [{ date, response }, ...legalActions]
      return {
        ...state,
        legalActions: newActions,
        displayedActions: newActions.length > 3 ? newActions.slice(0, 3) : newActions,
        actionVal: '',
        dateVal: '',
        addingAction: false,
      }
    }
    default:
      return state
  }
}

const SectionLegal = ({ record, uid, setErrorMsg, setSuccessMsg }) => {
  const [state, dispatch] = useReducer(reducer, {
    expanded: false,
    addingAction: false,
    actionVal: '',
    dateVal: formatDate(new Date()),
    legalActions: [],
    displayedActions: [],
  })
  const { expanded, addingAction, actionVal, dateVal, legalActions, displayedActions } = state

  useEffect(() => {
    if (record.recordId) dispatch({ type: 'init', record })
  }, [record])

  const onChange = (e) => {
    if (e.target) dispatch({ type: 'actionValChange', value: e.target.value })
  }
  const onCancel = () => {
    dispatch({ type: 'onCancel' })
  }
  const handleSubmit = async () => {
    const date = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateVal))
    const data = await addLegalAction({
      recordId: record.recordId,
      response: actionVal,
      date,
      itemHistory: [
        { date, response: actionVal, submittedBy: uid },
        ...JSON.parse(record.LegalActionStatus_app || '[]'),
      ],
      oldActions: record.LegalActionStatus,
    })
    if (data.success) {
      dispatch({ type: 'onSuccess' })
      setSuccessMsg('Successfully saved your response.')
    } else {
      // console.error('error', data)
      setErrorMsg('There was an error saving your legal action.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-gsBlue font-semibold">Legal Actions</h3>
        <button
          type="button"
          className="text-sm bg-gsBlue text-white rounded-full py-2 px-3 flex items-center hover:bg-opacity-70"
          onClick={() => dispatch({ type: 'addAction' })}
        >
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

      {addingAction && (
        <div className="flex flex-col w-full p-3 my-4 bg-gsLightBg rounded shadow-md">
          {/* TODO: CHANGE THIS TO ALLOW THEM TO ENTER A DATE */}
          <small className="font-semibold text-gsBlue py-1 mb-2 flex-1">{formatDate(new Date())}</small>
          <textarea
            className="placeholder-gsLightGray text-gsGray appearance-none rounded text-sm  hover:border-gsBlue focus:border-gsBlue focus:outline-none px-4 py-2 h-full w-full resize-none border border-gray-200 mb-2"
            placeholder="Legal Action Entry"
            name="response"
            value={actionVal}
            onChange={onChange}
            autoComplete="off"
          />
          <div className="self-end text-sm flex">
            <button type="button" className="text-gsGrayText hover:text-gsBlue p-2 mx-4" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className="bg-gsBlue text-white rounded-full py-2 px-3 hover:bg-opacity-70"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {!displayedActions.length && <StatusText text="No legal actions have been entered." />}

      {displayedActions.map((action, index) => (
        <ResponseBlock
          key={`${record.recordId}_legal_${index}`}
          msg={action?.response || action}
          date={action?.date ? formatDate(action.date) : ''}
        />
      ))}
      {legalActions.length > 3 && (
        <button
          onClick={() => dispatch({ type: 'toggleExpanded' })}
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
              msg={action?.response || action}
              date={action?.date ? formatDate(action.date) : ''}
            />
          ))}
    </div>
  )
}

export default SectionLegal
