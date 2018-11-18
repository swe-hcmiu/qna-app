/* eslint-disable */
const { assert } = require('chai');
const bcrypt = require('bcryptjs');

const { User } = require('./User');
const { UserService } = require('./UserService');
const { QnAUser } = require('./User');
const { GoogleUser } = require('./User');
const { knex } = require('../../config/mysql/mysql-config');

describe('Unit Testing for User', function () {

  async function setUpSuite() {
    this.timeout(10000);
    await knex.seed.run();
  }

  describe('CREATE', function () {

    before(async function () {
      await setUpSuite.call(this);
    });

    describe('Create Normal User', function () {
      let user;
      let result;

      before(async function () {
        user = new User();
        user.displayName = 'Duy Phan';
        user.provider = 'anonymous';
        result = await UserService.createUser(user);
      });

      it('check user has been created in database', async function () {
        const users = await User.query().where(result);
        const userDb = users[0];
        assert.deepEqual(userDb, result, 'user should have been created in database');
      });

      it('return User model object after successfully creating user', async function () {
        assert.isObject(result, 'user model must be an object');
      });

      it('check input object included in return object', function () {
        assert.deepInclude(result, user, 'returned object must include input object');
      });

      it('check returned object properties', function () {
        assert.containsAllKeys(result, ['userId', 'displayName', 'provider', 'createdAt', 'updatedAt'],
          'returned object must contain enough properties');
      });

    });

    describe('Create QnA User', function () {
      let user;
      let result;
      let passwordHash;

      function hashing(userpass) {
        return new Promise((resolve, reject) => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userpass, salt, (errHash, hash) => {
              if (errHash) return reject(errHash);
              return resolve(hash);
            });
          });
        });
      }

      before(async function () {
        user = new User();
        user.displayName = 'Duy Phan';
        user.provider = 'qna';

        user.qnaUsers = new QnAUser();
        user.qnaUsers.username = 'duyphan';
        user.qnaUsers.userpass = '123';

        [result, passwordHash] = await Promise.all([UserService.createQnAUser(user), hashing(user.qnaUsers.userpass)]);
      });

      it('check user and qna user have been created in database', async function () {
        const users = await User.query().where(result).eager('qnaUsers');
        const userDb = users[0];
        assert.deepEqual(userDb, result, 'user and qna user should have been created in database');
      });

      it('return QnAUser model object after successfully creating user', function () {
        assert.isObject(result, 'user model must be an object');
      });

      it('check input object username equals returned object username', function () {
        assert.equal(result.qnaUsers.username, user.qnaUsers.username,
          'input object username must be equal returned object username');
      });

      function comparing(candidatePassword, hash) {
        return new Promise((resolve, reject) => {
          bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
            if (err) return reject(err);
            return resolve(isMatch);
          });
        });
      }
      it('check input object userpass equals returned object userpass', async function () {
        const isMatch = await comparing(result.qnaUsers.userpass, passwordHash);
        assert.exists(isMatch, 'input object userpass must be equal returned object userpass');
      });

      it('check returned object properties', function () {
        assert.containsAllKeys(result,
          ['userId', 'displayName', 'provider', 'createdAt', 'updatedAt', 'qnaUsers'],
          'returned object must contain enough properties');

        assert.containsAllKeys(result.qnaUsers, ['username', 'userpass', 'userId', 'createdAt', 'updatedAt']
          , ['returned object must contain enough properties']);
      });
    });

    describe('Create QnA User(Testing Transaction)', function () {
      let user;
      before(async function () {
        try {
          user = new User();
          user.displayName = 'Todd Haydel(Transaction Test)';
          user.provider = 'qna';

          user.qnaUsers = new QnAUser();
          user.qnaUsers.username = 'todd_haydel';
          user.qnaUsers.userpass = '123';

          await UserService.createQnAUser(user);
        } catch (err) {
          // do nothing
        }
      });

      it('check rollback transaction when errors occured', async function () {
        const users = await User.query().where(user);
        assert.isEmpty(users, 'rollback must occur when errors happended in transactions');
      });

    });

    describe('Create Google User', function () {
      let user;
      let result;

      before(async function () {
        user = new User();
        user.displayName = 'Duy Phan';
        user.provider = 'google';

        user.googleUsers = new GoogleUser();
        user.googleUsers.email = 'phuongduyphan@gmail.com';

        result = await UserService.createGoogleUser(user);
      });

      it('check user and google user have been created in database', async function () {
        const users = await User.query().where(result).eager('googleUsers');
        const userDb = users[0];
        assert.deepEqual(userDb, result, 'user and google user should have been created in database');
      });

      it('return GoogleUser model object after successfully creating user', async function () {
        assert.isObject(result, 'user model must be an object');
      });

      it('check input object properties equal return object properties', function () {
        assert.equal(result.displayName, user.displayName, 'displayName must be the same');
        assert.equal(result.provider, user.provider, 'provider must be the same');
        assert.equal(result.googleUsers.email, user.googleUsers.email, 'email must be the same');
      });

      it('check returned object properties', function () {
        assert.containsAllKeys(result,
          ['userId', 'displayName', 'provider', 'createdAt', 'updatedAt', 'googleUsers'],
          'returned object must contain enough properties');

        assert.containsAllKeys(result.googleUsers, ['email', 'userId', 'createdAt', 'updatedAt']
          , ['returned object must contain enough properties']);
      });
    });

    describe('Create Google User(Testing Transaction)', function () {
      let user;

      before(async function () {
        try {
          user = new User();
          user.displayName = 'Karen Joyce(Transaction Test)';
          user.provider = 'google';

          user.googleUsers = new GoogleUser();
          user.googleUsers.email = 'karenjoyce@gmail.com';

          await UserService.createGoogleUser(user);
        } catch (err) {
          // do nothing
        }
      });

      it('check rollback transaction when errors occured', async function () {
        const users = await User.query().where(user);
        assert.isEmpty(users, 'rollback must occur when errors happended in transactions');
      });
    });

    describe('Compare QnAUser Password', function () {
      function hashing(userpass) {
        return new Promise((resolve, reject) => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userpass, salt, (errHash, hash) => {
              if (errHash) return reject(errHash);
              return resolve(hash);
            });
          });
        });
      }

      it('compare password and hash', async function () {
        const hash = await hashing('123');
        const isMatch = await UserService.comparePasswordQnAUser('123', hash);
        assert.exists(isMatch, 'password should equal password\'s hash');
      })
    });
  });
});