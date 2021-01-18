import React from 'react'
import { Router } from '@reach/router'
import useUser from './utils/useUser'
import ActionItems from './screens/actionItems'
import AllRecords from './screens/allRecords'
import NotFound from './screens/notFound'
import Header from './components/header'
import Nav from './components/nav'
import FullPageSpinner from './components/fullPageSpinner'
import './styles/global.css'

const Login = React.lazy(() => import('./screens/login'))

function App() {
  const userData = useUser()
  console.log(`App ~ userData`, userData)

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {typeof userData.user === 'string' && <FullPageSpinner />}
      {typeof userData.user !== 'string' && userData.user ? (
        <>
          <Header />
          <Nav />
          <Router primary={false}>
            <ActionItems path="/" />
            <AllRecords path="records" />
            <NotFound default />
          </Router>
        </>
      ) : (
        <Login />
      )}
    </React.Suspense>
  )
}

export default App
