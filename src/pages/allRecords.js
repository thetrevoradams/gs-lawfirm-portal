import React, { useContext } from 'react'
import ActionItem from '../components/actionItem'
import Spinner from '../components/spinner'
import RecordsContext from '../context/recordsContext'

const ActionItems = ({ loading }) => {
  const records = useContext(RecordsContext)
  return (
    <div className="w-full h-full min-h-screen bg-gsLightBg">
      <>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {!records && <div>Error fetching data. Please refresh the page to try again</div>}
            {records?.length <= 0 ? (
              <div>No records to display</div>
            ) : (
              <>
                {records?.map((record) => (
                  <ActionItem record={record} key={record['GS DebtorID']} />
                ))}
              </>
            )}
          </>
        )}
      </>
    </div>
  )
}

export default ActionItems
