const fetch = require('isomorphic-fetch')
require('dotenv').config()

async function fetchToken() {
  const tokenRaw = await fetch(process.env.REACT_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.REACT_TOKEN_AUTH,
    },
    body: JSON.stringify({ fmDataSource: [{ database: 'Mutual of Omaha - Collections' }] }),
  })
  const tokenJson = await tokenRaw.json()
  return tokenJson
}

async function fetchLawFirmData(token, firmMasterId = '1046') {
  const dataRaw = await fetch(process.env.REACT_DB_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: [{ LawFirmMasterID: firmMasterId }] }),
  })
  const json = await dataRaw.json()
  return json
}

exports.handler = async function(event) {
  try {
    const tokenJson = await fetchToken()
    if (tokenJson?.response?.token) {
      // TODO: Add the step to get the law-firm's id from passed in query param
      const data = await fetchLawFirmData(tokenJson.response.token)
      let resp = data
      if (data.response.data) {
        resp = data.response.data.map((item) => item.fieldData)
      }
      return {
        statusCode: 200,
        body: JSON.stringify(resp),
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: tokenJson.messages }),
    }
  } catch (error) {
    console.log(error) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error }),
    }
  }
}
