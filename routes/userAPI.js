const express = require('express');
const passport = require('passport');

const router = express.Router();
const UserController = require('../src/users/UserController');

router.get('/info', UserController.user_info_get);

router.post('/register', UserController.user_register_post);

router.get('/login', UserController.user_login_get);
router.post('/login', UserController.user_login_post);

router.get('/logout', UserController.user_logout_get);

router.get('/', (req, res) => {
  res.render('user');
});

module.exports = router;
