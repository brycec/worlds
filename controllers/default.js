DefaultController = function(request, result) {
	BaseController.call(this, request, result);

	this.action_index = function() {
	  this.options = { title : 'sdfsadfsd' };
	};

};

exports.controller = DefaultController;