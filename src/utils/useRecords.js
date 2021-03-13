import { useState, useEffect } from 'react'

const useRecords = (user) => {
  const [error, setError] = useState(false)
  const [records, setRecords] = useState('loading')
  const [lawFirmData, setLawFirmData] = useState('loading')
  useEffect(() => {
    if (typeof user !== 'string' && user) {
      fetch('/.netlify/functions/lawFirmData', {
        method: 'POST',
        body: JSON.stringify({ uid: user.uid }),
      })
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          if (data?.err) {
            setRecords([])
            setError(true)
          }
          if (data?.lawFirmRecords?.length) {
            setRecords(data.lawFirmRecords)
          }
          if (data?.userLawFirmData) {
            setLawFirmData(data.userLawFirmData)
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('err', err)
        })
    }
  }, [user])
  return { records, lawFirmData, error }
}

export default useRecords
