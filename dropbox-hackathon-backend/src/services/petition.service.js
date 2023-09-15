const { Petition } = require('../models');
const fs = require('fs');

/**
 * Create a new petition and save it to database 
 */
const savePetition = async (signatureResponse, signId) => {
    const requestId = signatureResponse.signatureRequestId;
    const signArrayWithAllInfo = signatureResponse.signatures;
    // Extract only signatureId from Dropbox response
    const signaturesArray = signArrayWithAllInfo.map(({ signatureId }) => ({ signatureId }));
    // Add isUsed property
    const addedIsUsedArray = signaturesArray.map(obj => ({ ...obj, isUsed: 'false' }));
    // Update used signId status to true
    const resultArray = addedIsUsedArray.map(obj => {
        if (obj.signatureId === signId) {
            return { ...obj, isUsed: 'true' };
        }
        return obj;
    })

    const newPetition = new Petition({
        petitionName: signatureResponse.title,
        signRequestId: requestId,
        signatures: resultArray,
        data: null
    });

    const savedPetition = await newPetition.save();
    return savedPetition;
}

const getPetitionById = async (petitionId) => {
    const petition = await Petition.findOne({ _id: petitionId });
    return petition;
}

const updatePetitionById = async (petitionId, latestPDFUri) => {
    const update = { data: latestPDFUri };
    const petition = await Petition.findOneAndUpdate({ _id: petitionId }, update, {
        new: true
    });
    return petition;
}

module.exports = {
    savePetition,
    getPetitionById,
    updatePetitionById
}