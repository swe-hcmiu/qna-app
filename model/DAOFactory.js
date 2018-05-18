var mysqlDAOFactory = require('../model/mysqlDAOFactory.js')

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