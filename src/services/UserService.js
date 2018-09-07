const User = require('../models/User');

module.exports = {
  getUserId(user) {
    if (user) return user.UserId;
    return -1;
  },

  async registerQnAUser(newUser) {
    try {
      await User.createQnAUserTransaction(newUser);
    } catch (err) {
      throw err;
    }
  },

  async authenticateQnAUser(user) {
    try {
      const userReturn = await User.getQnAUserByUserName(user.UserName);
      if (!userReturn) return { user: false, message: 'Unknown User' };

      const isMatch = await User.comparePasswordQnAUser(user.UserPass, userReturn.UserPass);
      if (isMatch) return { user: userReturn, message: 'Login successfully' };
      return { user: false, message: 'Invalid password' };
    } catch (err) {
      throw err;
    }
  },

  async authenticateGoogleUser(profile) {
    try {
      const userReturn = await User.getGoogleUserByEmail(profile.emails[0].value);
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
  },

  async registerGoogleUser(newUser) {
    try {
      const userReturn = await User.createGoogleUserTransaction(newUser);
      return userReturn;
    } catch (err) {
      throw err;
    }
  },

  async getUserById(id) {
    try {
      const result = await User.getUserById(id);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async getRoleOfUserInSession(UserId, SessionId) {
    try {
      const result = await User.getRoleOfUserInSession(UserId, SessionId);
      if (!result) return { UserId, SessionId, Role: 'USER' };
      return result;
    } catch (err) {
      throw err;
    }
  },
};
