const express = require('express');
const router = express.Router();
const resultsCtrl = require('../../controllers/api/results');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// POST /api/results 
router.post('/', resultsCtrl.create);
// GET /api/:userId/latest
router.get('/:userId/latest', resultsCtrl.latest);

module.exports = router;