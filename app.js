const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

const passportConfig = require('./src/config/passport-config');
const mysqlConfig = require('./src/config/mysql-config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const sessionRouter = require('./routes/sessions');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.user = req.user || null;
  next();
});

// express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += `[ ${namespace.shift()} ]`;
    }
    return {
      param: formParam,
      msg,
      value,
    };
  },
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/sessions', sessionRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Node.js listening on ${process.env.PORT || 3000} ...`);
});

module.exports = app;
