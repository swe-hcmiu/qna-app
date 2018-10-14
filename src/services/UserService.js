const User = require('../models/User');

module.exports = {
  getUserId(user) {
    if (user) return user.UserId;
    return -1;
  },

  async validateUserId(userId) {
    try {
      let returnId = userId;
      if (returnId === -1) {
        const user = await User.createAnonymousUser();
        returnId = user.insertId;
      }
      return returnId;
    } catch (err) {
      throw err;
    }
  },

  async createAnonymousUser() {
    try {
      const userId = await User.createAnonymousUser();
      return userId;
    } catch (err) {
      throw err;
    }
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
      // console.log('user from service:', user);
      if (!userReturn) return { user: false, message: 'Unknown User' };

      const isMatch = await User.comparePasswordQnAUser(user.UserPass, userReturn.UserPass);
      if (isMatch) {
        return { success: true, id: userReturn.UserId };
      }
      return { success: false };
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
