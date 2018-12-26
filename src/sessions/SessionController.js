const jwt = require('jsonwebtoken');
const keys = require('../../config/passport/keys');
const { SessionService } = require('./SessionService');
const { UserService } = require('../users/UserService');
const { Question } = require('../questions/Question');

async function getSessionServiceInstance(req) {
  try {
    var token = req.headers['x-access-token'] || req.headers.authorization;
    const { sessionId } = req.params;
    const session = SessionService.getSessionInstance(sessionId);
    if (token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    } else {
      const currentUser = await UserService.createAnonymousUser();
      const payload = { userId: currentUser.userId };
      token = jwt.sign(payload, keys.tokenSecret, {
        expiresIn: '7d',
      });
    }
    const decoded = jwt.verify(token, keys.tokenSecret);
    const user = await UserService.getUserById(decoded.userId);
    const service = await SessionService.getSessionService(session, user);
    return service;
  } catch (err) {
    throw err;
  }
}

// async function createAnonymousSession(req, userId) {
//   try {
//     if (!req.user) {
//       const user = await UserService.getUserById(userId);
//       const createSessionPromise = () => (
//         new Promise((resolve, reject) => {
//           req.login(user, (err) => {
//             if (err) reject(err);
//             resolve();
//           });
//         })
//       );

//       await createSessionPromise();
//     }
//   } catch (err) {
//     next(err);
//   }
// }

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
    const user = req.user;
    const { sessionName, sessionType } = req.body;
    const session = { sessionName, sessionType };

    const recvSession = await SessionService.createSession(user, session);
    res.send(recvSession);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_get = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const recvSession = await service.getInfoOfSession();
    res.send(recvSession);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_delete = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    await service.deleteSession();

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_status_put = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const status = req.body.Status;
    const recvSession = await service.updateSessionStatus(status);

    res.send(recvSession);
  } catch (err) {
    next(err);
  }
};


exports.sessionId_question_newest = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfNewestQuestions = await service.getNewestQuestionsOfSession();
    res.send(listOfNewestQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_top = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfFavouriteQuestions = await service.getTopFavoriteQuestionsOfSession();
    res.send(listOfFavouriteQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_answered = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfAnsweredQuestions = await service.getAnsweredQuestionsOfSession();
    res.send(listOfAnsweredQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_pending = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfPendingQuestions = await service.getPendingQuestionsOfSession();
    res.send(listOfPendingQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_invalid = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfInvalidQuestions = await service.getInvalidQuestionsOfSession();
    res.send(listOfInvalidQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_question_post = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { title, content } = req.body;
    const question = new Question();
    question.title = title;
    question.content = content;
    const recvQuestion = await service.addQuestionToSession(question);
    res.send(recvQuestion);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_questionId_get = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
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
    const service = await getSessionServiceInstance(req);
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
    const service = await getSessionServiceInstance(req);
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
    const service = await getSessionServiceInstance(req);
    const { questionId } = req.params;
    const question = { questionId };
    const status = req.body.Status;
    const recvQuestion = await service.updateQuestionStatus(question, status);

    res.send(recvQuestion);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_user_vote = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfVotedQuestions = await service.getListOfVotedQuestion();
    res.send(listOfVotedQuestions);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_editor_get = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfEditors = await service.getListOfEditors();
    res.send(listOfEditors);
  } catch (err) {
    next(err);
  }
};

exports.sessionId_editor_permission_post = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
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
    const service = await getSessionServiceInstance(req);
    const { userId } = req.body;
    const editor = UserService.getUserInstanceWithId(userId);

    const recvRecord = await service.removeEditorFromSession(editor);
    res.send(recvRecord);
  } catch (err) {
    next(err);
  }
};
