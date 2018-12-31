const { SessionService } = require('./SessionService');
const { UserService } = require('../users/UserService');
const { User } = require('../users/User');
const { Session } = require('../sessions/Session');

exports.session_get = async (req, res, next) => {
  try {
    const listOfSessions = await SessionService.getListOfSessions();
    res.send(listOfSessions);
  } catch (err) {
    next(err);
  }
};

exports.session_get_opening = async (req, res, next) => {
  try {
    const listOfSessions = await SessionService.getListOfOpeningSessions();
    res.send(listOfSessions);
  } catch (err) {
    next(err);
  }
};

exports.session_get_closed = async (req, res, next) => {
  try {
    const listOfSessions = await SessionService.getListOfClosedSessions();
    res.send(listOfSessions);
  } catch (err) {
    next(err);
  }
};

// TODO
exports.session_post = async (req, res, next) => {
  try {
    let { user } = req;
    let { session } = req.body;
    user = Object.assign(new User(), user);
    session = Object.assign(new Session(), session);

    const recvSession = await SessionService.createSession(session, user);
    res.send(recvSession);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_get = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const recvSession = await service.getInfoOfSession();
    res.send(recvSession);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_delete = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    await service.deleteSession();

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_status_put = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const { status } = req.body;
    const recvSession = await service.updateSessionStatus(status);

    res.send(recvSession);
  } catch (err) {
    next(err);
  }
};


exports.sessionId_question_newest = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const { cursor, limit, pagingDirection } = req.query;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const listOfNewestQuestions = await service
      .getNewestQuestionsOfSession(cursor, limit, pagingDirection);
    res.send(listOfNewestQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_top = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const { limit } = req.query;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const listOfFavouriteQuestions = await service.getTopFavoriteQuestionsOfSession(limit);
    res.send(listOfFavouriteQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_answered = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const { cursor, limit, pagingDirection } = req.query;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const listOfAnsweredQuestions = await service
      .getAnsweredQuestionsOfSession(cursor, limit, pagingDirection);
    res.send(listOfAnsweredQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_pending = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const { cursor, limit, pagingDirection } = req.query;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const listOfPendingQuestions = await service
      .getPendingQuestionsOfSession(cursor, limit, pagingDirection);
    res.send(listOfPendingQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_invalid = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const { cursor, limit, pagingDirection } = req.query;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const listOfInvalidQuestions = await service
      .getInvalidQuestionsOfSession(cursor, limit, pagingDirection);
    res.send(listOfInvalidQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_post = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);

    const { question } = req.body;
    const recvQuestion = await service.addQuestionToSession(question);
    res.send(recvQuestion);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_get = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const { questionId } = req.params;
    const question = { questionId };

    const recvQuestion = await service.getQuestion(question);
    res.send(recvQuestion);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_vote_put = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const { questionId } = req.params;
    const question = { questionId };

    const recvQuestion = await service.addVoteToQuestion(question);
    res.send(recvQuestion);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_vote_delete = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const { questionId } = req.params;
    const question = { questionId };

    const recvQuestion = await service.cancelVoteInQuestion(question);
    res.send(recvQuestion);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_status_put = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const { questionId } = req.params;
    const question = { questionId };
    const { status } = req.body;
    const recvQuestion = await service.updateQuestionStatus(question, status);

    res.send(recvQuestion);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_user_vote = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const listOfVotedQuestions = await service.getListOfVotedQuestion();
    res.send(listOfVotedQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_editor_get = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const listOfEditors = await service.getListOfEditors();
    res.send(listOfEditors);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_editor_permission_post = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const { userId } = req.body;
    const editor = UserService.getUserInstanceWithId(userId);

    const recvRecord = await service.addEditorToSession(editor);
    res.send(recvRecord);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_editor_permission_delete = async (req, res, next) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;
    const session = await SessionService.getSessionInstance(sessionId);

    const service = await SessionService.getSessionService(session, user);
    const { userId } = req.body;
    const editor = UserService.getUserInstanceWithId(userId);

    const recvRecord = await service.removeEditorFromSession(editor);
    res.send(recvRecord);
  } catch (err) {
    next(err);
  }
};
