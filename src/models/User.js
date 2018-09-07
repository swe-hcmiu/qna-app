const bcrypt = require('bcryptjs');
const preparedStatements = require('./preparedStatements');
const mysqlConfig = require('../config/mysql-config');

module.exports = {
  async createUser(user) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.insertQuery, ['users', user]);
        return result;
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async createQnAUserTransaction(newUser) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const part1User = {
          DisplayName: newUser.DisplayName,
          Provider: newUser.Provider,
        };

        await connection.beginTransaction();
        const resultInsertPart1 = await connection.query(preparedStatements.insertQuery, ['users', part1User]);
        const UserId = resultInsertPart1.insertId;
        const part2User = {
          UserId,
          UserName: newUser.UserName,
          UserPass: newUser.UserPass,
        };
        await this.createQnAUser(part2User, connection);
        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async createQnAUser(qnaUser, connection) {
    function hashing() {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(qnaUser.UserPass, salt, (errHash, hash) => {
            if (errHash) return reject(errHash);
            return resolve(hash);
          });
        });
      });
    }

    try {
      const hash = await hashing();
      const user = qnaUser;
      user.UserPass = hash;

      const result = await connection.query(preparedStatements.insertQuery, ['qnausers', user]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async createGoogleUserTransaction(newUser) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const part1User = {
          DisplayName: newUser.DisplayName,
          Provider: newUser.Provider,
        };
        await connection.beginTransaction();
        const resultInsertPart1 = await connection.query(preparedStatements.insertQuery, ['users', part1User]);
        const UserId = resultInsertPart1.insertId;
        const part2User = {
          UserId,
          Email: newUser.Email,
        };
        await this.createGoogleUser(part2User, connection);
        await connection.commit();
        return part2User;
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async createGoogleUser(googleUser, connection) {
    try {
      const result = await connection.query(preparedStatements.insertQuery, ['googleusers', googleUser]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getUserById(id) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery, ['users', 'UserId', id]);
        return result[0];
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async getQnAUserByUserName(username) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery, ['qnausers', 'UserName', username]);
        return result[0];
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async getGoogleUserByEmail(email) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery, ['googleusers', 'Email', email]);
        return result[0];
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async comparePasswordQnAUser(candidatePassword, hash) {
    function comparing() {
      return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
          if (err) return reject(err);
          return resolve(isMatch);
        });
      });
    }

    try {
      const result = await comparing();
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getRoleOfUserInSession(UserId, SessionId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints,
          ['roles', 'UserId', UserId, 'SessionId', SessionId]);
        return result[0];
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },
};
