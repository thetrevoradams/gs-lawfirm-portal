import React from 'react'
import { Router } from '@reach/router'
import { useUser } from './utils'
import NotFound from './pages/notFound'
import Header from './components/header'
import Nav from './components/nav'
import FullPageSpinner from './components/fullPageSpinner'
import { RecordsProvider } from './context/recordsContext'
import './styles/global.css'

const Login = React.lazy(() => import('./pages/login'))
const ActionItems = React.lazy(() => import('./pages/actionItems'))
const AllRecords = React.lazy(() => import('./pages/allRecords'))
const NewUser = React.lazy(() => import('./pages/newUser'))

function App() {
  const userData = useUser()

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {typeof userData.user === 'string' && <FullPageSpinner />}
      {typeof userData.user !== 'string' && userData.user ? (
        <RecordsProvider user={userData.user}>
          <div className="sticky top-0 z-10">
            <Header />
            <Nav />
          </div>
          <div className="flex flex-col xl:items-center bg-gsLightBg">
            <Router primary={false}>
              <ActionItems path="/" uid={userData.user?.uid} />
              <AllRecords path="/records" uid={userData.user?.uid} />
              <NewUser path="/setup" uid={userData.user?.uid} />
              <NotFound default />
            </Router>
          </div>
        </RecordsProvider>
      ) : (
        <Login />
      )}
    </React.Suspense>
  )
}

export default App
