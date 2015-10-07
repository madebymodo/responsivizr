app = function(app) {
	var
		validateInput = function($viewportsTable) {
			var
				$names = $viewportsTable.find('[data-action="viewportName"]'),
				$mins = $viewportsTable.find('[data-action="viewportMin"]'),
				$maxes = $viewportsTable.find('[data-action="viewportMax"]'),
				$sizes = $viewportsTable.find('[data-action="imageSize"]'),
				pxes = [];
			///var
			app.clearErrors();
			$names.each(function() {
				var
					$this = $(this);
				///var
				if($.trim($this.val()) == "")
					app.throwRequired("Please name your viewport", $this);
			});
			$mins.each(function() {
				var
					$this = $(this),
					val = $this.val(),
					px = app.getPx(val);
				///var
				if(px === false)
					if($.trim(val) == "") {
						if(!$this.closest("tr").is(":first-child"))
							app.throwRequired("This field is required.", $this);
					} else
						app.throwInvalid("Use px or em", $this);
				pxes.push(px);
			});
			$maxes.each(function(i) {
				var
					$this = $(this),
					val = $this.val(),
					px = app.getPx(val);
				///var
				if(px === false)
					if($.trim(val) == "") {
						if(!$this.closest("tr").is(":last-child"))
							app.throwRequired("This field is required.", $this);
					} else
						app.throwInvalid("px only, please", $this);
				if((px !== false) && (pxes[i] !== false) && (px <= pxes[i])) {
					app.throwInvalid("or this value should be greater", $this);
					app.throwInvalid("Either this value should be smaller", $mins.eq(i));
				}
			});
			$sizes.each(function() {
				var
					$this = $(this),
					val = $this.val(),
					parsedVal = app.parseVal(val);
				///var
				if(parsedVal === false) {
					if($.trim(val) == "")
						app.throwRequired("This field is required.", $this);
					else
						if($this.closest("tr").is(":last-child") && ($.trim($maxes.last().val()) == ""))
							app.throwInvalid("Use px, or em", $this);
						else
							app.throwInvalid("Use px, em, % or vw", $this);
				} else {
					if($this.closest("tr").is(":last-child") && ((parsedVal.u == "%") || (parsedVal.u == "wv")) && ($.trim($maxes.last().val()) == ""))
						app.throwInvalid("When not declaring a viewport max-width, use only px or em for the last image", $this);
				}
			});
			return !app.error;
		};
	///var
	app.validateInput = validateInput;
	return app;
} (app);