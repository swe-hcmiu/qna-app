const EditorSessionService = require('../Services/EditorSessionService');
const UserService = require('../Services/UserService');
const SessionService = require('../Services/SessionService');

exports.session_get = async (req, res) => {
  res.render('session');
};

exports.session_post = async (req, res) => {
  try {
    const editorSessionService = new EditorSessionService();
    const userId = req.user.UserId;
    const { sessionName, sessionType } = req.body;
    const session = { sessionName, sessionType };

    const sessionId = await editorSessionService.createSession(userId, session);
    res.redirect(`/sessions/${sessionId}`);
  } catch (err) {
    throw err;
  }
};

exports.sessionId_get = async (req, res) => {
  try {
    const userService = new UserService();
    const sessionService = new SessionService();

    const userId = userService.getUserId(req.user);
    const { sessionId } = req.params;
    const result = await userService.getRoleOfUserInSession(userId, sessionId);
    const role = result.Role;
    const service = sessionService.getServiceByRole(role);

    const [session, listOfQuestions] = await Promise.all([service.getSessionById(sessionId),
      service.getQuestionsOfSession(sessionId)]);
    const returnObj = { session, listOfQuestions };
    res.send(returnObj);
  } catch (err) {
    throw err;
  }
};
