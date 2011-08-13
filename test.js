
/**
 * Module dependencies.
 */

var express = require('express');
var socketio = require('socket.io');

var app = module.exports = express.createServer(express.logger());
var dbg = console.log;
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

app.get("/user/:operation/:id?", function(req, res){
    res.send(req.params);
});

// Socket.IO
var sio = socketio.listen(app);

sio.sockets.on('connection', function(socket) {
  console.log(socket);
  socket.on('echo', function (x) {
    socket.emit('echo', x);
  });
});

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
