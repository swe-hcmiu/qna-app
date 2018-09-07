var mysqlDAOFactory = require('./mysqlDAOFactory');

class DAOFactory {
	static getDAOFactory(type) {
		switch (type) {
			case DAOFactory.mysql:
				return new mysqlDAOFactory();
		}
	}
}

DAOFactory.mysql = 1;

module.exports = DAOFactory;