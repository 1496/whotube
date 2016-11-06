var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

/*--------------------------------
mogooseの処理(スキーマの定義)
--------------------------------*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var videoSchema = new Schema({
  youtubeID:{type:String},
  title:{type:String},
  played:{type:Boolean,default:false},
  // fav:{type:Number,default:0},
  // dis:{type:Number,default:0},
  // viewinfo:{type:Number,default:0},
  // comment:{type:Array,default:[]},
  createTime:{type:Date,default:Date.now}
});
mongoose.model('Video',videoSchema);

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var player = require('./routes/player');
var playlist = require('./routes/playlist');






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
app.use('/player', player);
app.use('/playlist', playlist);



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
