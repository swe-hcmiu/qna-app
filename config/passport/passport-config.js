const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { UserService } = require('../../src/users/UserService');
const UserController = require('../../src/users/UserController');
const keys = require('./keys');

passport.use(new GoogleStrategy({
  clientID: '481461792112-5kkhv66re36p7jmvs74hbmnbu1ndgnn2.apps.googleusercontent.com',
  clientSecret: keys.clientGoogleSecret,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const recvUser = await UserService.authenticateGoogleUser(profile);
    const userReturn = UserController.removeRedundantAttributesGoogleUser(recvUser);

    const googleUser = JSON.parse(JSON.stringify(userReturn));
    cb(null, googleUser);
  } catch (err) {
    cb(err);
  }
}));

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.tokenSecret;


module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    UserService.getUserById(jwtPayload.userId)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));
};
