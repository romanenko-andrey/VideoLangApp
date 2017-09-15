
//модуль для работы с путями файлов и папок
var path = require('path');
//простой HTTP-сервер для одностраничного приложения
var express = require('express');


var qs = require('querystring');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
//выводит информацию в консоль сервера о полученных запросах
var logger = require('morgan');


//модуль подключения к базе данных MongoDB
var mongoose = require('mongoose');


//константы: путь к базе данных 
//и секретный ключ для генерации JSONWebTokens
var config = require('./config');

//Роутеры
var meRouter = require('./routes/meRouter'); 
var authRouter = require('./routes/authRouter');


mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

mongoose.connection.once('open', function(err) {
	console.log("Connected correctly to mongoDB server".green);
});

var app = express();

app.set('port', process.env.NODE_PORT || 3000);
app.set('host', process.env.NODE_IP || 'localhost');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}
app.use(express.static(path.join(__dirname, 'public')));

//роутеры для обслуживания запросов по указанным путям
app.use('/api/me', meRouter);
app.use('/auth', authRouter);
//app.use('/todolist', toDoListRouter);
//app.use('/queries', queryRouter);
//app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;