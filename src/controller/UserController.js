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

      await UserService.registerQnAUser(newUser);

      res.status(200);
      res.send('REGISTRATION COMPLETED');
    } catch (err) {
      res.status(409);
      res.send('USERNAME ALREADY EXISTS!');
    }
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
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
};
