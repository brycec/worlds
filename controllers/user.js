UserController = function(request, result) {
	BaseController.call(this, request, result);

	this.y = 0;

	this.action_index = function() {
	};

	this.action_test = function() {
		this.y += 1;
		this.send(this.y + '');
	};
};

exports.controller = UserController;