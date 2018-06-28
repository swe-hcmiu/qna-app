var DAOFactory = require('./DAL/DAOFactory');

var mysqlDAOFactory = DAOFactory.getDAOFactory(DAOFactory.mysql);
var UserDAO = mysqlDAOFactory.getUserDAO();
// var newUser = {
// 	DisplayName:'Starkkk',
// 	Provider:'qna'
// };

// UserDAO.createUser(newUser)
// 	.then((result) => {
// 		console.log(result.insertId);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	})

// newUser = {
// 	UserId:2,
// 	UserName:'duyphan',
// 	UserPass:'123'
// }

// UserDAO.createQnAUser(newUser)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	})

// UserDAO.comparePasswordQnAUser('123','$2a$10$LoKwwAlZSL0ND6CiqCisTeRzsbVuhKKYVFQnb3C58oQnS0wLvexCi')
// 	.then((result) => {
// 		console.log(result);
// 	})

// var newUser = {
// 	DisplayName:'Starkkk',
// 	Provider:'qna',
// 	UserName:'duyphan',
// 	UserPass:'123'
// };

// UserDAO.createQnAUserTransaction(newUser).then((result) => {
// 	console.log(result);
// })

var UserSessionService = require('./Services/UserSessionService');
var service = new UserSessionService();