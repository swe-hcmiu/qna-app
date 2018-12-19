const { transaction } = require('objection');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const { User } = require('./User');

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
      const inputUser = _.cloneDeep(user);

      let recvUser;
      inputUser.qnaUsers.userpass = await hashing(inputUser.qnaUsers.userpass);

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
    let returnUser = null;
    const returnUsers = await User.query().where(user).select('userId');
    if (!_.isEmpty(returnUsers)) returnUser = returnUsers[0];
    return returnUser;
  }
}

module.exports = {
  UserService,
};
