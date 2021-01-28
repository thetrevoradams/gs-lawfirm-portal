import { useState, useEffect } from 'react'

const useData = () => {
  const [records, setRecords] = useState('loading')
  useEffect(() => {
    fetch('/.netlify/functions/lawFirmData')
      .then((resp) => resp.json())
      .then((data) => {
        console.log('data', data)
        if (data.length) {
          console.log(`~ data`, data)
          setRecords(data)
        }
      })
      .catch((err) => console.log('err', err))
  }, [])
  return { records }
}

export default useData
