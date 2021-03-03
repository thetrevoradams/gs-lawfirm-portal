// const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
// const fetch = require('isomorphic-fetch')
// require('dotenv').config()

// function asyncAuthenticateUser(cognitoUser, cognitoAuthenticationDetails) {
//   return new Promise((resolve, reject) => {
//     cognitoUser.authenticateUser(cognitoAuthenticationDetails, {
//       onSuccess: resolve,
//       onFailure: reject,
//     })
//   })
// }

// async function fetchClarisId() {
//   const auth = new AmazonCognitoIdentity.AuthenticationDetails({
//     Username: process.env.REACT_CLARIS_USERNAME,
//     Password: process.env.REACT_CLARIS_PASSWORD,
//   })
//   const userPool = new AmazonCognitoIdentity.CognitoUserPool({
//     UserPoolId: process.env.REACT_USER_POOL_ID,
//     ClientId: process.env.REACT_USER_CLIENT_ID,
//   })
//   const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
//     Username: process.env.REACT_CLARIS_USERNAME,
//     Pool: userPool,
//   })

//   try {
//     const result = await asyncAuthenticateUser(cognitoUser, auth)
//     const accessToken = result.getAccessToken().getJwtToken()
//     const clarisIdToken = result.idToken.jwtToken
//     const refreshToken = result.refreshToken.token
//     return { accessToken, clarisIdToken, refreshToken }
//   } catch (error) {
//     return { error }
//   }
// }

// async function fetchToken(clarisIdToken) {
//   const tokenRaw = await fetch(process.env.REACT_TOKEN_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Fmid ${clarisIdToken}`,
//     },
//     body: JSON.stringify({ fmDataSource: [{ database: 'GS Reports' }] }),
//   })
//   const tokenJson = await tokenRaw.json()
//   return tokenJson
// }

// async function fetchUserLawFirm(dataToken, uid) {
//   const dataRaw = await fetch(`${process.env.REACT_DB_USER_URL}/_find`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${dataToken}`,
//     },
//     body: JSON.stringify({ query: [{ FirebaseUID: uid }] }),
//   })
//   const json = await dataRaw.json()
//   return json
// }
// async function fetchLawFirmData(dataToken, LawFirmMasterID) {
//   const dataRaw = await fetch(`${process.env.REACT_DB_URL}/_find`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${dataToken}`,
//     },
//     body: JSON.stringify({ query: [{ LawFirmMasterID }] }),
//   })
//   const json = await dataRaw.json()
//   return json
// }

// function formatDate(date) {
//   return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
// }

// async function updateRecordWithAttachments(dataToken, record, index) {
//   if (record.RecordID_fk) {
//     let attachmentsRaw
//     try {
//       // attachmentsRaw = await fetch(`${process.env.REACT_DB_FILES_URL}/_find`, {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     Authorization: `Bearer ${dataToken}`,
//       //   },
//       //   body: JSON.stringify({ query: [{ RecordID_fk: record.RecordID_fk }] }),
//       // })

//       // if (attachmentsRaw) {
//       //   const json = await attachmentsRaw.json()
//       //   return { ...record, attachedFiles: json?.response?.data || [] }
//       // }

//       // --- FORMAT DATES ---
//       const { LegalActionStatusDate, UpdateRequestDate, UpdateResponseDate } = record
//       const legalActionStatusDateFormatted = LegalActionStatusDate ? formatDate(LegalActionStatusDate) : ''
//       const updateRequestDateFormatted = UpdateRequestDate ? formatDate(UpdateRequestDate) : ''
//       const updateResponseDateFormatted = UpdateResponseDate ? formatDate(UpdateResponseDate) : ''
//       return { ...record, legalActionStatusDateFormatted, updateRequestDateFormatted, updateResponseDateFormatted }
//     } catch (error) {
//       console.log('error', { error, attachmentsRaw, fk: record.RecordID_fk })
//     }
//   }
//   return record
// }

exports.handler = async (event) => {
  console.log('you called lawFirmData')
  const { uid } = JSON.parse(event.body)
  // console.log('with uid', uid)
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, uid }),
  }
  // try {
  //   const resp = await fetchClarisId()

  //   if (!resp.error) {
  //     // --- DATA TOKEN ---
  //     const tokenJson = await fetchToken(resp.clarisIdToken)
  //     const dataToken = tokenJson.response.token

  //     if (dataToken) {
  //       // --- GET USER'S LAW FIRM DETAILS ---
  //       const firmResp = await fetchUserLawFirm(dataToken, uid)
  //       const firmData = firmResp?.response?.data[0]
  //       const userLawFirmData = { ...firmData.fieldData, recordId: firmData.recordId }

  //       if (userLawFirmData) {
  //         // --- GET LAW FIRM RECORDS ---
  //         const recordData = await fetchLawFirmData(dataToken, userLawFirmData.LawFirmMasterId)
  //         let lawFirmRecords = recordData

  //         if (recordData?.response?.data) {
  //           // --- GET FILES ATTACHED TO CASES ---
  //           lawFirmRecords = await Promise.all(
  //             recordData.response.data.map((item) =>
  //               updateRecordWithAttachments(dataToken, { ...item.fieldData, recordId: item.recordId })
  //             )
  //           )
  //         }

  //         return {
  //           statusCode: 200,
  //           body: JSON.stringify({ lawFirmRecords, userLawFirmData }),
  //         }
  //       }
  //       return {
  //         statusCode: 500,
  //         body: JSON.stringify({ msg: firmResp.msg }),
  //       }
  //     }
  //   }
  //   console.log('error fetching Claris Id', resp) // output to netlify function log
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ msg: resp.error }),
  //   }
  // } catch (error) {
  //   console.log('you got an error', error) // output to netlify function log
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ msg: error }),
  //   }
  // }
}
