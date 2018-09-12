let express = require('express');
let router = express.Router();
let controller = require('./user.controller');

/* get User Profile */
router.post('/', controller.create);

module.exports = router;
