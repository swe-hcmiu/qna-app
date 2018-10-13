const UserService = require('../services/UserService');
const validateUserHandler = require('../validator/user');


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
  // res.redirect('/sessions');
  try {
    const {username, password} = req.body;
    const user = {
      UserName: username,
      UserPass: password,
    };
    // console.log(user);
    await UserService.authenticateQnAUser(user)
      .then(result => {
        // console.log('result', result);
        if (result) {
          res.status(200).json(result);
        } else res.status(401).json(result);
      })
      .catch ((err) => {
        console.log(err);
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
    const validateObj = {
      user: req.user,
    };
    await validateUserHandler.validateUserLogin(validateObj);
    res.send(req.user);
  } catch (err) {
    next(err);
  }
};
