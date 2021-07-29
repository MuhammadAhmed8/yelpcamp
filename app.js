var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var campgroundRouter = require("./routes/campground");
var campgroundReviewRouter = require('./routes/campgroundReviews');
const ejsMate = require('ejs-mate');
const session = require("express-session");
const flash = require("connect-flash");


var app = express();
var port = process.env.PORT || 3100;

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use(session({secret: "UHDueudfnsuhdsmcejifjecekcfefe4f4edf5ef5e4s7dwfe7s55fef8"}));
app.use(flash());
app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  
  res.locals.currentUser = req.session.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})
// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/auth', authRouter);
app.use(campgroundReviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.statusCode || 500);
  res.render('error', {err});
});



const conn = `mongodb+srv://maak:ln(lne)=0@cluster0.ucv4x.mongodb.net/yelpcamp?retryWrites=true&w=majority`;

   mongoose.connect(conn,{ useNewUrlParser: true })
  .then((result) => {
      app.listen(port,'0.0.0.0',()=>console.log(`App listening on port ${port}`));
  })
  .catch(err => {
      console.log("mongoose conn error! ",err);
})


module.exports = app;
