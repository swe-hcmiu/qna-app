const DAOFactory = require('../DAL/DAOFactory');
const UserDAO = require('../DAL/mysqlUserDAO');

class UserService {
  constructor() {
    const mysqlDAOFactory = DAOFactory.getDAOFactory(DAOFactory.mysql);
    this.UserDAO = mysqlDAOFactory.getUserDAO();
  }

  static getUserId(user) {
    if (user) return user.UserId;
    return -1;
  }

  async registerQnAUser(newUser) {
    try {
      await this.UserDAO.createQnAUserTransaction(newUser);
    } catch (err) {
      throw err;
    }
  }

  async authenticateQnAUser(user) {
    try {
      const userReturn = await this.UserDAO.getQnAUserByUserName(user.UserName);
      if (!userReturn) return { user: false, message: 'Unknown User' };

      const isMatch = await UserDAO.comparePasswordQnAUser(user.UserPass, userReturn.UserPass);
      if (isMatch) return { user: userReturn, message: 'Login successfully' };
      return { user: false, message: 'Invalid password' };
    } catch (err) {
      throw err;
    }
  }

  async authenticateGoogleUser(profile) {
    try {
      const userReturn = await this.UserDAO.getGoogleUserByEmail(profile.emails[0].value);
      if (userReturn) return userReturn;

      const newUser = {
        DisplayName: profile.displayName,
        Provider: 'google',
        Email: profile.emails[0].value,
      };

      const userGoogleReturn = await this.registerGoogleUser(newUser);
      return userGoogleReturn;
    } catch (err) {
      throw err;
    }
  }

  async registerGoogleUser(newUser) {
    try {
      const userReturn = await this.UserDAO.createGoogleUserTransaction(newUser);
      return userReturn;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id) {
    try {
      const result = await this.UserDAO.getUserById(id);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getRoleOfUserInSession(UserId, SessionId) {
    try {
      const result = await this.UserDAO.getRoleOfUserInSession(UserId, SessionId);
      if (!result) return { UserId, SessionId, Role: 'USER' };
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
