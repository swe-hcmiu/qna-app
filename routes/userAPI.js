const express = require('express');

const router = express.Router();
const UserController = require('../src/users/UserController');

router.get('/info', UserController.user_info_get);

module.exports = router;
