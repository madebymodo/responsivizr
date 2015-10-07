app = (function(app) {
	var
		throwRequired = function(e, $where) {
 			$where.parent().attr("data-required-message", e).addClass("isRequiredAndEmpty");
			app.error = true;
		},
		throwInvalid = function(e, $where) {
 			$where.parent().attr("data-invalid-message", e).addClass("isInvalid");
			app.error = true;
		},
		clearErrors = function() {
			$(".isInvalid").removeAttr("data-invalid-message").removeClass("isInvalid");
			$(".isRequiredAndEmpty").removeAttr("data-required-message").removeClass("isRequiredAndEmpty");
			app.error = false;
		};
	///var		
	app.error = false;
	app.throwRequired = throwRequired;
	app.throwInvalid = throwInvalid;
	app.clearErrors = clearErrors;
	return app;
})(app);