const express = require('express');

const router = express.Router();
const UserController = require('../src/controller/UserController');

router.get('/info', UserController.user_info_get);

module.exports = router;
