var UserService = require('./Services/UserService.js');
var SessionService = require('./Services/SessionService.js');


var userService = new UserService();
userService.getRoleOfUserInSession(1,2,(err,result) => {
	if (err) console.log(err);
	else console.log(result[0].Role);
});



