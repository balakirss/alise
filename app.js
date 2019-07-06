require('dotenv');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require("uglify-js");
var fs = require('fs');
var passport = require('passport');

require('./app_api/models/db');
require('./app_api/config/passport');


var createError = require('http-errors');
// расположение ПУТИ
var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');

var usersRouter = require('./app_server/routes/users');

var app = express();

// view engine setup расположение ПРЕДСТАВЛЕНИЯ
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'jade');

var appClientFiles = [
  'app_client/app.js',
  'app_client/home/home.controller.js',
  'app_client/home/common/services/loc8rData.service.js',
  'app_client/home/common/services/geolocation.service.js',
  'app_client/home/common/directive/ratingStars/ratingStars.directive.js',
  'app_client/home/common/filters/formatDistance.filter.js'
  ];
//var uglified = uglifyJs.minify(appClientFiles);

//fs.writeFile('public/angular/loc8r.min.js', uglified.code, function (err) {
//  if(err){
//    console.log(err);
//  } else {
//    console.log('Script generated and saved: loc8r.min.js');
//  }

//});




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//app.use('/', routes);
app.use('/api', routesApi);

app.use('/users', usersRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function (req, res) {
  res.sendfile(path.join(__dirname, 'app_client','index.html'));

});
module.exports = app;
