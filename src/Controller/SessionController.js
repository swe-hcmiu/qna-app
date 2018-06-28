var EditorSessionService = require('../Services/EditorSessionService');
var UserSessionService = require('../Services/UserSessionService');
var UserService = require('../Services/UserService');
var SessionService = require('../Services/SessionService');

exports.session_get = async (req,res,next) => {
	res.render('session');
};

exports.session_post = async (req,res,next) => {
	try {
		const editorSessionService = new EditorSessionService();
		const userId = req.user.UserId;
		const sessionName = req.body.sessionName;
		const sessionType = req.body.sessionType;
		const session = {sessionName, sessionType};

		const sessionId = await editorSessionService.createSession(userId, session);
		res.redirect(`/sessions/${sessionId}`);
	}
	catch(err) {
		throw err;
	}
}

exports.sessionId_get = async (req,res,next) => {
	try {
		const userService = new UserService();
		const sessionService = new SessionService();
		
		const userId = userService.getUserId(req.user);
		const sessionId = req.params.sessionId;
		const result = await userService.getRoleOfUserInSession(userId, sessionId);
		const role = result.Role;
		const service = sessionService.getServiceByRole(role);
		
		const [session, listOfQuestions] = await Promise.all([service.getSessionById(sessionId), service.getQuestionsOfSession(sessionId)]);
		const returnObj = {session, listOfQuestions};
		res.send(returnObj);
	}
	catch(err) {
		throw err;
	}
};
