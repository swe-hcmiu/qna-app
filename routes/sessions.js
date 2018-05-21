var express = require('express');
var router = express.Router();
var EditorSessionService = require('../model/Services/EditorSessionService.js');
var UserSessionService = require('../model/Services/UserSessionService.js');


router.get('/', function(req, res, next) {
  	
	if (req.user) {
		res.render('session');
	} else {
		req.flash('error_msg','Log in first');
		res.redirect('/users/login');
	}

});

router.get('/:sessionId', function(req, res, next) {
	var editorSessionService = new EditorSessionService();

	editorSessionService.getSessionById(req.params.sessionId, (err, result) => {
		if (err) throw err;
		res.send(result);
	})
})


router.post('/', function(req, res, next) {
  
	var editorSessionService = new EditorSessionService();

	if (req.user) {
		console.log(req.user);
		let userId = req.user.UserId;
		let sessionName = req.body.sessionName;
		let sessionType = req.body.sessionType;
		let session = {sessionName, sessionType};
		console.log('Session', session);

		editorSessionService.createSession(userId, session, (err, result) => {
			if (err) throw err;
			res.redirect(`/sessions/${result}`);
		});
	}

});

module.exports = router;