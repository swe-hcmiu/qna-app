const preparedStatements = require('./preparedStatements');
const mysqlConfig = require('../config/mysql-config');

module.exports = {
  async getListOfSessions() {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const listOfSessions = await connection.query(preparedStatements.selectAllQuery2, ['sessions']);
        return listOfSessions;
      } catch (err) {
        throw err;
      } finally {
        connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async createSessionTransaction(creatorId, newSession, role) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        await connection.beginTransaction();
        const sessionId = await this.createSession(newSession, connection);
        const roleObject = {
          UserId: creatorId,
          SessionId: sessionId,
          Role: role,
        };
        await this.assignRole(roleObject, connection);
        await connection.commit();
        return sessionId;
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

  async createSession(newSession, connection) {
    try {
      const result = await connection.query(preparedStatements.insertQuery, ['sessions', newSession]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  async assignRole(roleObject, connection) {
    try {
      const result = await connection.query(preparedStatements.insertQuery, ['roles', roleObject]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getSessionById(id) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery, ['sessions', 'SessionId', id]);
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

  async getRolesBySessionId(sessionId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery, ['roles', 'SessionId', sessionId]);
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

  async addQuestion(newQuestion) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.insertQuery, ['questions', newQuestion]);
        return result.insertId;
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async getQuestionsOfSession(SessionId, includingPending) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        let result;
        if (includingPending) {
          result = await connection.query(preparedStatements.selectAllQuery, ['questions', 'SessionId', SessionId]);
        } else {
          result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints2,
            ['questions', 'SessionId', SessionId, 'Status', 'PENDING']);
        }
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

  async getQuestion(questionId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const result = await connection.query(preparedStatements.selectAllQuery,
          ['questions', 'QuestionId', questionId]);
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

  async addVoteTransaction(questionId, userId, role) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        await connection.beginTransaction();

        const votingObj = { QuestionId: questionId, UserId: userId };
        await connection.query(preparedStatements.insertQuery, ['voting', votingObj]);
        switch (role) {
          case 'USER': {
            await connection.query(preparedStatements.updateUserVoteQuery, ['questions', 'QuestionId', questionId]);
            break;
          }
          case 'EDITOR': {
            await connection.query(preparedStatements.updateEditorVoteQuery, ['questions', 'QuestionId', questionId]);
            break;
          }
          default:
            throw new Error('Role incorrect');
        }
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

  async cancelVoteTransaction(questionId, userId, role) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        await connection.beginTransaction();
        const result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints,
          ['voting', 'QuestionId', questionId, 'UserId', userId]);

        if (result[0]) {
          await connection.query(preparedStatements.deleteAllQueryWithTwoConstraints,
            ['voting', 'QuestionId', questionId, 'UserId', userId]);

          switch (role) {
            case 'USER': {
              await connection.query(preparedStatements.cancelUserVoteQuery, ['questions', 'QuestionId', questionId]);
              break;
            }
            case 'EDITOR': {
              await connection.query(preparedStatements.cancelEditorVoteQuery, ['questions', 'QuestionId', questionId]);
              break;
            }
            default:
              throw new Error('Role incorrect');
          }
          await connection.commit();
        } else {
          throw new Error('Not Found');
        }
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

  async getListOfVotedQuestions(sessionId, userId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const listOfVotedQuestions = await connection.query(preparedStatements.selectListOfVotedQuestions,
          [userId, sessionId]);
        return listOfVotedQuestions;
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async updateQuestionStatus(questionId, status) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        await connection.query(preparedStatements.updateQueryWithConstraints, ['questions', 'Status', status,
          'QuestionId', questionId]);
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async getListOfEditors(sessionId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const listOfEditors = await connection.query(preparedStatements.selectQuery, ['UserId', 'roles',
          'SessionId', sessionId]);
        return listOfEditors;
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async addEditor(sessionId, userId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const roleObject = {
          UserId: userId,
          SessionId: sessionId,
          Role: 'EDITOR',
        };
        await connection.query(preparedStatements.insertQuery, ['roles', roleObject]);
      } catch (err) {
        throw err;
      } finally {
        await connection.release();
      }
    } catch (err) {
      throw err;
    }
  },

  async removeEditor(sessionId, userId) {
    try {
      const connection = await mysqlConfig.pool.getConnection();
      try {
        const role = 'EDITOR';
        await connection.query(preparedStatements.deleteAllQueryWithThreeConstraints, ['roles', 'UserId',
          userId, 'SessionId', sessionId, 'Role', role]);
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
