const EditorSessionService = require('../services/EditorSessionService');
const UserService = require('../services/UserService');
const SessionService = require('../services/SessionService');

exports.session_get = async (req, res) => {
  res.render('session');
};

exports.session_post = async (req, res) => {
  try {
    const userId = UserService.getUserId(req.user);
    const { sessionName, sessionType } = req.body;
    const session = { sessionName, sessionType };

    const sessionId = await EditorSessionService.createSession(userId, session);
    const returnObj = { sessionId };
    res.send(returnObj);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.sessionId_get = async (req, res) => {
  try {
    const userId = UserService.getUserId(req.user);
    const { sessionId } = req.params;

    const returnObj = await SessionService.getInfoSessionByRole(sessionId, userId);
    res.send(returnObj);
  } catch (err) {
    throw err;
  }
};

exports.sessionId_question_get = async (req, res) => {
  try {
    const userId = UserService.getUserId(req.user);
    const { sessionId } = req.params;

    const returnObj = await SessionService.getListOfQuestionsByRole(sessionId, userId);
    res.send(returnObj);
  } catch (err) {
    res.sendStatus(404);
  }
};

exports.sessionId_question_post = async (req, res) => {
  const { title, content } = req.body;
  const question = { title, content };
  const userId = UserService.getUserId(req.user);
  const { sessionId } = req.params;

  try {
    const questionId = await SessionService.addQuestionByRole(sessionId, userId, question);
    const returnObj = { questionId };
    res.send(returnObj);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.sessionId_questionId_get = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId } = req.params;
    const userId = UserService.getUserId(req.user);

    const question = await SessionService.getQuestionByRole(sessionId, questionId, userId);
    res.send(question);
  } catch (err) {
    res.sendStatus(404);
  }
};

exports.sessionId_questionId_vote_put = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId } = req.params;
    const userId = UserService.getUserId(req.user);

    await SessionService.addVoteByRole(sessionId, questionId, userId);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(404);
  }
};

exports.sessionId_questionId_vote_delete = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId } = req.params;
    const userId = UserService.getUserId(req.user);

    await SessionService.cancleVoteByRole(sessionId, questionId, userId);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(404);
  }
};
