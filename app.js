const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

// const passportConfig = require('./src/config/passport-config');
// const mysqlConfig = require('./src/config/mysql-config');
const winstonConfig = require('./src/config/winston-config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
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

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
}));

// // Passport init
// app.use(passport.initialize());
// app.use(passport.session());

// // Connect Flash
app.use(flash());

// passport middleware
app.use(passport.initialize());

// passport config
require('./src/config/passport-config')(passport);

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

// enble CRORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(winstonConfig.consoleLogger, winstonConfig.infoFileLogger);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', userAPIRouter);
app.use('/auth', authRouter);
app.use('/sessions', sessionRouter);
app.use('/api/sessions', sessionAPIRouter);

app.use(ErrorController);

app.use(winstonConfig.errorFileLogger);

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

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Node.js listening on ${process.env.PORT || 5000} ...`);
});

const io = require('socket.io')(server);
const sessionChannel = require('./src/socket-cotroller/session')(io);

module.exports = app;
