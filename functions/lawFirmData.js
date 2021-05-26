const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const fetch = require('isomorphic-fetch')
require('dotenv').config()

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
  console.log('tokenRaw resp', { status: tokenRaw.status, statusText: tokenRaw.statusText })
  const tokenJson = await tokenRaw.json()
  return tokenJson
}

async function fetchUserLawFirm(dataToken, uid) {
  const dataRaw = await fetch(`${process.env.REACT_DB_USER_URL}/_find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    },
    body: JSON.stringify({ query: [{ FirebaseUID: uid }] }),
  })
  const json = await dataRaw.json()
  return json
}
async function fetchLawFirmData(dataToken, LawFirmMasterID) {
  const dataRaw = await fetch(`${process.env.REACT_DB_URL}/_find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    },
    body: JSON.stringify({ query: [{ LawFirmMasterID }] }),
  })
  const json = await dataRaw.json()
  return json
}

async function logout(dataToken) {
  const dataRaw = await fetch(`${process.env.REACT_TOKEN_URL}/${dataToken}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(`logout -> dataRaw`, dataRaw)
  const json = await dataRaw.json()
  return json
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

exports.handler = async (event) => {
  const { uid } = JSON.parse(event.body)

  try {
    const resp = await fetchClarisId()

    if (!resp.error) {
      // --- DATA TOKEN ---
      console.log(`exports.handler= -> resp.clarisIdToken`, resp.clarisIdToken)
      const tokenJson = await fetchToken(resp.clarisIdToken)
      const dataToken = tokenJson.response.token

      if (dataToken) {
        // --- GET USER'S LAW FIRM DETAILS ---
        const firmResp = await fetchUserLawFirm(dataToken, uid)
        const firmData = firmResp.response ? firmResp.response.data[0] : { fieldData: {} }
        const userLawFirmData = { ...firmData.fieldData, recordId: firmData.recordId }

        if (firmData.recordId) {
          // --- GET LAW FIRM RECORDS ---
          const recordData = await fetchLawFirmData(dataToken, userLawFirmData.LawFirmMasterId)
          // --- LOGOUT OF DB ---
          await logout(dataToken)

          const lawFirmRecords = recordData.response.data.map((item) => ({
            ...item.fieldData,
            recordId: item.recordId,
            attachments: item.portalData.Attachments || [],
            notes: item['Notes::Note'] || '',
            LegalActionStatusDateFormatted: item.fieldData.LegalActionStatusDate
              ? formatDate(item.fieldData.LegalActionStatusDate)
              : '',
            UpdateRequestDateFormatted: item.fieldData.UpdateRequestDate
              ? formatDate(item.fieldData.UpdateRequestDate)
              : '',
            UpdateResponseDateFormatted: item.fieldData.UpdateResponseDate
              ? formatDate(item.fieldData.UpdateResponseDate)
              : '',
          }))

          return {
            statusCode: 200,
            body: JSON.stringify({ lawFirmRecords, userLawFirmData }),
          }
        }
        return {
          statusCode: 500,
          body: JSON.stringify({ err: firmResp.msg }),
        }
      }
    }
    console.log('error resp', resp) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ err: resp.error }),
    }
  } catch (error) {
    console.log('error', error) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ err: error }),
    }
  }
}
