GameController = function(request, result) {
	BaseController.call(this, request, result);

	this.action_index = function() {
	  this.options = { 'title': ': MOVE' };
	};

};

exports.controller = GameController;