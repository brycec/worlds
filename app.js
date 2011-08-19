
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



// Routes -- generic
app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// Routes -- controllers
BaseController = function(request, result) {
	this.request = request;
	this.result = result;

	this.render = function(template, options) {
		return this.result.render(template, options);
	};

	this.send = function(content) {
		return this.result.send(content);
	};

	this.extend = function(child) {
		for ( var p in child)
			this[p] = child[p];
		return this;
	};

};

require.paths.push('controllers');
var fs = require('fs');
var controllers = fs.readdirSync('controllers');
controllers.forEach(function(c)
{
	var controller_name = c.replace('.js', '');
	var controller_mdl = require(controller_name);
	app.get('/' + controller_name + '/:action?/:id?', function(request, result)
	{
		var controller = new controller_mdl.controller(request, result);

		// build action parameter
		if( !request.params.action ) {
			request.params.action = "action_index";
		} else {
			request.params.action = 'action_' + request.params.action;
		}
		// try to call the action
		if( typeof controller[request.params.action] == 'function' ) {
			controller[request.params.action]();
			// load the view automatically for that action
			controller.render(controller_name + '/' + request.params.action.replace('action_', '') + '.jade', 
			{
					locals: controller.options
			});
		} else {
			result.send(request.params.action + ' is not a controller action');
		}

		delete controller;
	});
	return true;
});

//app.require('user');
dbg = console.log
// Socket.IO
sio = socketio.listen(app);


sio.sockets.on('connection', function(socket) {
	socket.on('char', function(pos)
	{
		socket.broadcast.emit('user connected', {id: socket.id, pos: pos});
	})
});

sio.sockets.on('connection', function(socket) {
  console.log('New socket. id: ' + socket.id);
  socket.on('echo', function (x) {
    socket.emit('echo', x);
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
