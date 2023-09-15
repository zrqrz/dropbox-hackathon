const httpStatus = require('http-status');
const { dropboxService, petitionService, openaiService, convertService } = require('../services');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');

const createPetitionText = catchAsync(async(req, res) => {
    const textpetition = await openaiService.generatePetition(req.body);
    res.send(textpetition);
});

const createPetition = catchAsync(async (req, res) => {
    const name = req.body.userName;
    const email = req.body.userEmail;
    const petitionTitle = req.body.title;
    const textPetition = req.body.petition;

    // 1. convert petition content to pdf file
    convertService.convertToPDF(textPetition);

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
        signUrl
    };
    res.status(httpStatus.CREATED).send(result);
});

const updatePDFInDB = catchAsync(async (req, res) => {
    const id = req.body.petitionId;
    const petitionData = await petitionService.getPetitionById(id);
    // Get pdf Uri from Dropbox
    const latestPDFUri = await dropboxService.downloadSignedPDFUri(petitionData.signRequestId);
    const updatedPetitionData = await petitionService.updatePetitionById(id, latestPDFUri);
    res.status(httpStatus.OK).send(updatedPetitionData);
});

const getAllPetitions = catchAsync(async (req, res) => {
    const petitions = "Placeholder";
    res.send(petitions);
});

module.exports = {
    createPetitionText,
    createPetition,
    getAllPetitions,
    updatePDFInDB
};