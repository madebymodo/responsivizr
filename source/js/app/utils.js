app = (function(app) {
	var
		parseVal = function(val) {
			var
				unit;
			///var
			val = $.trim(val);
			if(val.match(/^(\d+|\d*\.\d+)\s*px$/i))
				unit = "px";
			if(val.match(/^(\d+|\d*\.\d+)\s*em$/i))
				unit = "em";
			if(val.match(/^(\d+|\d*\.\d+)\s*vw$/i))
				unit = "vw";
			if(val.match(/^(\d+|\d*\.\d+)\s*%$/i))
				unit = "%";
			if(val.match(/^(\d+|\d*\.\d+)$/))
				unit = "px";
			if(unit)
				return {v: parseFloat(val), u: unit};
			return false;
		},
		getPx = function(val, container) {
			if(typeof val !== "object")
				val = parseVal(val);
			if(val === false)
				return false;
			if(val.u == "px")
				return val.v;
			if(val.u == "em")
				return val.v * 16;
			if((val.u == "%") || (val.u == "vw")) {
				container = getPx(container);
				if(container !== false)
					return container / 100 * val.v;
			}
			return false;
		},
		percentize = function(n) {
			var
				range = app.percentize.max - app.percentize.min;
			///var
			return range ? ((n - app.percentize.min) / range * 100) : 0;
		},
		htmlspecialchars = function(s) {
			return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
		};
	///var
	app.parseVal = parseVal;
	app.getPx = getPx;
	app.percentize = percentize;
	app.percentize.max = 100;
	app.percentize.min = 0;
	app.htmlspecialchars = htmlspecialchars;
	return app;
})(app);