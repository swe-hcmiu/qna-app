const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');
const validateUserHandler = require('../validator/user');
const keys = require('../config/keys');


exports.user_register_get = async (req, res) => {
  res.render('register', { errors: null });
};

exports.user_register_post = async (req, res, next) => {
  try {
    const validateObj = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserName: req.body.UserName,
      UserPass: req.body.UserPass,
    };
    await validateUserHandler.validateRegisterInput(validateObj);

    const newUser = {
      DisplayName: `${req.body.FirstName} ${req.body.LastName}`,
      UserName: req.body.UserName,
      UserPass: req.body.UserPass,
      Provider: 'qna',
    };

    await UserService.registerQnAUser(newUser);

    res.sendStatus(200);
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
    const { username, password } = req.body;
    const user = {
      UserName: username,
      UserPass: password,
    };

    const responseQnA = await UserService.authenticateQnAUser(user);
    const qnaUser = JSON.parse(JSON.stringify(responseQnA.user));
    delete qnaUser.UserPass;

    if (responseQnA.success) {
      const responseGeneral = await UserService.getUserById(qnaUser.UserId);
      const generalUser = JSON.parse(JSON.stringify(responseGeneral));
      const payload = Object.assign(qnaUser, generalUser);

      const token = jwt.sign(payload, keys.secretOrKey, {
        expiresIn: '7d',
      });

      return res.status(200).json({
        success: true,
        token,
      });
    }
    const err = new Error('Not Found');
    err.httpCode = 404;
    err.description = 'Invalid username or password';
    throw err;
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
    const validateObj = {
      user: req.user,
    };
    await validateUserHandler.validateUserLogin(validateObj);
    res.send(req.user);
  } catch (err) {
    next(err);
  }
};
