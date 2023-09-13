const httpStatus = require('http-status');
const { dropboxService } = require('../services');

const openaiService = require('../services/openai.service');
const convertService = require('../services/convert.service');

const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
//const fs = require('fs');

const createSignURL = catchAsync(async (req, res) => {
  // 1. send text to ChatGPT to get petition content
  const petition = await openaiService.generatePetition();
  res.send(petition);
  //   res.send('Received');

  // 2. convert petition content to pdf file
  convertService.convertToPDF(petition);

  // 3. generate signature_id
  //   const signId = await dropboxService.generateSignatureId();

  //   // 4. generate signature_url
  //   const signUrl = await dropboxService.generateSignUrl(signId);
  //   res.status(httpStatus.CREATED).send(signUrl);
});

const getAllPetitions = catchAsync(async (req, res) => {
  const petitions = 'Placeholder';
  res.send(petitions);
});

module.exports = {
  createSignURL,
  getAllPetitions,
};
