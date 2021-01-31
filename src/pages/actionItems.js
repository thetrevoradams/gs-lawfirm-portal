import React from 'react'
import ActionItem from '../components/actionItem'
import Spinner from '../components/spinner'

const ActionItems = ({ actionItems, loading }) => {
  return (
    <div className="w-full h-full min-h-screen bg-gsLightBg py-6 flex flex-col lg:items-center">
      <>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {!actionItems && <div>Error fetching data. Please refresh the page to try again</div>}
            {actionItems?.length <= 0 ? (
              <div>No records to display</div>
            ) : (
              <div min-w-screen-lg>
                <p className="text-gsGrayText font-semibold pb-6 mx-8">Action Items</p>
                {actionItems?.map((record) => (
                  <ActionItem record={record} key={record['GS DebtorID']} />
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
