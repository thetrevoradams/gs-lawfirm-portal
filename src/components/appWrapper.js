import React, { useContext } from 'react'
import { Router } from '@reach/router'
import NotFound from '../pages/notFound'
import Header from './header'
import Nav from './nav'
import { RecordsContext } from '../context/recordsContext'
import FullPageSpinner from './fullPageSpinner'

const ActionItems = React.lazy(() => import('../pages/actionItems'))
const AllRecords = React.lazy(() => import('../pages/allRecords'))
const NewUser = React.lazy(() => import('../pages/newUser'))

function AppWrapper({ user }) {
  const { records, isNewUser } = useContext(RecordsContext)
  return (
    <>
      {typeof records === 'string' || typeof isNewUser === 'string' ? (
        <FullPageSpinner light />
      ) : (
        <>
          {isNewUser ? (
            <NewUser uid={user?.uid} />
          ) : (
            <>
              <div className="sticky top-0 z-10">
                <Header />
                <Nav />
              </div>
              <div className="flex flex-col xl:items-center bg-gsLightBg">
                <Router>
                  <ActionItems path="/" uid={user?.uid} />
                  <AllRecords path="/records" uid={user?.uid} />
                  <NotFound default />
                </Router>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default AppWrapper
