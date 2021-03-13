/* eslint-disable react/no-array-index-key */
import React, { useEffect, useReducer, useContext, useRef } from 'react'
import DatePicker from 'react-datepicker'
import ResponseBlock from './responseBlock'
import StatusText from './statusText'
import LoadingIconSwap from './loadingIconSwap'
import { formatDate, addLegalAction } from '../utils'
import { RecordsContext } from '../context/recordsContext'
import 'react-datepicker/dist/react-datepicker.css'

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
    case 'dateValChanged': {
      if (new Date(action.date) !== 'Invalid Date') {
        return {
          ...state,
          dateVal: action.date,
        }
      }
      return state
    }
    case 'loading':
      return {
        ...state,
        loading: true,
      }
    case 'notLoading':
      return {
        ...state,
        loading: false,
      }
    case 'onCancel':
      return {
        ...state,
        actionVal: '',
        dateVal: new Date(),
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
        dateVal: new Date(),
        addingAction: false,
        loading: false,
      }
    }
    default:
      return state
  }
}

const SectionLegal = ({ record, uid, setErrorMsg, setSuccessMsg }) => {
  const inputRef = useRef()
  const { dispatch: recordsDispatch } = useContext(RecordsContext)
  const [state, dispatch] = useReducer(reducer, {
    expanded: false,
    addingAction: false,
    actionVal: '',
    dateVal: new Date(),
    legalActions: [],
    displayedActions: [],
    loading: false,
  })
  const { expanded, addingAction, actionVal, dateVal, legalActions, displayedActions, loading } = state

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
    dispatch({ type: 'loading' })
    const date = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateVal)
    const itemHistory = [
      { date, response: actionVal, submittedBy: uid },
      ...JSON.parse(record.LegalActionStatus_app || '[]'),
    ]

    const data = await addLegalAction({
      recordId: record.recordId,
      response: actionVal,
      date,
      itemHistory,
      oldActions: record.LegalActionStatus,
    })
    if (data.success) {
      dispatch({ type: 'onSuccess' })
      recordsDispatch({ type: 'updateLegalActions', itemHistory, recordId: record.recordId })
      setSuccessMsg('Successfully saved your response')
    } else {
      dispatch({ type: 'notLoading' })
      // console.error('error', data)
      setErrorMsg('There was an error saving your legal action')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-gsBlue font-semibold">Legal Action History</h3>
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

      {addingAction && (
        <div className="flex flex-col w-full p-3 my-4 bg-gsLightBg rounded shadow-md">
          <div className="flex items-center mb-2 w-28 relative border-b border-gsBlue">
            <DatePicker
              selected={dateVal}
              onChange={(date) => dispatch({ type: 'dateValChanged', date })}
              inputPlaceholder="Select a date"
              showYearDropdown
              dateFormat="MMM d, yyyy"
              ref={inputRef}
              maxDate={new Date()}
              customInput={
                <input
                  className="text-gsBlue bg-gsLightBg text-sm hover:cursor-pointer"
                  style={{ width: '5.6rem' }}
                  placeholder={dateVal}
                  onFocus={(e) => e.target.blur()}
                />
              }
            />
            <button
              type="button"
              className="absolute right-0 select-none"
              onClick={() => inputRef?.current?.input?.focus()}
            >
              <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 15h6.75M12.375 2.625a1.591 1.591 0 112.25 2.25L5.25 14.25l-3 .75.75-3 9.375-9.375z"
                  stroke="#0AA0EF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* <small className="font-semibold text-gsBlue py-1 mb-2 flex-1">{formatDate(new Date())}</small> */}
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
              className={`flex text-white rounded-full py-2 px-3 hover:bg-opacity-70 ${
                loading ? 'bg-gsLightGray cursor-not-allowed' : 'bg-gsBlue cursor-pointer'
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              <LoadingIconSwap loading={loading}>
                <span>Save</span>
              </LoadingIconSwap>
              {loading && <span className="ml-2">Saving</span>}
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
    </div>
  )
}

export default SectionLegal
