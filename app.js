
/**
 * Module dependencies.
 */

var express = require('express');
var socketio = require('socket.io');

var app = module.exports = express.createServer(express.logger());

// console dbg
dbg = console.log

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
//controller_cache = {};
controllers.forEach(function(c)
{
	var controller_name = c.replace('.js', '');
	app.get('/' + controller_name + '/:action?/:id?', function(request, result)
	{
		// load the controller from the cache
//		if (typeof controller_cache[controller_name] == 'undefined')
		{
			var controller_mdl = require(controller_name);
			var controller = new controller_mdl.controller(request, result);
//			controller_cache[controller_name] = controller;
		}
//		else
		{
//			controller = controller_cache[controller_name];
		}

		// build action parameter
		if (!request.params.action) {
			request.params.action = "action_index";
		} else {
			request.params.action = 'action_' + request.params.action;
		}
		// try to call the action
		if (typeof controller[request.params.action] == 'function') {
			controller[request.params.action]();
			// load the view automatically for that action
			controller.render(controller_name + '/' + request.params.action.replace('action_', '') + '.jade', 
			{
				locals: controller.options
			});
			delete controller;
		} else {
			result.send(request.params.action + ' is not a controller action');
		}
	});
});

// Socket.IO
sio = socketio.listen(app);

sio.sockets.on('connection', function(socket) {
	socket.on('char', function(pos)
	{
		socket.broadcast.emit('user connected', {id: socket.id, pos: pos});
	});
	
	socket.on('disconnect', function(){
		
	});
	
	socket.emit('world', {
		sprite: '/img/sprite.png'
	});
});

sio.sockets.on('connection', function(socket) {
  socket.on('echo', function (x) {
    socket.emit('echo', x);
  });
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
