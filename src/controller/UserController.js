const UserService = require('../services/UserService');
const validateRegisterHandler = require('../validator/register');

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
    validateRegisterHandler(validateObj);

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

exports.user_login_post = async (req, res) => {
  res.redirect('/sessions');
};

exports.user_logout_get = async (req, res) => {
  req.logout();
  res.redirect('/');
};
