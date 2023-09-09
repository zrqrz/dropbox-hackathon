const httpStatus = require('http-status');
const { dropboxService } = require('../services');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');

const createSignURL = catchAsync(async (req, res) => {
    // 1. send text to ChatGPT to get petition content

    // 2. convert petition content to pdf file

    // 3. generate signature_id
    const signId = await dropboxService.generateSignatureId();

    // 4. generate signature_url
    const signUrl = await dropboxService.generateSignUrl(signId);
    res.status(httpStatus.CREATED).send(signUrl);
});

const getAllPetitions = catchAsync(async (req, res) => {
    const petitions = "Placeholder";
    res.send(petitions);
});

module.exports = {
    createSignURL,
    getAllPetitions
};