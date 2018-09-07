const express = require('express');

const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: ['profile',
    'https://www.googleapis.com/auth/userinfo.email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.redirect('/');
  });

module.exports = router;
