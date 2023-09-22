const httpStatus = require('http-status');
const { dropboxService, petitionService, openaiService, convertService } = require('../services');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');

const createPetitionText = catchAsync(async (req, res) => {
  const textpetition = await openaiService.generatePetition(req.body);
  res.send(textpetition);
});

const createPetition = catchAsync(async (req, res) => {
  const name = req.body.userName;
  const email = req.body.userEmail;
  const petitionTitle = req.body.title;
  const textPetition = req.body.petition;

  // 1. convert petition content to pdf file
  await convertService.convertToPDF(textPetition);

  // 2. get signature response from Dropbox
  const signatureResponse = await dropboxService.generateSignatureRequestResponse(name, email, petitionTitle);
  const signId = signatureResponse.signatures[0].signatureId;

  // 3. save sign info to mongoDB and get cur petition ID
  const newPetition = await petitionService.savePetition(signatureResponse, signId);
  const petitionId = newPetition._id;

  // 4. generate signature_url
  const signUrl = await dropboxService.generateSignUrl(signId);
  const result = {
    petitionId,
    signId,
    signUrl,
  };
  res.status(httpStatus.CREATED).send(result);
});

// Get latest pdf and update the data record in MongoDB
const updatePDFInDB = catchAsync(async (req, res) => {
  const id = req.body.petitionId;

  const signId = req.body.signId;

  const petitionData = await petitionService.getPetitionById(id);
  // Get pdf Uri from Dropbox
  const latestPDFUri = await dropboxService.downloadSignedPDFUri(petitionData.signRequestId);

  // Update signature status
  // const newSignatures = petitionData.signatures.map((item) => {
  //   if (item.signatureId === signId) {
  //     return { ...item, isUsed: true };
  //   }
  //   return item;
  // });
  petitionData.signatures.forEach((item) => {
    if (item.signatureId === signId) {
      item.isUsed = true;
    }
  });

  //const updatedPetitionData = await petitionService.updatePetitionById(id, latestPDFUri, newSignatures);
  const updatedPetitionData = await petitionService.updatePetitionById(id, latestPDFUri, petitionData.signatures);
  res.status(httpStatus.OK).send(updatedPetitionData);
});

const deletePetition = catchAsync(async (req, res) => {
  const petitionId = req.params.id;
  petitionService.removePetitionById(petitionId);
  res.status(httpStatus.OK).send('petition removed!');
});

const getAllPetitions = catchAsync(async (req, res) => {
  const petitions = await petitionService.getPetitions();
  res.status(httpStatus.OK).send(petitions);
});

const getPetition = catchAsync(async (req, res) => {
  const id = req.params.id;
  const petition = await petitionService.getPetitionById(id);
  res.status(httpStatus.OK).send(petition);
});

const searchPetition = catchAsync(async (req, res) => {
  const text = req.body.text;
  const petitions = await petitionService.searchPetitionByText(text);
  // console.log('search succeed!!');
  if (Array.isArray(petitions) && petitions.length) {
    res.status(httpStatus.OK).send(petitions);
  } else {
    res.status(404).send('No related petitions!');
  }
});

// Group Sign
const signPetition = catchAsync(async (req, res) => {
  const petitionId = req.params.id;
  const petition = await petitionService.getPetitionById(petitionId);
  //find the signatureId that is not signed yet
  const signId = petitionService.getUnsignedSignId(petition);
  if (!signId) {
    res.status(404).send('No more space to sign this petition!');
    return;
  }
  //generate signature_url
  const signUrl = await dropboxService.generateSignUrl(signId);
  const result = {
    petitionId,
    signId,
    signUrl,
  };
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createPetitionText,
  createPetition,
  getAllPetitions,
  getPetition,
  updatePDFInDB,
  searchPetition,
  signPetition,
  deletePetition,
};
