const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../config/passport/keys');

const router = express.Router();


router.get('/google', passport.authenticate('google', {
  scope: ['profile',
    'https://www.googleapis.com/auth/userinfo.email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login', session: false }),
  (req, res) => {
    const payload = req.user;
    const token = jwt.sign(payload, keys.tokenSecret, {
      expiresIn: '7d',
    });
    res.send({
      success: true,
      token,
    });
  });

module.exports = router;
