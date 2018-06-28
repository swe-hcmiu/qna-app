var express = require('express');
var router = express.Router();
var UserController = require('../src/Controller/UserController');
var passport = require('passport');

router.get('/register',UserController.user_register_get);
router.post('/register',UserController.user_register_post);

router.get('/login',UserController.user_login_get);
router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash: true,successFlash:true}),
	UserController.user_login_post);

router.get('/logout',UserController.user_logout_get);

module.exports = router;
