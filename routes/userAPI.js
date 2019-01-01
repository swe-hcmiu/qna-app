const express = require('express');
const passport = require('passport');

const router = express.Router();
const UserController = require('../src/users/UserController');

router.post('/register', UserController.user_register_post);
router.get('/register/anonymous', UserController.user_register_anonymous_get);

router.get('/login', UserController.user_login_get);
router.post('/login', UserController.user_login_post);

module.exports = router;
