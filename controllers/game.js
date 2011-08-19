GameController = function(request, result) {
	BaseController.call(this, request, result);

	this.action_index = function() {
	  this.options = { };
	};

};

exports.controller = GameController;