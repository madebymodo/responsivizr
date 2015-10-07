window.app = function(app) {
	"use strict";
	@import "settings.js";
	@import "devicesList.js";
	@import "utils.js";
	@import "data.js";
	@import "dialogs.js";
	@import "errors.js";
	@import "validation.js";
	@import "rendering.js";
	@import "snippet.js";
	@import "ui.js";
	@import "boot.js";
	return app;
} (window.app || {});