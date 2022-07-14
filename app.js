const createError   = require('http-errors');
var cors = require('cors');
const express       = require("express");
const path          = require("path");
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const expressValidator = require('express-validator');
const flash         = require('express-flash');
const session       = require('express-session');
const bodyParser    = require('body-parser');

const mysql         = require('mysql2');
const connection    = require('./database/db');

const authRouter    = require('./routes/route');

const app = express();
app.use(cors());
// view engine setup
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null }
}))

app.use(flash());
app.use(expressValidator());

app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

//error handler
app.use(function(err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(5000,function(){
    console.log('Node app is running on port 5000');
}); 
module.exports = app;