var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var flash = require('express-flash');

var session = require('express-session');

const dotenv = require('dotenv');


dotenv.config({ path: './.env'}); 


//separamos en partes por buenas practicas las secciones
var indexRouter = require('./routes/index');
var productosRouter = require('./routes/productos');
var nosotrosRouter = require('./routes/nosotros');
var loginRouter = require('./routes/login');
var registroRouter = require('./routes/registro');
var recomendarRouter = require('./routes/recomendar');
var AuthRouter = require('./routes/auth');
var VideoRouter = require('./routes/videojuegos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//llamamos la variables para redireccionarlo

app.use('/', indexRouter);
app.use('/productos', productosRouter);
app.use('/nosotros', nosotrosRouter);
app.use('/login', loginRouter);
app.use('/registro', registroRouter);
app.use('/recomendar', recomendarRouter);
app.use('/auth', AuthRouter);
app.use('/videojuegos', VideoRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(req, res){
  res.status(404).render("error", { title: "No encontrado" });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(404).render('error', { error: err });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
