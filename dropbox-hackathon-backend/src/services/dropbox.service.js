const DropboxSign = require('@dropbox/sign');
const fs = require('fs');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const signatureRequestApi = new DropboxSign.SignatureRequestApi();

/**
 * Generate Dropbox signature_id
 * @param: signer name, emailAddress, pdf file
 * @returns signature_id
 */
async function generateSignatureId() {
  // Configure HTTP basic authorization: api_key
  signatureRequestApi.username = 'YOUR_API_KEY';

  // to be replaced by signer info from frontend
  const signer1 = {
    emailAddress: 'example@gmail.com',
    name: 'example',
  };

  const signingOptions = {
    draw: true,
    type: true,
    upload: true,
    phone: true,
    defaultType: 'draw',
  };

  const data = {
    clientId: 'YOUR_CLIENT_ID',
    // to be replaced by title from frontend
    title: 'Petition',
    subject: 'Consider petitioin',
    message: 'Please sign this petition. Let me know if you have any questions.',
    signers: [signer1],
    // to be replaced by pdf from ChatGPT
    files: [fs.createReadStream('../dropbox-hackathon-backend/src/petition.pdf')],
    signingOptions,
    testMode: true,
  };

  try {
    const response = await signatureRequestApi.signatureRequestCreateEmbedded(data);
    return response.body.signatureRequest.signatures[0].signatureId;
  } catch (error) {
    console.log('Exception when calling Dropbox Sign API:');
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
  embeddedApi.username = 'YOUR_API_KEY';

  try {
    const response = await embeddedApi.embeddedSignUrl(signId);
    console.log(response.body);
    return response.body.embedded.signUrl;
  } catch (error) {
    console.log('Exception when calling Dropbox Sign API:');
    console.log(error.body);
  }
}

module.exports = {
  generateSignatureId,
  generateSignUrl,
};
