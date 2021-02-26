import React, { useContext, useState } from 'react'
import ActionItem from '../components/actionItem'
import Spinner from '../components/spinner'
import { RecordsContext } from '../context/recordsContext'
import Toast from '../components/toast'
import StatusText from '../components/statusText'
import filterSearch from '../utils/searchUtil'

const ActionItems = ({ uid }) => {
  const { actionItems, searchTerm } = useContext(RecordsContext)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const displayed =
    searchTerm && typeof actionItems !== 'string'
      ? actionItems.filter((r) => filterSearch({ searchTerm, r }))
      : actionItems
  const loading = typeof actionItems === 'string'

  return (
    <div className="w-screen max-w-screen-lg h-full min-h-screen py-6 flex flex-col">
      <>
        {errorMsg && <Toast type="error" msg={errorMsg} onComplete={setErrorMsg} />}
        {successMsg && <Toast type="success" msg={successMsg} onComplete={setSuccessMsg} />}
        {loading ? (
          <Spinner />
        ) : (
          <>
            {!actionItems && <StatusText text="Error fetching data. Please refresh the page to try again" />}
            {actionItems?.length <= 0 ? (
              <StatusText text="No records to display" />
            ) : (
              <div className="min-w-screen-lg">
                <div className="flex flex-wrap max-w-screen-lg lg:w-full">
                  <p className="text-gsGrayText font-semibold pb-6 mx-8">Action Items</p>
                  {searchTerm && (
                    <p className="text-gsBlue font-normal italic pb-6 text-sm">
                      * Results are being filtered by your search
                    </p>
                  )}
                </div>
                {displayed.length === 0 && <StatusText text="No records match your search." />}
                {displayed?.map((record) => (
                  <ActionItem
                    record={record}
                    key={record.recordId}
                    uid={uid}
                    setErrorMsg={setErrorMsg}
                    setSuccessMsg={setSuccessMsg}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </>
    </div>
  )
}

export default ActionItems
