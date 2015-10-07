app = (function(app) {
	app.settings = {
		markers: {
			rounding: 50,
			minimumInterval: 100
		},
		templates: {
			BLANK_SET: {n: "Untitled", activeChart: 0, mq: [{}], bp: [{}, {}], dpi: {"1": true, "2": true}},
			VIEWPORT: $(".j-viewportTemplate").html()
		}
	};
	return app;
})(app);
