app = function(app) {
	var
		loadData = function() {
			app.data = JSON.parse(localStorage.getItem("responsivizr_data_v2"));
			if(!app.data || !app.data.sets)
				app.data = {
					currentSet: 0,
					sets: [
						app.settings.templates.BLANK_SET
					]
				};
		},
		importData = function() {
			if(location.hash.indexOf("#sets:") === 0) {
				var
					data;
				///var
				try {
					data = JSON.parse(atob(location.hash.substr("#sets:".length)));
				} catch(e) {
					return false;
				}
				if(confirm("Do you want to import " + (data.sets.length == 1 ? '"' + data.sets[0].n + '"' : data.sets.length + " sets") + "?")){
					app.data.sets = app.data.sets.concat(data.sets);
					app.data.currentSet = app.data.sets.length - data.sets.length + parseInt(data.currentSet);
					saveData();
					location.hash="";
					return true;
				}
			};
			return false;
		},
		saveData = function() {
			localStorage.setItem("responsivizr_data_v2", JSON.stringify(app.data));
		},
		exportData = function(kind, data) {
			var
				dataUrl = location.href.replace(/#.*$/, "") + "#" + kind + ":" + btoa(JSON.stringify(data));
			///var
			app.showDialog("Share", "You can share an image setup (complete with page and image breakpoints) via a special (and rather long) URL: <a href='" + dataUrl + "'>" + dataUrl + "</a>", false, true, [{caption: "Ok, I'm done", callback: app.closeDialog}]);
		};
	///var
	app.saveData = saveData;
	app.exportData = exportData;
	loadData();
	importData();
	$(window).on("hashchange", importData);
	return app;
} (app);