const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const auth = require('../../auth/auth.service');

/* User */
router.post('/', controller.create);
router.get('/', auth.isAuthenticated(), controller.get);

module.exports = router;
