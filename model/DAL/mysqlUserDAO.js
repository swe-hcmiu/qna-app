var mysqlDAOFactory = require('./mysqlDAOFactory.js');
var bcrypt = require('bcryptjs');
var preparedStatements = require('./preparedStatements');

class mysqlUserDAO {
	constructor() {
		var mysqlDAOFactory = require('./mysqlDAOFactory.js');
		this.connection = mysqlDAOFactory.createConnection();
		this.mysql = mysqlDAOFactory.getDbInstance();
	}
	
	createUser(newUser,callback) {
		// In callback function, 'this' can be undefined.So we assign another variable _this to save the reference of 'this'
		var _this = this; 

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.UserPass, salt, function(err, hash) {
				if (err) callback(err,null);

				newUser.UserPass = hash;

				_this.connection.query(_this.mysql.format(preparedStatements.insertQuery,['Users',newUser]), (err) => {
					if (err) callback(err,null);
					else callback(null,newUser);
				});
			});
		});
	}

	getUserByUserName(UserName,callback) {
		this.connection.query(this.mysql.format(preparedStatements.selectAllQuery,['Users','UserName',UserName]),
			(err,result) => {
				if (err) callback(err,null);
				else {
					console.log(result[0]);
					callback(null,result[0]);
				}
			});
	} 

	comparePassword(candidatePassword, hash, callback) {
		bcrypt.compare(candidatePassword,hash,(err,isMatch) => {
			if (err) callback(err,null);
			else callback(null,isMatch);
		});
	}

	getUserById(id,callback) {
		this.connection.query(this.mysql.format(preparedStatements.selectAllQuery,['Users','UserId',id]),
			(err,result) => {
				if (err) callback(err,null);
				else callback(null,result[0]);
			});
	}
	getRoleOfUserInSession(UserId,SessionId,callback) {
		this.connection.query(this.mysql.format(preparedStatements.selectAllQueryWithTwoConstraints,['Roles','UserId',UserId,'SessionId',SessionId]),
			(err,result) => {
				if (err) callback(err,null);
				else callback(null,result[0]);
			});

	}
}

module.exports = mysqlUserDAO;
