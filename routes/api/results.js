const express = require('express');
const router = express.Router();
const resultsCtrl = require('../../controllers/api/results');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// POST /api/results 
router.post('/', resultsCtrl.create);

module.exports = router;