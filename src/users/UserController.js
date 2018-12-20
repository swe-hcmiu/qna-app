const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { UserService } = require('./UserService');
const keys = require('../../config/passport/keys');

exports.removeRedundantAttributesQnAUser = (qnaUser) => {
  const user = _.cloneDeep(qnaUser);
  delete user.qnaUsers.userpass;
  delete user.qnaUsers.createdAt;
  delete user.qnaUsers.updatedAt;
  delete user.qnaUsers.userId;
  return user;
};

exports.removeRedundantAttributesGoogleUser = (googleUser) => {
  const user = _.cloneDeep(googleUser);
  delete user.googleUsers.createdAt;
  delete user.googleUsers.updatedAt;
  delete user.googleUsers.userId;
  return user;
};

exports.user_register_post = async (req, res, next) => {
  try {
    const { user } = req.body;

    const recvUser = await UserService.createQnAUser(user);
    const userReturn = this.removeRedundantAttributesQnAUser(recvUser);

    res.send(userReturn);
  } catch (err) {
    switch (err.code) {
      case 'ER_DUP_ENTRY': {
        err.httpCode = 409;
        err.description = 'Username already exists';
        break;
      }
      default: {
        break;
      }
    }
    next(err);
  }
};

exports.user_login_get = async (req, res) => {
  res.render('login');
};

exports.user_login_post = async (req, res, next) => {
  try {
    const { qnaUser } = req.body;

    const recvUser = await UserService.authenticateQnAUser(qnaUser);
    const userReturn = this.removeRedundantAttributesQnAUser(recvUser);

    const payload = JSON.parse(JSON.stringify(userReturn));
    const token = jwt.sign(payload, keys.tokenSecret, {
      expiresIn: '7d',
    });

    res.send({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.user_logout_get = async (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.user_info_get = async (req, res, next) => {
  try {

  } catch (err) {
    next(err);
  }
};
