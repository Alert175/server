const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const mainRouter = require('./routes/main');
const newsRouter = require('./routes/news');
const objectsRouter = require('./routes/objects');
const stocksRouter = require('./routes/stocks');
const authRouter = require('./routes/auth');
const corpRouter = require('./routes/corp');
const reviewsRouter = require('./routes/reviews');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('corp/commercial', (req, res)=>{
	console.log('asdasd');
	next();
});
app.use(bodyParser.json({limit: '10Mb'}));

/* CORS */
const white_list = ['http://localhost:8080'];

app.use((req, res, next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Athorization');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATH, DELETE');
		return res.status(200).json({});
	}
	next();
});

app.use('/main', mainRouter);
app.use('/news', newsRouter);
app.use('/stocks', stocksRouter);
app.use('/info', objectsRouter);
app.use('/auth', authRouter);
app.use('/corp', corpRouter);
app.use('/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
