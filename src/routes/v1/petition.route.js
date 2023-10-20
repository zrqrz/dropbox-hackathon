const express = require('express');
const petitionController = require('../../controllers/petition.controller');

const router = express.Router();

router.route('/').post(petitionController.createPetition);

router.route('/text').post(petitionController.createPetitionText);

router.route('/allpetitions').get(petitionController.getAllPetitions);

router.route('/:id').get(petitionController.getPetition);

router.route('/').get(petitionController.searchPetition); //search petitions by user input text

router.route('/').put(petitionController.updatePDFInDB);

router.route('/:id').put(petitionController.signPetition);

router.route('/:id').delete(petitionController.deletePetition);

module.exports = router;
