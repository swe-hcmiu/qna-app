const preparedStatements = require('./preparedStatements');

class mysqlSessionDAO {
  constructor() {
    this.pool = require('./mysqlDAOFactory').pool;
  }

  async createSessionTransaction(creatorId, newSession, role) {
    try {
      const connection = await this.pool.getConnection();
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
  }

  static async createSession(newSession, connection) {
    try {
      const result = await connection.query(preparedStatements.insertQuery, ['sessions', newSession]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  }

  static async assignRole(roleObject, connection) {
    try {
      const result = await connection.query(preparedStatements.insertQuery, ['roles', roleObject]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getSessionById(id) {
    try {
      const connection = await this.pool.getConnection();
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
  }

  async getRolesBySessionId(sessionId) {
    try {
      const connection = await this.pool.getConnection();
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
  }

  async addQuestion(newQuestion) {
    try {
      const connection = await this.pool.getConnection();
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
  }

  async getQuestionsOfSession(SessionId, includingPending) {
    try {
      const connection = await this.pool.getConnection();
      try {
        let result;
        if (includingPending) {
          result = await connection.query(preparedStatements.selectAllQuery, ['questions', 'SessionId', SessionId]);
        } else {
          result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints2,
            ['Questions', 'SessionId', SessionId, 'Status', 'PENDING']);
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
  }
}

module.exports = mysqlSessionDAO;
