const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../src/config/keys');

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile',
    'https://www.googleapis.com/auth/userinfo.email'],
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login', session: false }),
  (req, res) => {
    const payload = {
      userId: req.user.UserId,
    };
    const token = jwt.sign(payload, keys.secretOrKey, {
      expiresIn: '7d',
    });
    res.send({
      success: true,
      token,
    });
    //res.redirect('/sessions');
  });

module.exports = router;
