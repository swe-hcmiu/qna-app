/* eslint-disable */
const { assert } = require('chai');

const { Session } = require('./Session');
const { SessionService } = require('./SessionService');
const { Role } = require('../roles/Role');
const { User } = require('../users/User');

describe('Unit Testing for Session', function () {
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

    it('check session has been created in database', function () {
      const sessions = Session.query().where(recvSession);
      const sessionDb = sessions[0];
      assert.deepEqual(sessionDb, recvSession, 'session should have been created in database');
    });

    it('return Session model object after successfully creating user', function () {
      assert.isObject(recvSession, 'session model must be an object');
    });

    it('check input object included in return object', function () {
      assert.deepInclude(recvSession, session, 'returned object must include input object');
    });

    it('check role of user in session', function () {
      assert.equal(recvSession.roles.userId, recvUser.userId, 'different user id');
      assert.equal(recvSession.roles.role, 'editor', 'role must be editor');
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
        console.log(err);
      }
    });

    it('check rollback transaction when errors occured', async function () {
      const sessions = await Session.query().where(session);
      assert.isEmpty(sessions, 'rollback must occur when errors happended in transactions');
    });
  });

  
});