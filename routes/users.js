const express = require('express');

const router = express.Router();
const passport = require('passport');
const UserController = require('../src/users/UserController');

router.get('/register', UserController.user_register_get);
router.post('/register', UserController.user_register_post);

router.get('/login', UserController.user_login_get);
router.post('/login', passport.authenticate('local'), UserController.user_login_post);

router.get('/logout', UserController.user_logout_get);

router.get('/', (req, res) => {
  res.render('user');
});

module.exports = router;
