import React, { createContext, useEffect, useReducer } from 'react'
import { useRecords } from '../utils'

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { newRecords: records, newLawFirm: lawFirmData, error } = action
      if (error) {
        return {
          ...state,
          records: [],
          actionItems: [],
          isNewUser: false,
          error: true,
        }
      }
      const oldActionItems = records.filter((item) => item.UpdateRequest && !item.UpdateResponse)

      let newActionItems = []
      records.forEach((record) => {
        if (record?.requestHistory) {
          const entries = JSON.parse(record.requestHistory)
          newActionItems = entries.filter((item) => item.reqMsg && !item.respMsg)
        }
      })

      return {
        ...state,
        records,
        lawFirmData,
        actionItems: [...newActionItems, ...oldActionItems],
        isNewUser: lawFirmData?.FirstTimeUser === 'true',
      }
    }
    case 'passwordUpdated':
      return {
        ...state,
        isNewUser: false,
      }
    case 'updateLegalActions': {
      const recordsCopy = [...state.records]
      const index = recordsCopy.findIndex((r) => r.recordId === action.recordId)
      if (index >= 0) recordsCopy[index].LegalActionStatus_app = JSON.stringify(action.itemHistory)
      return {
        ...state,
        records: recordsCopy,
      }
    }
    case 'searchOnChange':
      return {
        ...state,
        searchTerm: action.value,
      }
    case 'clearActionItem': {
      // Remove updated action item
      const actionItems = state.actionItems.filter((item) => item.recordId !== action.recordId)
      // Update corresponding record
      const records = [...state.records]
      const index = records.findIndex((item) => item.recordId === action.recordId)
      if (index >= 0) {
        records[index] = {
          ...records[index],
          requestHistory: JSON.stringify(action.itemHistory),
          UpdateResponse: action.itemHistory[0].respMsg,
          UpdateResponseDate: action.itemHistory[0].respDate,
        }
      }

      return {
        ...state,
        actionItems,
        records,
        searchTerm: '',
      }
    }
    default:
      return state
  }
}

const RecordsContext = createContext()

const RecordsProvider = ({ user, children }) => {
  const { records: newRecords, lawFirmData: newLawFirm, error } = useRecords(user)

  const [state, dispatch] = useReducer(reducer, {
    records: 'loading',
    actionItems: 'loading',
    lawFirmData: '',
    searchTerm: '',
    isNewUser: 'loading',
  })

  const { records, actionItems, lawFirmData, searchTerm, isNewUser } = state

  useEffect(() => {
    if (typeof newRecords !== 'string') {
      dispatch({ type: 'init', newRecords, newLawFirm, error })
    }
  }, [newLawFirm, newRecords, error])

  return (
    <RecordsContext.Provider
      value={{
        dispatch,
        records,
        actionItems,
        lawFirmData,
        searchTerm,
        isNewUser,
        error,
      }}
    >
      {children}
    </RecordsContext.Provider>
  )
}

export { RecordsContext, RecordsProvider }
