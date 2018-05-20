var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserService = require('../model/UserService.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register',(req,res,next) => {
	var userString = req.query.user;
	if (userString == null) {
		res.render('register', {errors: null});
	}
	else {
		var username = JSON.parse(userString).username;
		var userService = new UserService();

		userService.checkUserName(username,(message) => {
			var messageString = JSON.stringify(message);
			res.send(messageString); 
		});
	}
})

router.post('/register',(req,res,next) => {
	var newUser = {};
	newUser.username = req.body.username;
	newUser.password = req.body.password;
	newUser.email = req.body.email;

	req.checkBody('username','Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('email', 'Email is required').isEmail();

	var InputError = req.validationErrors();
	if (InputError) {
		res.render('register', {errors:InputError});
	}
	else {
		var userService = new UserService();

		userService.createUser(newUser,(err,user) => {
			if (err) {
				req.flash('error_msg','username already exists!');
				res.redirect('/users/register');
			}
			else {
				req.flash('success_msg','register successfully');
				res.redirect('/');
			}
		});
	}
})

router.get('/login', (req, res, next) => {
  	res.render('login');
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		var userService = new UserService();
		var user = {username:username,password:password};
		
		userService.authenticate(user,(err,user,message) => {
			done(err,user,message);
		})
}));

passport.serializeUser(function(user, done) {
  done(null, user.UserId);
});

passport.deserializeUser(function(id, done) {
  var userService = new UserService();
  userService.UserDAO.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login'
	,passport.authenticate('local', {successRedirect:'/'
		, failureRedirect:'/users/login',failureFlash: true,successFlash:true})
	, function(req, res) {
   		res.redirect('/');
 	 }
 );

router.get('/logout', (req, res, next) => {
	req.logout();
	req.flash('success_msg','You are logged out');
	res.redirect('/');
})

module.exports = router;
