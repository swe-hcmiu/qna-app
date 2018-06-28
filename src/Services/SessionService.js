var DAOFactory = require('../DAL/DAOFactory');

class SessionService {
	constructor() {
		const mysqlDAOFactory = DAOFactory.getDAOFactory(DAOFactory.mysql);
		this.SessionDAO = mysqlDAOFactory.getSessionDAO();
	}

	getServiceByRole(role) {
		switch (role) {
			case 'USER':
				const UserSessionService = require('./UserSessionService');
				return new UserSessionService();
			case 'EDITOR':
				const EditorSessionService = require('./EditorSessionService');
				return new EditorSessionService();
			default:
				throw new Error('No role returned');
		}
	}

	async getSessionById(sessionId) {
		try {
			const result = this.SessionDAO.getSessionById(sessionId);
			return result;
		}
		catch(err) {
			throw err;
		}
	}
}

module.exports = SessionService;