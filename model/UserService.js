var DAOFactory = require('../model/DAOFactory.js');

class UserService {
	constructor() {
		var mysqlDAOFactory = DAOFactory.getDAOFactory(1);
		this.UserDAO = mysqlDAOFactory.getUserDAO();
	}

	checkUserName(username,callback) {
		this.UserDAO.getUserByUserName(username,(err,user) => {
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
		_this.UserDAO.getUserByUserName(user.username,(err,userReturn) => {
			if(err) {
				throw err;
			}
			if(!userReturn){
				return callback(null, false, {message: 'Unknown User'});
			}
				
			_this.UserDAO.comparePassword(user.password,userReturn.password,(err,isMatch) => {
				if(err) {
					throw err;
				}
				if(isMatch){
					return callback(null, userReturn,'Login successfully');
				} else {
					return callback(null, false, {message: 'Invalid password'});
				}
			})
		})
	}
}

module.exports = UserService;