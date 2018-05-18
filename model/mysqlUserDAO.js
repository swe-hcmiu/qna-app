var mysqlDAOFactory = require('../model/mysqlDAOFactory.js');
var bcrypt = require('bcryptjs');

class mysqlUserDAO {
	constructor() {
		var mysqlDAOFactory = require('../model/mysqlDAOFactory.js');
		this.connection = mysqlDAOFactory.createConnection();
	}
	
	createUser(newUser,callback) {
		// In callback function, 'this' can be undefined.So we assign another variable _this to save the reference of 'this'
		var _this = this; 

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newUser.password, salt, function(err, hash) {
				if (err) callback(err,null);

				newUser.password = hash;

				var dataSQL = "INSERT INTO user(username,password,email) VALUES (" + _this.connection.escape(newUser.username) + "," + 
				_this.connection.escape(newUser.password) + "," + _this.connection.escape(newUser.email) + ")";

				_this.connection.query(dataSQL,function(err) {
					if (err) callback(err,null);
					else callback(null,newUser);
				});
			});
		});
	}

	getUserByUserName(username,callback) {
		var dataSQL = "SELECT * FROM user WHERE username = " + 
		this.connection.escape(username);

		this.connection.query(dataSQL,function(err,result,fields) {
			if (err) callback(err,null);
			else callback(null,result[0]);
		});
	} 

	comparePassword(candidatePassword, hash, callback) {
		bcrypt.compare(candidatePassword,hash,function(err,isMatch) {
			if (err) callback(err,null);
			else callback(null,isMatch);
		})
	}

	getUserById(id,callback) {
		var dataSQL = "SELECT * FROM user WHERE id = "+ this.connection.escape(id);

		this.connection.query(dataSQL, function(err,result,fields) {
			if (err) callback(err,null);
			else callback(null,result[0]);
		})
	}
}

module.exports = mysqlUserDAO;
