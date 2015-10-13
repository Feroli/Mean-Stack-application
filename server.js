var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
// var multer = require('multer');
// var upload = multer(); // for parsing multipart/form-data
var stylus = require('stylus');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile (str, path) {
  return stylus(str).set('filename', path)
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile
}));
app.use(express.static(__dirname + '/public'));

// connect to Mongod running server
if (env === 'development') {
  mongoose.connect('mongodb://localhost/multivision');
} else {
  mongoose.connect('mongodb://fernando:multivision@ds035333.mongolab.com:35333/multivision');
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
  console.log('multivision db-opened');
});

//creating schema
var messageSchema = mongoose.Schema({
  message: String
});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc) {
  mongoMessage = messageDoc.message;
});

app.get('/partials/:partialPath', function(req, res) {
  res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req, res) {
  res.render('index', {
    mongoMessage: mongoMessage
  });
});

var port = 3030;
app.listen(process.env.PORT || por);
console.log('Listening on port ' + port + '...');
