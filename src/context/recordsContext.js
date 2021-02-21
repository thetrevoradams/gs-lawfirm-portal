import React, { createContext, useEffect, useReducer } from 'react'
import { useRecords } from '../utils'

function useQuery() {
  return new URLSearchParams(window.location?.search)
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { newRecords: records, newLawFirm: lawFirmData } = action
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
        urgentId: '',
        searchTerm: '',
      }
    }
    default:
      return state
  }
}

const RecordsContext = createContext()

const RecordsProvider = ({ user, children }) => {
  const query = useQuery()
  const { records: newRecords, lawFirmData: newLawFirm } = useRecords(user)

  const [state, dispatch] = useReducer(reducer, {
    records: 'loading',
    actionItems: 'loading',
    lawFirmData: '',
    searchTerm: query.get('u') || '',
    urgentId: query.get('u'),
    isNewUser: false,
  })

  const { records, actionItems, lawFirmData, searchTerm, urgentId, isNewUser } = state

  useEffect(() => {
    if (typeof newRecords !== 'string') {
      dispatch({ type: 'init', newRecords, newLawFirm })
    }
  }, [newLawFirm, newRecords])

  return (
    <RecordsContext.Provider
      value={{
        dispatch,
        records,
        actionItems,
        lawFirmData,
        searchTerm,
        urgentId,
        isNewUser,
      }}
    >
      {children}
    </RecordsContext.Provider>
  )
}

export { RecordsContext, RecordsProvider }
