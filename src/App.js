import React, { useState, useEffect } from 'react'
import { Router } from '@reach/router'
import { useUser, useRecords } from './utils'
import ActionItems from './pages/actionItems'
import AllRecords from './pages/allRecords'
import NotFound from './pages/notFound'
import Header from './components/header'
import Nav from './components/nav'
import FullPageSpinner from './components/fullPageSpinner'
import ActionItemsContext from './context/actionItemsContext'
import './styles/global.css'

const Login = React.lazy(() => import('./pages/login'))

function useQuery() {
  return new URLSearchParams(window.location?.search)
}

function App() {
  const query = useQuery()
  const [actionItems, setActionItems] = useState([])
  const [searchTerm, setSearchTerm] = useState(query.get('u') || '')
  const [urgentId, setUrgentId] = useState(query.get('u'))
  const userData = useUser()
  const { records, lawFirmData } = useRecords(userData.user)

  useEffect(() => {
    if (typeof records !== 'string') {
      const oldActionItems = records.filter((item) => item.UpdateRequest && !item.UpdateResponse)

      let newActionItems = []
      records.forEach((record) => {
        if (record?.requestHistory) {
          const entries = JSON.parse(record.requestHistory)
          newActionItems = entries.filter((item) => item.reqMsg && !item.respMsg)
        }
      })

      setActionItems([...newActionItems, ...oldActionItems])
    }
  }, [records])

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {typeof userData.user === 'string' && <FullPageSpinner />}
      {typeof userData.user !== 'string' && userData.user ? (
        <ActionItemsContext.Provider
          value={{ actionItems, setActionItems, searchTerm, setSearchTerm, urgentId, setUrgentId, lawFirmData }}
        >
          <div className="sticky top-0 z-10">
            <Header />
            <Nav />
          </div>
          <div className="flex flex-col xl:items-center bg-gsLightBg">
            <Router primary={false}>
              <ActionItems path="/" loading={typeof records === 'string'} uid={userData.user?.uid} />
              <AllRecords
                path="records"
                loading={typeof records === 'string'}
                records={records}
                uid={userData.user?.uid}
              />
              <NotFound default />
            </Router>
          </div>
        </ActionItemsContext.Provider>
      ) : (
        <Login />
      )}
    </React.Suspense>
  )
}

export default App
