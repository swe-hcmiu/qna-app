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
    validateUserHandler.validateRegisterInput(validateObj);

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
        err.description = 'UserName already exists';
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
    const { UserName, Password } = req.body;
    const user = {
      UserName: UserName,
      UserPass: Password,
    };
    // console.log(user);
    const result = await UserService.authenticateQnAUser(user);
    if (result.success) {
      const payload = {
        userId: result.id,
      };
      console.log(payload);
      // token
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
    err.description = 'Invalid UserName or Password';
    throw err;
  } catch (err) {
    console.log(err);
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
