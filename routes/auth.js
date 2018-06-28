var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/google',passport.authenticate('google',{scope:['profile',
	'https://www.googleapis.com/auth/userinfo.email']}));

router.get('/google/callback',
	passport.authenticate('google',{failureRedirect:'/users/login'}),
	function(req,res) {
		res.redirect('/');	
	}
);

module.exports = router;