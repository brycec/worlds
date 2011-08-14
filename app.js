
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
for(i in controllers)
{
	var controller_name = controllers[i].replace('.js', '');
	var controller_mdl = require(controller_name);
	app.get('/' + controller_name + '/:action?/:id?', function(request, result)
	{
		var controller = new controller_mdl.controller(request, result);

		// build action parameter
		if( !request.params.action ) {
			request.params.action = "indexAction";
		} else {
			request.params.action += 'Action';
		}
		// try to call the action
		if( typeof controller[request.params.action] == 'function' ) {
			controller[request.params.action]();
		} else {
			result.send(request.params.action + ' is not a controller action');
		}

		delete controller;
	});
}

//app.require('user');

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
