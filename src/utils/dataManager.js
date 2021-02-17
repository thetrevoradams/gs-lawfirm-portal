import React from 'react'

const submitResp = async ({ uid, recordId, response, urgentId }) => {
  try {
    const submissionRaw = await fetch('/.netlify/functions/responseManager', {
      method: 'POST',
      body: JSON.stringify({ uid, recordId, response, urgentId }),
    })
    const data = await submissionRaw.json()
    return { success: data.messages[0].message === 'OK' }
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const handleSomething = () => {
  return <div />
}

export { submitResp, handleSomething }
