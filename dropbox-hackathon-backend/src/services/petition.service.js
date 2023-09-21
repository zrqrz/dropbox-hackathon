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
  const addedIsUsedArray = signaturesArray.map((obj) => ({ ...obj, isUsed: false }));
  // Update used signId status to true
  const resultArray = addedIsUsedArray.map((obj) => {
    if (obj.signatureId === signId) {
      return { ...obj, isUsed: true };
    }
    return obj;
  });

  const newPetition = new Petition({
    petitionName: signatureResponse.title,
    signRequestId: requestId,
    signatures: resultArray,
    data: null,
  });

  const savedPetition = await newPetition.save();
  return savedPetition;
};

const getPetitionById = async (petitionId) => {
  const petition = await Petition.findOne({ _id: petitionId });
  return petition;
};

const updatePetitionById = async (petitionId, latestPDFUri, newSignatures) => {
  const update = { data: latestPDFUri, signatures: newSignatures };
  const petition = await Petition.findOneAndUpdate({ _id: petitionId }, update, {
    new: true,
  });
  return petition;
};

const removePetitionById = async (petitionId) => {
  const petition = await Petition.findOneAndDelete({ _id: petitionId });
  return petition;
};

/**
 * Get all petitions from database
 */
const getPetitions = async () => {
  const petitions = await Petition.find({}, { _id: 1, petitionName: 1, data: 1 });
  return petitions;
};

/**
 * Get all related petitions query by user input text
 */
const searchPetitionByText = async (text) => {
  const petitions = await Petition.find({ $text: { $search: `${text}` } });
  return petitions;
};

const getUnsignedSignId = (petition) => {
  for (let signature of petition.signatures) {
    if (signature.isUsed) {
      const signId = signature.signatureId;
      break;
    }
  }
  return signId;
};

module.exports = {
  savePetition,
  getPetitions,
  getPetitionById,
  updatePetitionById,
  searchPetitionByText,
  getUnsignedSignId,
  removePetitionById,
};
