const { transaction } = require('objection');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const { User, QnAUser, GoogleUser } = require('./User');
const { AppError } = require('../errors/AppError');

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

function comparing(candidatePassword, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) return reject(err);
      return resolve(isMatch);
    });
  });
}

class UserService {
  static async createUser(user) {
    try {
      const recvUser = await User
        .query()
        .insertAndFetch(user);

      return recvUser;
    } catch (err) {
      throw err;
    }
  }

  static async createAnonymousUser() {
    try {
      const user = new User();
      user.displayName = Math.random().toString(36);
      user.provider = 'anonymous';

      const returnUser = await this.createUser(user);
      return returnUser;
    } catch (err) {
      throw err;
    }
  }

  static async createQnAUser(user) {
    try {
      const inputUser = Object.assign(new User(), _.cloneDeep(user));
      inputUser.qnaUsers = Object.assign(new QnAUser(), _.cloneDeep(user.qnaUsers));
      if (!inputUser.displayName) inputUser.displayName = inputUser.qnaUsers.username;

      inputUser.$validate();
      inputUser.qnaUsers.$validate();

      let recvUser;
      inputUser.qnaUsers.userpass = await hashing(inputUser.qnaUsers.userpass);
      inputUser.provider = 'qna';

      await transaction(User.knex(), async (trx) => {
        recvUser = await User
          .query(trx)
          .insertGraphAndFetch(inputUser);
      });

      return recvUser;
    } catch (err) {
      switch (err.code) {
        case 'ER_DUP_ENTRY': {
          throw new AppError('Username already exists', 409, err);
        }
        default: {
          break;
        }
      }
      throw err;
    }
  }

  static async authenticateQnAUser(user) {
    try {
      const users = await QnAUser.query().where({ username: user.username });
      if (_.isEmpty(users)) {
        throw new AppError('Username does not exist', 404);
      }

      const recvQnAUser = users[0];
      const isMatch = await this.comparePasswordQnAUser(user.userpass, recvQnAUser.userpass);
      if (isMatch) {
        const recvUsers = await User.query().eager('qnaUsers').where({ userId: recvQnAUser.userId });
        const recvUser = recvUsers[0];

        return recvUser;
      }
      throw new AppError('Incorrect password', 401);
    } catch (err) {
      throw err;
    }
  }

  static async createGoogleUser(user) {
    try {
      const inputUser = _.cloneDeep(user);
      let recvUser;

      await transaction(User.knex(), async (trx) => {
        recvUser = await User
          .query(trx)
          .insertGraphAndFetch(inputUser);
      });

      return recvUser;
    } catch (err) {
      throw err;
    }
  }

  static async authenticateGoogleUser(profile) {
    try {
      const googleUsers = await GoogleUser.query().where({
        email: profile.emails[0].value,
      });

      if (!_.isEmpty(googleUsers)) {
        const recvUsers = await User.query().eager('googleUsers').where({ userId: googleUsers[0].userId });
        const recvUser = recvUsers[0];

        return recvUser;
      }

      const inputUser = new User();
      inputUser.displayName = profile.displayName;
      inputUser.provider = 'google';
      inputUser.googleUsers = new GoogleUser();
      inputUser.googleUsers.email = profile.emails[0].value;

      const recvGoogleUser = await this.createGoogleUser(inputUser);

      return recvGoogleUser;
    } catch (err) {
      throw err;
    }
  }

  static async comparePasswordQnAUser(candidatePassword, hash) {
    try {
      const isMatch = await comparing(candidatePassword, hash);
      return isMatch;
    } catch (err) {
      throw err;
    }
  }

  static async getUserInstance(user) {
    let returnUser;
    if (user) {
      returnUser = new User();
      returnUser.userId = user.userId;
    } else {
      returnUser = await this.createAnonymousUser();
    }
    return returnUser;
  }

  static getUserInstanceWithId(userId) {
    const user = new User();
    user.userId = userId;
    return user;
  }

  static async getUserById(userId) {
    const user = this.getUserInstanceWithId(userId);
    const returnUsers = await User.query().where(user).select('userId', 'displayName', 'provider');

    let returnUser = null;
    if (!_.isEmpty(returnUsers)) [returnUser] = returnUsers;

    return returnUser;
  }
}

module.exports = {
  UserService,
};
