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
}

module.exports = {
  UserService,
};
