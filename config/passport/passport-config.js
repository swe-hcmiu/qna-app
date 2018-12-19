const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { UserService } = require('../../src/users/UserService');

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

passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = {
      userName: username,
      userPass: password,
    };
    UserService.authenticateQnAUser(user)
      .then((result) => {
        done(null, result.user, result.message);
      })
      .catch((err) => {
        done(err);
      });
  },
));

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser((id, done) => {
  UserService.getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
