const SessionService = require('./SessionService');
const UserService = require('../users/UserService');

async function getSessionServiceInstance(req) {
  try {
    const { sessionId } = req.params;
    const user = req.user;
    const session = SessionService.getSessionInstance(sessionId);
    const currentUser = await UserService.getUserInstance(user);

    //log anonymous user in
    if (currentUser.provider === 'anonymous') {
      const createSessionPromise = () => (
        new Promise((resolve, reject) => {
          req.login(currentUser, (err) => {
            if (err) reject(err);
            resolve();
          });
        })
      );

      await createSessionPromise();
    }

    const service = await SessionService.getSessionService(session, currentUser);
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
//     throw err;
//   }
// }

exports.session_get = async (req, res) => {
  try {
    const listOfSessions = await SessionService.getListOfSessions();
    res.send(listOfSessions);
  } catch (err) {
    throw err;
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
    throw(err);
  }
};

exports.sessionId_get = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const recvSession = await service.getInfoOfSession();

    res.status(recvSession);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_delete = async (req, res, next) => {
  // try {
  //   const validateObj = {
  //     sessionId: req.params.sessionId,
  //     user: req.user,
  //   };
  //   await ValidateSessionHandler.validateDeleteSession(validateObj);

  //   const { sessionId } = req.params;
  //   await EditorSessionService.deleteSession(sessionId);
  //   res.sendStatus(200);
  // } catch (err) {
  //   throw(err);
  // }
};

exports.sessionId_status_put = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const status = req.body.Status;
    const recvSession = await service.updateSessionStatus(status);

    res.status(recvSession);
  } catch (err) {
    throw(err);
  }
};


exports.sessionId_question_newest = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfNewestQuestions = await service.getNewestQuestionsOfSession();
    res.send(listOfNewestQuestions);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_question_top = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfFavouriteQuestions = await service.getTopFavoriteQuestionsOfSession();
    res.send(listOfFavouriteQuestions);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_question_answered = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfAnsweredQuestions = await service.getAnsweredQuestionsOfSession();
    res.send(listOfAnsweredQuestions);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_question_pending = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfPendingQuestions = await service.getPendingQuestionsOfSession();
    res.send(listOfPendingQuestions);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_question_invalid = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const listOfInvalidQuestions = await service.getInvalidQuestionsOfSession();
    res.send(listOfInvalidQuestions);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_question_post = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { title, content } = req.body;
    const question = { title, content };
    const recvQuestion = service.addQuestionToSession(question);
    res.send(recvQuestion);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_questionId_get = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { questionId } = req.params;

    const recvQuestion = await service.getQuestion({ questionId });
    res.send(recvQuestion);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_questionId_vote_put = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { questionId } = req.params;

    const recvQuestion = await service.addVoteToQuestion({ questionId });
    res.send(recvQuestion);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_questionId_vote_delete = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { questionId } = req.params;

    const recvQuestion = await service.cancelVoteInQuestion({ questionId });
    res.send(recvQuestion);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_questionId_status_put = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { questionId } = req.params;
    const status = req.body.Status;
    const recvQuestion = await service.updateQuestionStatus({ questionId }, status);

    res.status(recvQuestion);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_user_vote = async (req, res, next) => {
  try {
    const service = await this.getSessionInstance(req);
    const listOfVotedQuestions = await service.getListOfVotedQuestion();
    res.send(listOfVotedQuestions);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_editor_get = async (req, res, next) => {
  try {
    const service = await this.getSessionInstance(req);
    const listOfEditors = await service.getListOfEditors();
    res.send(listOfEditors);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_editor_permission_post = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { userId } = req.body;
    const editor = UserService.getUserInstanceById(userId);

    const recvRecord = await service.addEditorToSession(editor);
    res.send(recvRecord);
  } catch (err) {
    throw(err);
  }
};

exports.sessionId_editor_permission_delete = async (req, res, next) => {
  try {
    const service = await getSessionServiceInstance(req);
    const { userId } = req.body;
    const editor = UserService.getUserInstanceById(userId);

    const recvRecord = await service.removeEditorFromSession(editor);
    res.send(recvRecord);
  } catch (err) {
    throw(err);
  }
};
