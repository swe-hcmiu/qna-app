var express = require('express');
var router = express.Router();
var UserService = require('../model/Services/UserService.js');
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

	var userService = new UserService();
	var userId = userService.getUserId(req.user);
	var sessionId = req.params.sessionId;
	console.log(`session ${sessionId} user ${userId}`);

	userService.getRoleOfUserInSession(userId, sessionId, (err, result) => {
		if (err) throw err;

		let role = result.Role;

		switch (role) {
			case 'USER':
				var service = new UserSessionService();
				break;
			case 'EDITOR':
				var service = new EditorSessionService();
				break;
			default:
				throw new Error('No role returned');

		}

		service.getSessionById(sessionId, (err, session) => {
			if (err) throw err;

			service.getQuestionsOfSession(sessionId, (err, listOfQuestions) => {
				if (err) throw err;
				returnObject = {session, listOfQuestions};
				res.send(returnObject);
			});
		})

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