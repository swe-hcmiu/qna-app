/* eslint-disable */
const { assert } = require('chai');

const { Session } = require('./Session');
const { SessionService } = require('./SessionService');
const { User } = require('../users/User');
const { EditorSessionStrategy } = require('../roles/EditorSessionStrategy');
const { UserSessionStrategy } = require('../roles/UserSessionStrategy');
const { Question } = require('../questions/Question');
const { Role } = require('../roles/Role');
const { UserService } = require('../users/UserService');
const { RoleService } = require('../roles/RoleService');
const { knex } = require('../../config/mysql/mysql-config');
const { getVotingList } = require('./SessionService');
const { getQuestionList } = require('./SessionService');

describe('Unit Testing for Session', function () {

  async function setUpSuite() {
    this.timeout(10000);
    await knex.seed.run();
  }

  describe('CREATE', function () {
    before(async function () {
      await setUpSuite.call(this);
    });

    describe('Create Session', function () {
      let session;
      let user;
      let recvUser;
      let recvSession;

      before(async function () {
        user = new User();
        user.displayName = 'Duy Phan';
        user.provider = 'anonymous';
        recvUser = await User.query().insertAndFetch(user);

        session = new Session();
        session.sessionName = 'Unit Test Session';
        session.sessionType = 'default';
        session.sessionStatus = 'opening';

        recvSession = await SessionService.createSession(session, recvUser);
      });

      it('check session has been created in database', async function () {
        const sessions = await Session.query().where(recvSession);
        const sessionDb = sessions[0];
        assert.deepInclude(recvSession, sessionDb, 'session should have been created in database');
      });

      it('return Session model object after successfully creating session', function () {
        assert.isObject(recvSession, 'session model must be an object');
      });

      it('check input object included in return object', function () {
        assert.deepInclude(recvSession, session, 'returned object must include input object');
      });

      it('check role of user in session', function () {
        assert.equal(recvSession.roles[0].userId, recvUser.userId, 'different user id');
        assert.equal(recvSession.roles[0].role, 'editor', 'role must be editor');
      });
    });

    describe('Create Session(Testing Transaction)', function () {
      let session;
      before(async function () {
        try {
          user = new User();
          user.userId = -1;
          user.displayName = 'Duy Phan';
          user.provider = 'anonymous';

          session = new Session();
          session.sessionName = 'Unit Test Session(Testing Transaction)';
          session.sessionType = 'default';
          session.sessionStatus = 'opening';

          await SessionService.createSession(session, user);
        } catch (err) {
          // do nothing
        }
      });

      it('check rollback transaction when errors occured', async function () {
        const sessions = await Session.query().where(session);
        assert.isEmpty(sessions, 'rollback must occur when errors happended in transactions');
      });
    });

    // describe('Create Session (Unloggedin User)', function () {
    //   before(async function () {
    //     try {
    //       user = undefined;

    //       session = new Session();
    //       session.sessionName = 'Case of Unloggedin User';
    //       session.sessionType = 'default';
    //       session.sessionStatus = 'opening';

    //       recvSession = await SessionService.createSession(session, user);
    //     } catch (err) {
    //       throw err;
    //     }
    //   });

    //   it('return null', function () {
    //     assert.isNull(recvSession, 'should have returned null session');
    //   })

    //   it('check for no record in db', async function () {
    //     const sessions = await Session.query().where(session);
    //     assert.isEmpty(sessions, 'record should not be created in db');
    //   })
    // })

    describe('Add Question To Session(User Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        question = new Question();
        question.title = 'Add Question User Test';
        question.content = 'Add Question User Test Content';

        recvQuestion = await service.addQuestionToSession(question);
      });

      it('check question has been created in database', async function () {
        const questions = await Question.query().where(recvQuestion);
        const questionDb = questions[0];
        assert.deepEqual(questionDb, recvQuestion, 'question should have been created in database');
      });

      it('return Question model object after successfully creating question', function () {
        assert.isObject(recvQuestion, 'question model must be an object');
      });

      it('check input object included in return object', function () {
        assert.deepInclude(recvQuestion, question, 'returned object must include input object');
      });

      it('check question status', function () {
        assert.equal(recvQuestion.questionStatus, 'pending', 'question status must be pending');
      });
    });

    describe('Add Question To Session(Editor Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 3;

        service = await SessionService.getSessionService(session, user);

        question = new Question();
        question.title = 'Add Question Editor Test';
        question.content = 'Add Question Test Editor Content';

        recvQuestion = await service.addQuestionToSession(question);
      });

      it('check question has been created in database', async function () {
        const questions = await Question.query().where(recvQuestion);
        const questionDb = questions[0];
        assert.deepEqual(questionDb, recvQuestion, 'question should have been created in database');
      });

      it('return Question model object after successfully creating question', function () {
        assert.isObject(recvQuestion, 'question model must be an object');
      });

      it('check input object included in return object', function () {
        assert.deepInclude(recvQuestion, question, 'returned object must include input object');
      });

      it('check question status', function () {
        assert.equal(recvQuestion.questionStatus, 'unanswered', 'question status must be unanswered');
      });
    });

    describe('Add Vote To Question(User Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        const questions = await Question
          .query()
          .where({
            questionId: 6
          });

        question = questions[0];

        recvQuestion = await service.addVoteToQuestion(question);
      });

      it('check question vote by user increased by 1', function () {
        assert.equal(recvQuestion.voteByUser, question.voteByUser + 1,
          'question vote by user must be increased by 1');
      });

      it('check voting record has been created in voting table database', async function () {
        const votings = await user
          .$relatedQuery('votings')
          .where({
            questionId: recvQuestion.questionId
          });

        assert.exists(votings, 'voting record has not been created in database');

        const voting = votings[0];
        assert.equal(voting.questionId, recvQuestion.questionId, 'voting record is not correct');
      });
    });

    describe('Add Vote To Question(Editor Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 3;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        const questions = await Question
          .query()
          .where({
            questionId: 11
          });

        question = questions[0];

        recvQuestion = await service.addVoteToQuestion(question);
      });

      it('check question vote by editor increased by 1', function () {
        assert.equal(recvQuestion.voteByEditor, question.voteByEditor + 1,
          'question vote by editor must be increased by 1');
      });

      it('check voting record has been created in voting table database', async function () {
        const votings = await user
          .$relatedQuery('votings')
          .where({
            questionId: recvQuestion.questionId
          });

        assert.exists(votings, 'voting record has not been created in database');

        const voting = votings[0];
        assert.equal(voting.questionId, recvQuestion.questionId, 'voting record is not correct');
      });
    });

    // describe('Add Vote To Question(Question already voted)', function () {
    //   let user;
    //   let session;
    //   let service;
    //   let question;
    //   let recvQuestion;

    //   before(async function () {
    //     session = new Session();
    //     session.sessionId = 1;

    //     user = new User();
    //     user.userId = 1;

    //     service = await SessionService.getSessionService(session, user);

    //     const questions = await Question
    //       .query()
    //       .where({
    //         questionId: 1
    //       });

    //     question = questions[0];

    //     recvQuestion = await service.addVoteToQuestion(question);
    //   });

    //   it('check question vote not increased', function () {
    //     assert.equal(recvQuestion.voteByEditor + recvQuestion.voteByUser, question.voteByEditor + question.voteByUser,
    //       'question vote must not change');
    //   });
    // });

    describe('Add Editor To Session(User Role)', function () {
      let user;
      let session;
      let service;
      let editor;
      let recvEditor;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        editor = new User();
        editor.userId = 2;

        try {

        } catch (err) {
          //do nothing
        }
      });

      it('check recvEditor does not exist', function () {
        assert.notExists(recvEditor, 'recvQuestion must not exist');
      });

      it('check role record has not been created in database', async function () {
        const roles = await editor
          .$relatedQuery('roles')
          .where({
            sessionId: session.sessionId
          });
        assert.isEmpty(roles, 'role record must not be created in database');
      });
    });

    describe('Add Editor To Session(Editor Role)', function () {
      let user;
      let session;
      let service;
      let editor;
      let recvEditor;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 3;

        service = await SessionService.getSessionService(session, user);

        editor = new User();
        editor.userId = 2;

        recvEditor = await service.addEditorToSession(editor);
      });

      it('check recvEditor role is editor', function () {
        assert.equal(recvEditor.roles[0].role, 'editor', 'recvEditor role must be editor');
      });

      it('check role record has been created in database', async function () {
        const roles = await editor
          .$relatedQuery('roles')
          .where({
            sessionId: session.sessionId
          });
        const roleDb = roles[0];
        assert.equal(roleDb.role, 'editor', 'role record must be created in database');
      });
    });
  });

  describe('GET', function () {
    before(async function () {
      await setUpSuite.call(this);
    });

    describe('Get Session Service(User Role)', function () {
      let session;
      let user;
      let service;
      let serviceExpect;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 2;

        serviceExpect = new SessionService();
        serviceExpect.session = session;
        serviceExpect.user = user;
        [serviceExpect.user.votings, serviceExpect.user.questions] = await Promise
          .all([getVotingList(serviceExpect.session, serviceExpect.user),
            getQuestionList(serviceExpect.session, serviceExpect.user)]);

        serviceExpect.role = new Role();
        serviceExpect.role.sessionId = session.sessionId;
        serviceExpect.role.userId = user.userId;
        serviceExpect.role.role = 'user';
        serviceExpect.roleStrategy = RoleService.getStrategyByRole(serviceExpect.role);

        service = await SessionService.getSessionService(session, user);
      });

      it('check input object included in return object', function () {
        assert.deepInclude(service, serviceExpect, 'returned object must include input object');
      });

      it('validate roleStrategy of service', function () {
        assert.instanceOf(service.roleStrategy, UserSessionStrategy,
          'roleStrategy must be an instance of UserSessionStrategy');
      });
    });

    describe('Get Session Service(Editor Role)', function () {
      let session;
      let user;
      let service;
      let serviceExpect;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 1;

        serviceExpect = new SessionService();
        serviceExpect.session = session;
        serviceExpect.user = user;
        [serviceExpect.user.votings, serviceExpect.user.questions] = await Promise
          .all([getVotingList(serviceExpect.session, serviceExpect.user),
            getQuestionList(serviceExpect.session, serviceExpect.user)]);

        serviceExpect.role = new Role();
        serviceExpect.role.sessionId = session.sessionId;
        serviceExpect.role.userId = user.userId;
        serviceExpect.role.role = 'editor';

        service = await SessionService.getSessionService(session, user);
      });

      it('check input object included in return object', function () {
        assert.deepInclude(service, serviceExpect, 'returned object must include input object');
      });

      it('validate roleStrategy of service', function () {
        assert.instanceOf(service.roleStrategy, EditorSessionStrategy,
          'roleStrategy must be an instance of EditorSessionStrategy');
      });
    });

    describe('Get Session Service(Anonymous User)', function () {
      let session;
      let user;
      let service;
      let serviceExpect;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = await UserService.getUserInstance(undefined);
        service = await SessionService.getSessionService(session, user);
      });

      it('validate roleStrategy of service', function () {
        assert.instanceOf(service.roleStrategy, UserSessionStrategy,
          'roleStrategy must be an instance of UserSessionStrategy');
      });
    });

    describe('Get List Of Opening Sessions', function () {
      let openingSessionsDb;
      let openingSessions;

      before(async function () {
        openingSessionsDb = await Session
          .query()
          .where({
            sessionStatus: 'opening'
          });

        openingSessions = await SessionService.getListOfOpeningSessions();
      });

      it('check openingSessions is an array', function () {
        assert.isArray(openingSessions, 'openingSessions must be an array');
      });

      it('check openingSessions contains enough opening sessions in database', function () {
        assert.deepEqual(openingSessions, openingSessionsDb,
          'openingSessions must contain enough opening sessions in database');
      });
    });

    describe('Get List Of Closed Sessions', function () {
      let closedSessionsDb;
      let closedSessions;

      before(async function () {
        closedSessionsDb = await Session
          .query()
          .where({
            sessionStatus: 'closed'
          });

        closedSessions = await SessionService.getListOfClosedSessions();
      });

      it('check closedSessions is an array', function () {
        assert.isArray(closedSessions, 'closedSessions must be an array');
      });

      it('check closedSessions contains enough closed sessions in database', function () {
        assert.deepEqual(closedSessions, closedSessionsDb,
          'closedSessions must contain enough closed sessions in database');
      });
    });

    describe('Get List Of Newest Questions', function () {
      let session;
      let user;
      let service;
      let listOfNewestQuestionsDb;
      let listOfNewestQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        listOfNewestQuestionsDb = await session
          .$relatedQuery('questions')
          .where({
            questionStatus: 'unanswered'
          })
          .orderBy('updatedAt', 'desc');

        listOfNewestQuestions = await service.getNewestQuestionsOfSession();
      });

      it('check listOfNewestQuestions is an array', function () {
        assert.isArray(listOfNewestQuestions, 'listOfNewestQuestions must be an array');
      });

      it('validate listOfNewestQuestions', function () {
        assert.deepEqual(listOfNewestQuestions, listOfNewestQuestionsDb, 'listOfNewestQuestions is not correct');
      });
    });

    describe('Get List Of Favorite Questions', function () {
      let session;
      let user;
      let service;
      let listOfFavoriteQuestionsDb;
      let listOfFavoriteQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        listOfFavoriteQuestionsDb = await session
          .$relatedQuery('questions')
          .where({
            questionStatus: 'unanswered'
          })
          .orderBy('voteByEditor', 'desc')
          .orderBy('voteByUser', 'desc');

        listOfFavoriteQuestions = await service.getTopFavoriteQuestionsOfSession();
      });

      it('check listOfFavoriteQuestions is an array', function () {
        assert.isArray(listOfFavoriteQuestions, 'listOfFavoriteQuestions must be an array');
      });

      it('validate listOfFavoriteQuestions', function () {
        assert.deepEqual(listOfFavoriteQuestions, listOfFavoriteQuestionsDb, 'listOfFavoriteQuestions is not correct');
      });
    });

    describe('Get List Of Answered Questions', function () {
      let session;
      let user;
      let service;
      let listOfAnsweredQuestionsDb;
      let listOfAnsweredQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        listOfAnsweredQuestionsDb = await session
          .$relatedQuery('questions')
          .where({
            questionStatus: 'answered'
          })
          .orderBy('updatedAt', 'desc');

        listOfAnsweredQuestions = await service.getAnsweredQuestionsOfSession();
      });

      it('check listOfAnsweredQuestions is an array', function () {
        assert.isArray(listOfAnsweredQuestions, 'listOfAnsweredQuestions must be an array');
      });

      it('validate listOfAnsweredQuestions', function () {
        assert.deepEqual(listOfAnsweredQuestions, listOfAnsweredQuestionsDb, 'listOfAnsweredQuestions is not correct');
      });
    });

    describe('Get List Of Invalid Questions(User Role)', function () {
      let session;
      let user;
      let listOfInvalidQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        listOfInvalidQuestions = await service.getInvalidQuestionsOfSession();
      });

      it('check listOfInvalidQuestions does not exists', function () {
        assert.notExists(listOfInvalidQuestions, 'listOfInvalidQuestions must not exist');
      });
    });

    describe('Get List Of Invalid Questions(Editor Role)', function () {
      let session;
      let user;
      let service;
      let listOfInvalidQuestionsDb;
      let listOfInvalidQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        listOfInvalidQuestionsDb = await session
          .$relatedQuery('questions')
          .where({
            questionStatus: 'invalid'
          })
          .orderBy('updatedAt', 'desc');

        listOfInvalidQuestions = await service.getInvalidQuestionsOfSession();
      });

      it('check listOfInvalidQuestions is an array', function () {
        assert.isArray(listOfInvalidQuestions, 'listOfInvalidQuestions must be an array');
      });

      it('validate listOfInvalidQuestions', function () {
        assert.deepEqual(listOfInvalidQuestions, listOfInvalidQuestionsDb, 'listOfInvalidQuestions is not correct');
      });
    });

    describe('Get List Of Pending Questions(User Role)', function () {
      let session;
      let user;
      let listOfPendingQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        listOfPendingQuestions = await service.getPendingQuestionsOfSession();
      });

      it('check listOfPendingQuestions does not exists', function () {
        assert.notExists(listOfPendingQuestions, 'listOfPendingQuestions must not exist');
      });
    });

    describe('Get List Of Pending Questions(Editor Role)', function () {
      let session;
      let user;
      let service;
      let listOfPendingQuestionsDb;
      let listOfPendingQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        listOfPendingQuestionsDb = await session
          .$relatedQuery('questions')
          .where({
            questionStatus: 'pending'
          })
          .orderBy('updatedAt', 'desc');

        listOfPendingQuestions = await service.getPendingQuestionsOfSession();
      });

      it('check listOfPendingQuestions is an array', function () {
        assert.isArray(listOfPendingQuestions, 'listOfPendingQuestions must be an array');
      });

      it('validate listOfPendingQuestions', function () {
        assert.deepEqual(listOfPendingQuestions, listOfPendingQuestionsDb, 'listOfPendingQuestions is not correct');
      });
    });

    describe('Get List Of Voted Questions', function () {
      let user;
      let session;
      let service;
      let listOfVotedQuestionsDb;
      let listOfVotedQuestions;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        listOfVotedQuestionsDb = await user
          .$relatedQuery('votingQuestions')
          .select('votings.questionId')
          .where({
            sessionId: session.sessionId
          });

        listOfVotedQuestions = await service.getListOfVotedQuestion();
      });

      it('check listOfVotedQuestions is an array', function () {
        assert.isArray(listOfVotedQuestions, 'listOfVotedQuestions must be an array');
      });

      it('validate listOfVotedQuestions', function () {
        assert.deepEqual(listOfVotedQuestions, listOfVotedQuestionsDb, 'listOfVotedQuestions is not correct');
      });
    });

    describe('Get List Of Editors', function () {
      let user;
      let session;
      let service;
      let listOfEditorsDb;
      let listOfEditors;

      before(async function () {
        session = new Session();
        session.sessionId = 3;

        user = new User();
        user.userId = 3;

        service = await SessionService.getSessionService(session, user);

        listOfEditorsDb = await session
          .$relatedQuery('roleUsers')
          .where({
            role: 'editor'
          });

        listOfEditors = await service.getListOfEditors();
      });

      it('check listOfEditors is an array', function () {
        assert.isArray(listOfEditors, 'listOfEditors must be an array');
      });

      it('validate listOfEditors', function () {
        assert.deepEqual(listOfEditors, listOfEditorsDb, 'listOfEditors is not correct');
      });
    });
  });

  describe('UPDATE', function () {
    before(async function () {
      await setUpSuite.call(this);
    });

    describe('Cancel Vote To Question(User Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        const questions = await Question
          .query()
          .where({
            questionId: 1
          });

        question = questions[0];

        recvQuestion = await service.cancelVoteInQuestion(question);
      });

      it('check question vote by user decreased by 1', function () {
        assert.equal(recvQuestion.voteByUser, question.voteByUser - 1,
          'question vote by user must be decreased by 1');
      });

      it('check voting record has been deleted in voting table database', async function () {
        const votings = await user
          .$relatedQuery('votings')
          .where({
            questionId: recvQuestion.questionId
          });

        assert.isEmpty(votings, 'voting record has not been deleted in database');
      });
    });

    describe('Cancel Vote To Question(Editor Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 1;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        const questions = await Question
          .query()
          .where({
            questionId: 1
          });

        question = questions[0];
        recvQuestion = await service.cancelVoteInQuestion(question);
      });

      it('check question vote by editor decreased by 1', function () {
        assert.equal(recvQuestion.voteByEditor, question.voteByEditor - 1,
          'question vote by editor must be decreased by 1');
      });

      it('check voting record has been deleted in voting table database', async function () {
        const votings = await user
          .$relatedQuery('votings')
          .where({
            questionId: recvQuestion.questionId
          });

        assert.isEmpty(votings, 'voting record has not been deleted in database');
      });
    });

    // describe('Cancel Vote To Question(Voting does not exist)', function () {
    //   let user;
    //   let session;
    //   let service;
    //   let question;
    //   let recvQuestion;

    //   before(async function () {
    //     session = new Session();
    //     session.sessionId = 2;

    //     user = new User();
    //     user.userId = 1;

    //     service = await SessionService.getSessionService(session, user);

    //     const questions = await Question
    //       .query()
    //       .where({
    //         questionId: 7
    //       });

    //     question = questions[0];

    //     recvQuestion = await service.cancelVoteInQuestion(question);

    //     const questionsAfterCancelVote = await Question
    //       .query()
    //       .where({
    //         questionId: 7
    //       });

    //     questionAfterCancelVote = questionsAfterCancelVote[0];

    //   });

    //   it('check question vote does not change', function () {
    //     assert.equal(questionAfterCancelVote.voteByEditor + questionAfterCancelVote.voteByUser,
    //       question.voteByEditor + question.voteByUser,
    //       'question vote by editor must not change');
    //   });
    // });

    describe('Update Question Status(User Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 2;

        service = await SessionService.getSessionService(session, user);

        const questions = await Question
          .query()
          .where({
            questionId: 6
          });
        question = questions[0];

        try {
          recvQuestion = await service.updateQuestionStatus(question, 'answered');
        } catch (err) {
          // do nothing
        }
      });

      it('check recvQuestion does not exist', function () {
        assert.notExists(recvQuestion, 'recvQuestion must not exist');
      });

      it('check question status has not changed in database', async function () {
        const questions = await Question
          .query()
          .where({
            questionId: 6
          });
        const questionDb = questions[0];

        assert.equal(questionDb.questionStatus, question.questionStatus,
          'question status must not be changed in database');
      });
    });

    describe('Update Question Status(Editor Role)', function () {
      let user;
      let session;
      let service;
      let question;
      let recvQuestion;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 3;

        service = await SessionService.getSessionService(session, user);

        const questions = await Question
          .query()
          .where({
            questionId: 6
          });
        question = questions[0];

        recvQuestion = await service.updateQuestionStatus(question, 'answered');
      });

      it('check question status has changed in database', async function () {
        const questions = await Question
          .query()
          .where({
            questionId: 6
          });
        const questionDb = questions[0];

        assert.equal(questionDb.questionStatus, recvQuestion.questionStatus,
          'question status must be changed in database');
      });
    });
  });

  describe('DELETE', function () {
    before(async function () {
      await setUpSuite.call(this);
    });

    describe('Remove Editor From Session(User Role)', function () {
      let user;
      let session;
      let service;
      let editor;
      let recvEditor;

      before(async function () {
        session = new Session();
        session.sessionId = 2;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        editor = new User();
        editor.userId = 3;

        try {
          recvEditor = await service.removeEditorFromSession(editor);
        } catch (err) {
          //do nothing
        }
      });

      it('check recvEditor does not exist', function () {
        assert.notExists(recvEditor, 'recvEditor must not exist');
      });

      it('check role record has not been changed in database', async function () {
        const roles = await editor
          .$relatedQuery('roles')
          .where({
            sessionId: session.sessionId
          });
        const roleDb = roles[0];

        assert.equal(roleDb.role, 'editor', 'role record must not be changed in database');
      });
    });

    describe('Remove Editor From Session(Editor Role)', function () {
      let user;
      let session;
      let service;
      let editor;
      let recvEditor;

      before(async function () {
        session = new Session();
        session.sessionId = 3;

        user = new User();
        user.userId = 1;

        service = await SessionService.getSessionService(session, user);

        editor = new User();
        editor.userId = 4;

        recvEditor = await service.removeEditorFromSession(editor);
      });

      it('check recvEditor role is not editor', function () {
        assert.notEqual(recvEditor.roles.role, 'editor', 'recvEditor role must not be editor');
      });

      it('check role record has been changed in database', async function () {
        const roles = await editor
          .$relatedQuery('roles')
          .where({
            sessionId: session.sessionId
          });
        if (roles.length === 0) return;
        const roleDb = roles[0];

        assert.notEqual(roleDb.role, 'editor', 'role record must be changed in database');
      });
    });
  });
});