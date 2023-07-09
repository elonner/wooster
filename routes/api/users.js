const express = require('express');
const router = express.Router();
const usersCtrl = require('../../controllers/api/users');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// All paths start with '/api/users'

// GET /api/users 
router.get('/', usersCtrl.index);
// GET /api/users/search
router.get('/search', usersCtrl.getByUsername);
// GET /api/users/:id
router.get('/:id', usersCtrl.detail);
// POST /api/users (create a user - sign up)
router.post('/', usersCtrl.create);
// POST /api/users/login
router.post('/login', usersCtrl.login);

module.exports = router;