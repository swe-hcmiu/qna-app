var DAOFactory = require('../DAL/DAOFactory.js');

class UserService {
	constructor() {
		var mysqlDAOFactory = DAOFactory.getDAOFactory(1);
		this.UserDAO = mysqlDAOFactory.getUserDAO();
	}

	checkUserName(UserName,callback) {
		this.UserDAO.getUserByUserName(UserName,(err,user) => {
			if (!user) callback({status:'Available'});
			else callback({status:'Unavailable'});
		})
	}

	createUser(newUser,callback) {
		this.UserDAO.createUser(newUser,(err,user) => {
			if (err) callback(err,null);
			else callback(null,user);
		});
	}

	authenticate(user,callback) {
		var _this = this;
		console.log("Authenticate:",user);
		console.log("UserName", user.UserName);
		_this.UserDAO.getUserByUserName(user.UserName,(err,userReturn) => {
			if(err) {
				throw err;
			}

			if(!userReturn){
				return callback(null, false, {message: 'Unknown User'});
			} else {
				_this.UserDAO.comparePassword(user.UserPass, userReturn.UserPass,(err,isMatch) => {
				
					if(err) {
						throw err;
					}
					if(isMatch){
						return callback(null, userReturn,'Login successfully');
					} else {
						return callback(null, false, {message: 'Invalid password'});
					}
				});
			}		
		});
	}

	getUserById(user, callback) {
		this.UserDAO.createUser(newUser,(err,user) => {
			if (err) callback(err,null);
			else callback(null,user);
		});
	}
}

module.exports = UserService;