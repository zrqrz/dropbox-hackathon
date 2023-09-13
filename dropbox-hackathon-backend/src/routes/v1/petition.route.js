const express = require('express');
const petitionController = require('../../controllers/petition.controller');

const router = express.Router();

router.route('/').post(petitionController.createSignURL);

router.route('/allpetitions').get(petitionController.getAllPetitions);

// router.route('/:id').get();

// router.route('/:id').put();

module.exports = router;
