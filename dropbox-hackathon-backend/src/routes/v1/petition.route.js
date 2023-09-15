const express = require('express');
const petitionController = require('../../controllers/petition.controller');

const router = express.Router();

router.route('/').post(petitionController.createPetition);

router.route('/text').post(petitionController.createPetitionText);

router.route('/allpetitions').get(petitionController.getAllPetitions);

// router.route('/:id').get();

router.route('/').put(petitionController.updatePDFInDB);

module.exports = router;