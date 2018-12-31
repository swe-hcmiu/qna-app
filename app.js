const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

const passportConfig = require('./config/passport/passport-config');
const mysqlConfig = require('./config/mysql/mysql-config');
const winstonConfig = require('./config/winston/winston-config');

const indexRouter = require('./routes/index');
const userAPIRouter = require('./routes/userAPI');
const authRouter = require('./routes/auth');
const sessionRouter = require('./routes/sessions');
const sessionAPIRouter = require('./routes/sessionAPI');
const ErrorController = require('./src/controller/ErrorController');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport middleware
app.use(passport.initialize());

// passport config
passportConfig(passport);

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

app.use(winstonConfig.consoleLogger, winstonConfig.infoFileLogger);

app.use('/', indexRouter);
app.use('/api/users', userAPIRouter);
app.use('/auth', authRouter);
app.use('/sessions', sessionRouter);
app.use('/api/sessions', sessionAPIRouter);

app.use(winstonConfig.errorFileLogger);

// all error controllers/handlers must be added below this line
app.use(ErrorController);

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

module.exports = app;
