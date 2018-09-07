const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('./Services/UserService');

passport.use(new GoogleStrategy({
  clientID: '481461792112-5kkhv66re36p7jmvs74hbmnbu1ndgnn2.apps.googleusercontent.com',
  clientSecret: 'GdnR4VbS7a5vOWLAyDaLQC5v',
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, cb) => {
  const userService = new UserService();
  userService.authenticateGoogleUser(profile)
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
      UserName: username,
      UserPass: password,
    };
    const userService = new UserService();
    userService.authenticateQnAUser(user)
      .then((result) => {
        done(null, result.user, result.message);
      })
      .catch((err) => {
        done(err);
      });
  },
));

passport.serializeUser((user, done) => {
  done(null, user.UserId);
});

passport.deserializeUser((id, done) => {
  const userService = new UserService();
  userService.getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
