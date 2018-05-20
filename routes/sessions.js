var express = require('express');
var router = express.Router();
var SessionService = require('../model/SessionService.js');

router.get('/', function(req, res, next) {
  	
	if (req.user) {
		res.render('session');
	} else {
		req.flash('error_msg','Log in first');
		res.redirect('/users/login');
	}

});

router.get('/:sessionId', function(req, res, next) {
	var sessionService = new SessionService();

	sessionService.getSessionById(req.params.sessionId, (err, result) => {
		if (err) throw err;
		res.send(result);
	})
})


router.post('/', function(req, res, next) {
  
	var sessionService = new SessionService();

	if (req.user) {
		console.log(req.user);
		let userId = req.user.UserId;
		let sessionName = req.body.sessionName;
		let sessionType = req.body.sessionType;
		let session = {sessionName, sessionType};
		console.log('Session', session);

		sessionService.createSession(userId, session, (err, result) => {
			if (err) throw err;
			res.redirect(`/sessions/${result}`);
		});
	}

});

module.exports = router;