const DropboxSign = require('@dropbox/sign');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const fs = require('fs');

const signatureRequestApi = new DropboxSign.SignatureRequestApi();

/**
 * Generate Dropbox signature_id 
 * @param: signer name, emailAddress, pdf file
 * @returns signature_id
 */
async function generateSignatureRequestResponse(username, email, petitionTitle) {
  // Configure HTTP basic authorization: api_key
  signatureRequestApi.username = process.env.DROPBOX_API_KEY;

  const allSigners = [
    {
      emailAddress: email,
      name: username,
    },
    {
      emailAddress: "player1@gmail.com",
      name: "player1",
    },
    {
      emailAddress: "player2@gmail.com",
      name: "player2",
    },
    {
      emailAddress: "player3@gmail.com",
      name: "player3",
    },
    {
      emailAddress: "player4@gmail.com",
      name: "player4",
    },
    {
      emailAddress: "player5@gmail.com",
      name: "player5",
    },
    {
      emailAddress: "player6@gmail.com",
      name: "player6",
    },
    {
      emailAddress: "player7@gmail.com",
      name: "player7",
    },
    {
      emailAddress: "player8@gmail.com",
      name: "player8",
    },
    {
      emailAddress: "player9@gmail.com",
      name: "player9",
    }
  ]

  const signingOptions = {
    draw: true,
    type: true,
    upload: true,
    phone: true,
    defaultType: "draw",
  };

  const data = {
    clientId: process.env.DROPBOX_CLIENT_ID,
    title: petitionTitle,
    subject: "Petition",
    message: "Please sign this petition. Let me know if you have any questions.",
    signers: allSigners,
    files: [fs.createReadStream('../dropbox-hackathon-backend/src/temp_files/tmpPetition.pdf')],
    signingOptions,
    testMode: true,
  };

  try {
    const response = await signatureRequestApi.signatureRequestCreateEmbedded(data);
    return response.body.signatureRequest;
  } catch (error) {
    console.log("Exception when calling Dropbox Sign API:");
    console.log(error.body);
  }
}

/**
 * Generate Dropbox signature_url
 * @param {*} signId 
 * @returns signature_url to be displayed in frontend
 */
async function generateSignUrl(signId) {
  const embeddedApi = new DropboxSign.EmbeddedApi();

  // Configure HTTP basic authorization: api_key
  embeddedApi.username = process.env.DROPBOX_API_KEY;

  try {
    const response = await embeddedApi.embeddedSignUrl(signId);
    console.log(response.body);
    return response.body.embedded.signUrl;
  } catch (error) {
    console.log("Exception when calling Dropbox Sign API:");
    console.log(error.body);
  }
}

async function downloadSignedPDFUri(signRequestId) {
  signatureRequestApi.username = process.env.DROPBOX_API_KEY;
  try {
    const signatureRequestId = signRequestId;
    const response = await signatureRequestApi.signatureRequestFilesAsDataUri(signatureRequestId);
    return response.body.dataUri;
  } catch (error) {
    console.log("Exception when calling Dropbox Sign API:");
    console.log(error.body);
  }
}

module.exports = {
  generateSignatureRequestResponse,
  generateSignUrl,
  downloadSignedPDFUri
};