const UserService = require('../services/UserService');

exports.user_register_get = async (req, res) => {
  res.render('register', { errors: null });
};

exports.user_register_post = async (req, res) => {
  req.checkBody('FirstName', 'Firstname is required').notEmpty();
  req.checkBody('LastName', 'Lastname is required').notEmpty();
  req.checkBody('UserName', 'Username is required').notEmpty();
  req.checkBody('UserPass', 'Password is required').notEmpty();

  const InputErrors = req.validationErrors();
  if (InputErrors) {
    res.render('register', { errors: InputErrors });
  } else {
    try {
      const newUser = {
        DisplayName: `${req.body.FirstName} ${req.body.LastName}`,
        UserName: req.body.UserName,
        UserPass: req.body.UserPass,
        Provider: 'qna',
      };

      const userService = new UserService();
      await userService.registerQnAUser(newUser);

      req.flash('success_msg', 'register successfully');
      res.redirect('/users/login');
    } catch (err) {
      req.flash('error_msg', 'username already exists!');
      res.redirect('/users/register');
    }
  }
};

exports.user_login_get = async (req, res) => {
  res.render('login');
};

exports.user_login_post = async (req, res) => {
  res.redirect('/');
};

exports.user_logout_get = async (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
};
