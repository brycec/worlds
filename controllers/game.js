GameController = function(request, result) {
	BaseController.call(this, request, result);
	var buffer = [];

	this.y = 0;
	this.action_index = function() {
		this.options = {
			'title' : ': MOVE'
		};
		
	}

};

exports.controller = GameController;