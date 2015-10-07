app = function(app) {
	var
		closeDialog = function() {
			$(this).closest(".dialog__wrapper").remove();
		},
		buttonClick = function() {
			var
				$this = $(this),
				callback = $this.data("callback"),
				$input = $this.closest(".dialog__wrapper").find(".dialog__input");
			///var
			if(typeof callback === "function")
				callback.apply(this, ($input.size() ? [$input.val()] : []));
		},
		showDialog = function(/* STRING: */ title, /* STRING: */ text, /* false|true|STRING */ prompt, /* true|false|FUNCTION(answer): */ close, /* false|[{caption: STRING, callback: FUNCTION(answer) [, class: STRING]}, ...] */ buttons) {
			var
				keyup = function(e) {
					if(e.keyCode == 13)
						buttonClick.apply(this);
				},
				$wrapper = $("<div></div>", {"class": "dialog__wrapper"}),
				$dialog = $("<div></div>", {"class": "dialog"}),
				$input = (prompt === false) ? false : $("<input>", {"class": "dialog__input", type: "text"});
			///var
			if(prompt === null)
				prompt = false;
			if(close === null)
				close = true;
			if((buttons === null) || (buttons === false))
				buttons = [];
			if(close !== false)
				$dialog.append($("<div></div>", {"class": "dialog__close"}).data("callback", ((typeof close === "function") ? close : closeDialog)).on("click", buttonClick));
			$dialog
				.append($("<h4></h4>", {"class": "dialog__title"}).text(title))
				.append($("<div></div>", {"class": "dialog__text"}).html(text));
			if(typeof prompt === "string")
				$input.val(prompt);
			if(prompt !== false)
				$dialog.append($input);
			for(var i in buttons) {
				$dialog.append($("<button></button>", {"class": "dialog__button" + ((typeof buttons[i].class === "string") ? " " + buttons[i].class : "")}).text(buttons[i].caption).data("callback", buttons[i].callback).on("click", buttonClick));
				if(buttons[i].default && (prompt !== false))
					$input.data("callback", buttons[i].callback).on("keyup", keyup);
			}
			$wrapper
				.append($dialog)
				.appendTo("body");
			if(prompt !== false)
				$input.focus();
		};
	///var
	app.closeDialog = closeDialog;
	app.showDialog = showDialog;
	return app;
} (app);
