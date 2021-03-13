const submitResp = async ({ recordId, response, urgentId, itemHistory, date, lawFirmData, record }) => {
  try {
    const submissionRaw = await fetch('/.netlify/functions/responseManager', {
      method: 'POST',
      body: JSON.stringify({
        recordId,
        response,
        urgentId,
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
const addAttachment = async ({ record, file, fileMetaData }) => {
  try {
    /** Create Attachment */
    const submissionRaw = await fetch('/.netlify/functions/responseManager', {
      method: 'POST',
      body: JSON.stringify({ type: 'addAttachment', record, fileMetaData }),
    })
    const data = await submissionRaw.json()
    console.log(`addAttachment -> submissionRaw:data`, data)

    if (data.endpoint) {
      /** Upload File */
      const uploadFile = await fetch(data.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.dataToken}`,
        },
        body: file,
      })
      const resp = await uploadFile.json()
      console.log(`addAttachment -> resp`, resp)
      return { success: resp.messages[0].message === 'OK' }
    }
    return { error: true }
  } catch (error) {
    // console.error('error', error)
    return error
  }
}

export { submitResp, addLegalAction, addAttachment }
