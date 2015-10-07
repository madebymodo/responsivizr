app = (function(app) {
	app.boot = function() {
		app.updateSetsList();
		app.loadCurrentSet();
	};
	return app;
})(app);