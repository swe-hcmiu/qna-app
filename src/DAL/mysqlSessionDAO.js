var preparedStatements = require('./preparedStatements');

class mysqlSessionDAO {
	constructor() {
		this.pool = require('./mysqlDAOFactory').pool;
	}

	async createSessionTransaction(creatorId, newSession, role) {
		try {
			var connection = await this.pool.getConnection();
			
			await connection.beginTransaction();
			const sessionId = await this.createSession(newSession,connection);
			const roleObject = {
				UserId: creatorId,
				SessionId: sessionId,
				Role: role
			}
			const result = await this.assignRole(roleObject, connection);
			connection.commit();
			return sessionId;
		}
		catch(err) {
			connection.rollback();
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async createSession(newSession, connection) {
		try {
			const result = await connection.query(preparedStatements.insertQuery,['Sessions', newSession]);
			return result.insertId;
		}
		catch(err) {
			throw err;
		}
	}

	async assignRole(roleObject, connection) {
		try {
			const result = await connection.query(preparedStatements.insertQuery,['Roles',roleObject]);
			return result;
		}
		catch(err) {
			throw err;
		}
	}

	async getSessionById(id) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.selectAllQuery,['Sessions','SessionId',id]);
			return result[0];
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async getRolesBySessionId(sessionId) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.selectAllQuery,['Roles','SessionId',sessionId]);
			return result;
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async addQuestion(newQuestion) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.insertQuery, ['Questions', newQuestion]);
			return result.insertId;
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async getQuestionsOfSession(SessionId,includingPending) {
		try {
			var connection = await this.pool.getConnection();
			
			if (includingPending) {
				const result = await connection.query(preparedStatements.selectAllQuery, ['Questions', 'SessionId', SessionId]);
				return result;
			}
			else {
				const result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints2, 
					['Questions', 'SessionId', SessionId, 'Status', 'PENDING']);
				return result;
			}
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}
}

module.exports = mysqlSessionDAO;