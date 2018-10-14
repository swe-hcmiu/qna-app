const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('../services/UserService');
const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

passport.use(new GoogleStrategy({
  clientID: '481461792112-5kkhv66re36p7jmvs74hbmnbu1ndgnn2.apps.googleusercontent.com',
  clientSecret: 'GdnR4VbS7a5vOWLAyDaLQC5v',
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, cb) => {
  UserService.authenticateGoogleUser(profile)
    .then((result) => {
      cb(null, result);
    })
    .catch((err) => {
      cb(err);
    });
}));

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    UserService.getUserById(jwt_payload.userId)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));
};
