
/**
 * Module dependencies.
 */

var express = require('express');
var socketio = require('socket.io');

var app = module.exports = express.createServer(express.logger());

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});


// Socket.IO
var sio = socketio.listen(app);

sio.sockets.on('connection', function(socket) {
  console.log('New socket. id: ' + socket.id);
  socket.on('echo', function (x) {
    socket.emit('echo', x);
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
