const EditorSessionService = require('../services/EditorSessionService');
const UserService = require('../services/UserService');
const SessionService = require('../services/SessionService');

exports.session_get = async (req, res) => {
  res.render('session');
};

exports.session_post = async (req, res) => {
  try {
    const userId = req.user.UserId;
    const { sessionName, sessionType } = req.body;
    const session = { sessionName, sessionType };

    const sessionId = await EditorSessionService.createSession(userId, session);
    res.redirect(`/sessions/${sessionId}`);
  } catch (err) {
    throw err;
  }
};

exports.sessionId_get = async (req, res) => {
  try {
    const userId = UserService.getUserId(req.user);
    const { sessionId } = req.params;
    const result = await UserService.getRoleOfUserInSession(userId, sessionId);
    const role = result.Role;
    const service = SessionService.getServiceByRole(role);

    const [session, listOfQuestions] = await Promise.all([SessionService.getSessionById(sessionId),
      service.getQuestionsOfSession(sessionId)]);
    const returnObj = { session, listOfQuestions };
    res.send(returnObj);
  } catch (err) {
    throw err;
  }
};
