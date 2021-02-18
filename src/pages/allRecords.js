import React, { useContext, useState } from 'react'
import RecordItem from '../components/recordItem'
import Spinner from '../components/spinner'
import ActionItemsContext from '../context/actionItemsContext'
import filterSearch from '../utils/searchUtil'
import StatusText from '../components/statusText'
import Toast from '../components/toast'

const AllRecords = ({ loading, records, uid }) => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const { searchTerm } = useContext(ActionItemsContext)
  const displayed = searchTerm ? records.filter((r) => filterSearch({ searchTerm, r })) : records

  return (
    <div className="w-screen max-w-screen-lg h-full min-h-screen min-h-screen py-6 flex flex-col">
      <>
        {errorMsg && <Toast type="error" msg={errorMsg} onComplete={setErrorMsg} />}
        {successMsg && <Toast type="success" msg={successMsg} onComplete={setSuccessMsg} />}
        {loading ? (
          <Spinner />
        ) : (
          <>
            {!records && <StatusText text="Error fetching data. Please refresh the page to try again" />}
            {records?.length <= 0 ? (
              <StatusText text="No records to display" />
            ) : (
              <div className="min-w-screen-lg">
                <div className="flex flex-wrap max-w-screen-lg lg:w-full pb-2">
                  <p className="text-gsGrayText font-semibold mx-8">
                    Records ({searchTerm ? `${displayed?.length || 0} / ${records?.length}` : displayed?.length || 0})
                  </p>
                  {searchTerm && (
                    <p className="text-gsBlue font-normal italic text-sm">
                      * Results are being filtered by your search
                    </p>
                  )}
                </div>
                <div
                  className="font-normal text-gsLightGray grid text-sm pl-5 py-4 mx-8 sticky bg-gsLightBg w-full z-10 border-b border-gsLightGray border-opacity-10"
                  style={{ gridTemplateColumns: '280px 185px auto', top: '131px' }}
                >
                  <span>Case Name</span>
                  <span>Counsel File #</span>
                  <span>State</span>
                </div>
                {displayed.length === 0 && <StatusText text="No records match your search." />}
                {displayed?.map((record) => (
                  <RecordItem
                    record={record}
                    key={`r${record.recordId}`}
                    setSuccessMsg={setSuccessMsg}
                    setErrorMsg={setErrorMsg}
                    uid={uid}
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

export default AllRecords
