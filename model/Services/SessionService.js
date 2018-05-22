var DAOFactory = require('../DAL/DAOFactory.js');

class SessionService {
	
	constructor() {
		var mysqlDAOFactory = DAOFactory.getDAOFactory(1);
		this.SessionDAO = mysqlDAOFactory.getSessionDAO();
	}

	getSessionById(sessionId, callback) {
		this.SessionDAO.getSessionById(sessionId, (err, result) => {
			if (err) throw err;
			callback(null, result);
		});
	}

}

module.exports = SessionService;