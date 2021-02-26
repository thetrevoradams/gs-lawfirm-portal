import React from 'react'
import { useUser } from './utils'
import FullPageSpinner from './components/fullPageSpinner'
import AppWrapper from './components/appWrapper'
import { RecordsProvider } from './context/recordsContext'

import './styles/global.css'

const Login = React.lazy(() => import('./pages/login'))

function App() {
  const userData = useUser()

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {typeof userData.user === 'string' && <FullPageSpinner />}
      {typeof userData.user !== 'string' && userData.user ? (
        <RecordsProvider user={userData.user}>
          <AppWrapper user={userData.user} />
        </RecordsProvider>
      ) : (
        <Login />
      )}
    </React.Suspense>
  )
}

export default App
