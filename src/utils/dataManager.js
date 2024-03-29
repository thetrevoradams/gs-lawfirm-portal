/* eslint-disable no-console */
const submitResp = async ({ recordId, response, urgent, itemHistory, date, lawFirmData, record }) => {
  try {
    const submissionRaw = await fetch('/.netlify/functions/responseManager', {
      method: 'POST',
      body: JSON.stringify({
        recordId,
        response,
        urgent,
        type: 'actionResp',
        itemHistory,
        date,
        lawFirmData,
        record,
      }),
    })
    const data = await submissionRaw.json()
    return { success: data.messages[0].message === 'OK' }
  } catch (error) {
    // console.error('error', error)
    return error
  }
}

const addLegalAction = async ({ recordId, response, date, oldActions, itemHistory }) => {
  try {
    const submissionRaw = await fetch('/.netlify/functions/responseManager', {
      method: 'POST',
      body: JSON.stringify({ recordId, response, oldActions, date, type: 'legalAction', itemHistory }),
    })
    const data = await submissionRaw.json()
    return { success: data.messages[0].message === 'OK' }
  } catch (error) {
    // console.error('error', error)
    return error
  }
}

export { submitResp, addLegalAction }
