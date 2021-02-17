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
      Authorization: `Fmid ${clarisIdToken}`,
    },
    body: JSON.stringify({ fmDataSource: [{ database: 'GS Reports' }] }),
  })
  const tokenJson = await tokenRaw.json()
  return tokenJson
}

async function submitResp({ dataToken, uid, recordId, response, urgentId }) {
  // TODO: Trigger email if 'urgentId' is present

  const dateVal = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  const dataRaw = await fetch(`${process.env.REACT_DB_EDIT_URL}/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataToken}`,
    },
    body: JSON.stringify({
      fieldData: {
        UpdateResponse_app: JSON.stringify({
          date: dateVal,
          response,
          submittedBy: uid,
        }),
        UpdateResponse: response,
        UpdateResponseDate: dateVal,
      },
    }),
  })
  const json = await dataRaw.json()
  return json
}

exports.handler = async (entry) => {
  const { uid, recordId, response } = JSON.parse(entry.body)
  try {
    const resp = await fetchClarisId()

    if (!resp.error) {
      // --- DATA TOKEN ---
      const tokenJson = await fetchToken(resp.clarisIdToken)
      const dataToken = tokenJson.response.token

      if (dataToken) {
        // --- GET USER'S LAW FIRM DETAILS ---
        const submissionResp = await submitResp({ dataToken, uid, recordId, response })
        if (submissionResp) {
          return {
            statusCode: 200,
            body: JSON.stringify(submissionResp),
          }
        }
        return {
          statusCode: 500,
          body: JSON.stringify({ msg: submissionResp.msg }),
        }
      }
    }
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
