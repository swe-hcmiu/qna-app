const EditorSessionService = require('../services/EditorSessionService');
const UserService = require('../services/UserService');
const SessionService = require('../services/SessionService');
const ValidateSessionHandler = require('../validator/session');

exports.session_get = async (req, res) => {
  try {
    const listOfSessions = await SessionService.getListOfSessions();
    res.send(listOfSessions);
  } catch (err) {
    throw err;
  }
};

exports.session_post = async (req, res, next) => {
  try {
    const validateObj = {
      sessionName: req.body.sessionName,
      sessionType: req.body.sessionType,
      user: req.user,
    };
    await ValidateSessionHandler.validateCreateSessionInput(validateObj);

    const userId = UserService.getUserId(req.user);
    const { sessionName, sessionType } = req.body;
    const session = { sessionName, sessionType };

    const sessionId = await EditorSessionService.createSession(userId, session);
    // const returnObj = { sessionId };
    // res.send(returnObj);
    res.redirect(`/sessions/${sessionId}`);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_get = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await ValidateSessionHandler.validateSession(sessionId);
    const userId = UserService.getUserId(req.user);

    const returnObj = await SessionService.getInfoSessionByRole(sessionId, userId);
    res.send(returnObj);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_delete = async (req, res, next) => {
  try {
    const validateObj = {
      sessionId: req.params.sessionId,
      user: req.user,
    };
    await ValidateSessionHandler.validateDeleteSession(validateObj);

    const { sessionId } = req.params;
    await EditorSessionService.deleteSession(sessionId);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_newest = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await ValidateSessionHandler.validateSession(sessionId);

    const listOfNewestQuestions = await SessionService.getNewestQuestionsOfSession(sessionId);
    res.send(listOfNewestQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_top = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await ValidateSessionHandler.validateSession(sessionId);

    const listOfFavoriteQuestions = await SessionService.getTopFavoriteQuestionsOfSession(sessionId);
    res.send(listOfFavoriteQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_answered = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await ValidateSessionHandler.validateSession(sessionId);

    const listOfAnsweredQuestions = await SessionService.getAnsweredQuestionsOfSession(sessionId);
    res.send(listOfAnsweredQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_pending = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const validateObj = {
      sessionId,
      user: req.user,
    };
    await ValidateSessionHandler.validateGetPendingQuestions(validateObj);

    const listOfPendingQuestions = await EditorSessionService.getPendingQuestionsOfSession(sessionId);
    res.send(listOfPendingQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_invalid = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const validateObj = {
      sessionId,
      user: req.user,
    };
    await ValidateSessionHandler.validateGetInvalidQuestions(validateObj);

    const listOfInvalidQuestions = await EditorSessionService.getInvalidQuestionsOfSession(sessionId);
    res.send(listOfInvalidQuestions);
  } catch (err) {
    next(err);
  }
};

async function createAnonymousSession(req, userId) {
  try {
    if (!req.user) {
      const user = await UserService.getUserById(userId);
      const createSessionPromise = () => (
        new Promise((resolve, reject) => {
          req.login(user, (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      await createSessionPromise();
    }
  } catch (err) {
    throw err;
  }
}

exports.sessionId_question_post = async (req, res, next) => {
  const { title, content } = req.body;
  const { sessionId } = req.params;
  const validateObj = {
    title,
    content,
    sessionId,
  };
  try {
    await ValidateSessionHandler.validateUserAddQuestions(validateObj);

    const question = { title, content };
    const rawUserId = UserService.getUserId(req.user);
    const userId = await UserService.validateUserId(rawUserId);
    await createAnonymousSession(req, userId);
    const questionId = await SessionService.addQuestionByRole(sessionId, userId, question);
    const returnObj = { questionId };
    res.send(returnObj);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_get = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId } = req.params;
    const validateObj = {
      sessionId,
      questionId,
    };
    await ValidateSessionHandler.validateGetSpecificQuestion(validateObj);
    const userId = UserService.getUserId(req.user);

    const question = await SessionService.getQuestionByRole(sessionId, questionId, userId);
    res.send(question);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_vote_put = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId } = req.params;
    const rawUserId = UserService.getUserId(req.user);
    const userId = await UserService.validateUserId(rawUserId);
    const result = await UserService.getRoleOfUserInSession(userId, sessionId);
    const role = result.Role;

    const validateObj = {
      sessionId,
      questionId,
      role,
    };

    await ValidateSessionHandler.validateUserVoteQuestions(validateObj);

    await createAnonymousSession(req, userId);
    await SessionService.addVoteByRole(sessionId, questionId, userId, role);
    res.sendStatus(200);
  } catch (err) {
    switch (err.code) {
      case 'ER_DUP_ENTRY': {
        err.httpCode = 409;
        err.description = 'user already voted this question';
        break;
      }
      default: {
        break;
      }
    }
    next(err);
  }
};

exports.sessionId_questionId_vote_delete = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId } = req.params;
    const validateObj = {
      sessionId,
      questionId,
    };
    await ValidateSessionHandler.validateUserCancleVoteQuestions(validateObj);

    const userId = UserService.getUserId(req.user);
    const result = await UserService.getRoleOfUserInSession(userId, sessionId);
    const role = result.Role;
    await SessionService.cancelVoteByRole(sessionId, questionId, userId, role);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_status_put = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId } = req.params;
    const status = req.body.Status;
    const userId = UserService.getUserId(req.user);
    const result = await UserService.getRoleOfUserInSession(userId, sessionId);
    const role = result.Role;
    const validateObj = {
      sessionId,
      questionId,
      role,
      status,
    };
    await ValidateSessionHandler.validateChangeQuestionStatus(validateObj);

    await EditorSessionService.updateQuestionStatus(questionId, status);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_user_vote = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await ValidateSessionHandler.validateSession(sessionId);
    const userId = UserService.getUserId(req.user);

    const listOfVotedQuestions = await SessionService.getListOfVotedQuestions(sessionId, userId);
    res.send(listOfVotedQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_editor_get = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await ValidateSessionHandler.validateSession(sessionId);

    const listOfEditors = await SessionService.getListOfEditors(sessionId);
    res.send(listOfEditors);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_editor_permission_post = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;
    const editorId = UserService.getUserId(req.user);
    const result = await UserService.getRoleOfUserInSession(editorId, sessionId);
    const role = result.Role;
    const validateObj = {
      sessionId,
      userId,
      role,
    };
    await ValidateSessionHandler.validateGivePermissions(validateObj);

    await EditorSessionService.addEditor(sessionId, userId);
    res.sendStatus(200);
  } catch (err) {
    switch (err.code) {
      case 'ER_DUP_ENTRY': {
        err.httpCode = 409;
        err.description = 'user is already editor of this session';
        break;
      }
      default: {
        break;
      }
    }
    next(err);
  }
};

exports.sessionId_editor_permission_delete = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;
    const editorId = UserService.getUserId(req.user);
    const result = await UserService.getRoleOfUserInSession(editorId, sessionId);
    const role = result.Role;
    const validateObj = {
      sessionId,
      userId,
      role,
    };
    await ValidateSessionHandler.validateGivePermissions(validateObj);

    await EditorSessionService.removeEditor(sessionId, userId);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
