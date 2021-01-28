import React from 'react'
import { Router } from '@reach/router'
import { useUser, useData } from './utils'
import ActionItems from './pages/actionItems'
import AllRecords from './pages/allRecords'
import NotFound from './pages/notFound'
import Header from './components/header'
import Nav from './components/nav'
import FullPageSpinner from './components/fullPageSpinner'
import RecordsContext from './context/recordsContext'
import './styles/global.css'

const Login = React.lazy(() => import('./pages/login'))

function App() {
  const { records } = useData()
  const userData = useUser()
  console.log(`App ~ userData`, userData)
  let actionItems = []
  if (typeof records !== 'string') {
    console.log('records', records)
    actionItems = records.filter((item) => item.UpdateRequest && !item.UpdateResponse)
  }
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {typeof userData.user === 'string' && <FullPageSpinner />}
      {typeof userData.user !== 'string' && userData.user ? (
        <>
          <div className="sticky top-0 z-10">
            <Header actionCount={actionItems.length} />
            <Nav />
          </div>
          <RecordsContext.Provider value={records}>
            <Router primary={false}>
              <ActionItems path="/" actionItems={actionItems} loading={typeof records === 'string'} />
              <AllRecords path="records" loading={typeof records === 'string'} />
              <NotFound default />
            </Router>
          </RecordsContext.Provider>
        </>
      ) : (
        <Login />
      )}
    </React.Suspense>
  )
}

export default App
