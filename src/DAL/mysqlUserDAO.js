var bcrypt = require('bcryptjs'); 
var preparedStatements = require('./preparedStatements');


class mysqlUserDAO {
	constructor() {
		this.pool = require('./mysqlDAOFactory').pool;
	}

	async createUser(user) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.insertQuery,['Users',user]);
			return result;
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async createQnAUserTransaction(newUser) {
		try {
			const part1User = {
				DisplayName: newUser.DisplayName,
				Provider: newUser.Provider
			};
			
			var connection = await this.pool.getConnection();

			await connection.beginTransaction();
			const resultInsertPart1 = await connection.query(preparedStatements.insertQuery,['Users',part1User]);
			const UserId = resultInsertPart1.insertId;
			const part2User = {
				UserId: UserId,
				UserName: newUser.UserName,
				UserPass: newUser.UserPass
			};
			const resultInsertPart2 = await this.createQnAUser(part2User, connection);
			connection.commit();
		}
		catch(err) {
			await connection.rollback();
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async createQnAUser(qnaUser, connection) {
		function hashing() {
			return new Promise((resolve,reject) => {
				bcrypt.genSalt(10,(err,salt) => {
					bcrypt.hash(qnaUser.UserPass, salt, (err,hash) => {
						if (err) return reject(err);
						return resolve(hash);
					});
				});
			});
		}
		
		try {
			const hash = await hashing();
			qnaUser.UserPass = hash;

			const result = await connection.query(preparedStatements.insertQuery,['QnAUsers',qnaUser]);
			return result;
		}
		catch(err) {
			throw err;
		}
	}

	async createGoogleUserTransaction(newUser) {
		try {
			const part1User = {
				DisplayName: newUser.DisplayName,
				Provider: newUser.Provider
			};

			var connection = await this.pool.getConnection();

			await connection.beginTransaction();
			const resultInsertPart1 = await connection.query(preparedStatements.insertQuery,['Users',part1User]);
			const UserId = resultInsertPart1.insertId;
			const part2User = {
				UserId: UserId,
				Email: newUser.Email
			};
			const resultInsertPart2 = await this.createGoogleUser(part2User, connection);
			connection.commit();
			return part2User;
		}
		catch(err) {
			await connection.rollback();
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async createGoogleUser(googleUser, connection) {
		try {
			const result = await connection.query(preparedStatements.insertQuery,['GoogleUsers',googleUser]);
			return result;
		}
		catch(err) {
			throw err;
		}
	}

	async getUserById(id) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.selectAllQuery,['Users','UserId',id]);
			return result[0];
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async getQnAUserByUserName(username) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.selectAllQuery,['QnAUsers','UserName',username]);
			return result[0];
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async getGoogleUserByEmail(email) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.selectAllQuery,['GoogleUsers','Email',email]);
			return result[0];
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	}

	async comparePasswordQnAUser(candidatePassword, hash) {
		function comparing() {
			return new Promise((resolve,reject) => {
				bcrypt.compare(candidatePassword, hash, (err,isMatch) => {
					if (err) return reject(err);
					return resolve(isMatch);
				});
			});
		}

		try {
			const result = await comparing();
			return result;
		}
		catch(err) {
			throw err;
		}
	}

	async getRoleOfUserInSession(UserId, SessionId) {
		try {
			var connection = await this.pool.getConnection();
			const result = await connection.query(preparedStatements.selectAllQueryWithTwoConstraints,
				['Roles','UserId',UserId,'SessionId',SessionId]);
			return result[0];
		}
		catch(err) {
			throw err;
		}
		finally {
			connection.release();
		}
	} 
}

module.exports = mysqlUserDAO;