const fs = require('fs').promises
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const fetch = require('isomorphic-fetch')
require('dotenv').config()
const mailgun = require('mailgun-js')({
  apiKey: process.env.REACT_MAILGUN_KEY,
  domain: 'guarantysolutions.com',
})

function asyncAuthenticateUser(cognitoUser, cognitoAuthenticationDetails) {
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(cognitoAuthenticationDetails, {
      onSuccess: resolve,
      onFailure: reject,
    })
  })
}

async function fetchClarisId() {
  const auth = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: process.env.REACT_CLARIS_USERNAME,
    Password: process.env.REACT_CLARIS_PASSWORD,
  })
  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.REACT_USER_POOL_ID,
    ClientId: process.env.REACT_USER_CLIENT_ID,
  })
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: process.env.REACT_CLARIS_USERNAME,
    Pool: userPool,
  })

  try {
    const result = await asyncAuthenticateUser(cognitoUser, auth)
    const accessToken = result.getAccessToken().getJwtToken()
    const clarisIdToken = result.idToken.jwtToken
    const refreshToken = result.refreshToken.token
    return { accessToken, clarisIdToken, refreshToken }
  } catch (error) {
    return { error }
  }
}

async function fetchToken(clarisIdToken) {
  const tokenRaw = await fetch(process.env.REACT_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `FMID ${clarisIdToken}`,
    },
    body: JSON.stringify({ fmDataSource: [{ database: 'GS Reports' }] }),
  })
  const tokenJson = await tokenRaw.json()
  return tokenJson
}

function sendEmailNotification({ lawFirmData: { FirstName, LastName, FirmName }, record, response }) {
  const data = {
    from: 'noreply@guarantysolutions.com',
    to: 'rcontreras@guarantysolutions.com, jevans@guarantysolutions.com',
    subject: 'Urgent Request Response',
    text: 'This is an html only email. Please enable html in your email client to view it.',
    html: `<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Document</title> <style> body { background-color: #f1f5fb; display: flex; justify-content: center; width: 100%; height: 100%; } .container { margin-top: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); color: #3b3b3f; background-color: white; height: max-content; overflow: hidden; } .content { padding: 14px; } .banner { padding: 14px 14px 0 14px; margin: 0; color: #E68917; text-transform: uppercase; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; } .fileContainer { padding: 8px 24px; border-radius: 8px; border: 1px solid#F7DCB9; width: max-content; } .fileItem span { margin: 0 0 6px 8px; } .resp { padding-bottom: 14px;} </style> </head> <body> <div class="container"><h3 class="banner">Urgent response submitted by ${FirstName} ${LastName} — ${FirmName}</h3> <div class="content"> <p>This response relates to the following file</p> <div class="fileContainer"> <p class="fileItem"><b>Collector</b> <span>${record[
      'MasterRecord::Collector'
    ] || 'Not Assigned'}</span></p> <p class="fileItem"><b>File Admin</b> <span>${record['MasterRecord::FileAdmin'] ||
      'Not Assigned'}</span></p><p class="fileItem"><b>ClientID</b> <span>${
      record.ClientID
    }</span></p> <p class="fileItem"><b>Collection Entity</b> <span>${
      record['MasterRecord::CollectionEntity_calc']
    }</span></p> <p class="fileItem"><b>MasterID_fk</b> <span>${
      record.MasterID_fk
    }</span></p> <p class="fileItem"><b>CaseName</b> <span>${
      record.CaseName
    }</span></p> <p class="fileItem"><b>CounselFileNumber</b> <span>${
      record.CounselFileNumber
    }</span></p></div> <p class="fileItem resp"><b>Response</b> <span>${response}</span></p></div></div> </body> </html>`,
  }

  mailgun.messages().send(data, (error) => {
    if (error) console.log(error)
  })
}

async function submitResp({ dataToken, recordId, response, urgent, itemHistory, date, lawFirmData, record }) {
  if (urgent) sendEmailNotification({ lawFirmData, record, response })

  const dataRaw = await fetch(`${process.env.REACT_DB_EDIT_URL}/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    },
    body: JSON.stringify({
      fieldData: {
        requestHistory: JSON.stringify(itemHistory),
        UpdateResponse: response,
        UpdateResponseDate: date,
        UrgentRequest: '',
        'Notes::Note': `--------------------------------------------------------\r${date}@${new Intl.DateTimeFormat(
          'en-US',
          { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'America/Phoenix', hour12: true }
        ).format(new Date())} by (Law Firm App):\r${record.UpdateRequest}\r\r${response}\r${record['Notes::Note']}`,
      },
    }),
  })
  const json = await dataRaw.json()
  return json
}

async function addLegalAction({ dataToken, recordId, response, date, oldActions, itemHistory }) {
  const dataRaw = await fetch(`${process.env.REACT_DB_EDIT_URL}/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    },
    body: JSON.stringify({
      fieldData: {
        LegalActionStatus_app: JSON.stringify(itemHistory),
        LegalActionStatus: `${response}\r${oldActions}`,
        LegalActionStatusDate: date,
      },
    }),
  })
  const json = await dataRaw.json()
  return json
}

async function latestRecord(dataToken, masterId) {
  const dataRaw = await fetch(`${process.env.REACT_DB_URL}/_find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    },
    body: JSON.stringify({ query: [{ MasterID_fk: masterId }] }),
  })
  const json = await dataRaw.json()
  return json
}

exports.handler = async (entry) => {
  const { recordId, response, type, date, oldActions, itemHistory, urgent, lawFirmData, record } = JSON.parse(
    entry.body
  )
  try {
    const resp = await fetchClarisId()

    if (!resp.error) {
      // --- DATA TOKEN ---
      const tokenJson = await fetchToken(resp.clarisIdToken)
      const dataToken = tokenJson.response.token

      const recordResp = await latestRecord(dataToken, record.MasterID_fk)
      const recordData = recordResp.response ? recordResp.response.data[0] : { fieldData: {} }
      const freshRecord = { ...recordData.fieldData, recordId: recordData.recordId }

      if (dataToken) {
        let submissionResp = ''
        if (type === 'actionResp') {
          // --- SUBMIT ACTION RESP ---
          submissionResp = await submitResp({
            dataToken,
            recordId,
            response,
            itemHistory,
            urgent,
            date,
            lawFirmData,
            record: freshRecord,
          })
        } else if (type === 'legalAction') {
          submissionResp = await addLegalAction({
            dataToken,
            recordId,
            response,
            date,
            oldActions,
            itemHistory,
          })
        }
        if (submissionResp) {
          return {
            statusCode: 200,
            body: JSON.stringify(submissionResp),
          }
        }
        console.log('submissionResp error resp', submissionResp)
        return {
          statusCode: 500,
          body: JSON.stringify({ msg: submissionResp.msg }),
        }
      }
    }
    console.log('error resp', resp)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: resp.error }),
    }
  } catch (error) {
    console.log(error) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error }),
    }
  }
}
