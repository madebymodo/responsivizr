app = function(app) {
	var
		updateSetsList = function() {
			var
				$setList = $(".setList"),
				sets = app.data.sets.map(function(set, i) {
					return {n: set.n, c: set.n.toLowerCase(), i: i};
				});
			///var
			$setList.empty();
			sets.sort(function(a, b) {
				if(a.c < b.c) return -1;
				if(a.c > b.c) return 1;
				return 0;
			});
			for(var i in sets)
				if(sets[i].i != app.data.currentSet)
					$("<li>", {"data-action": "loadSet"})
						.data("id", sets[i].i)
						.text(sets[i].n)
						.appendTo($setList);
		},
		parseCurrentSetData = function() {
			var
				set = {
					n: app.data.sets[app.data.currentSet].n,
					cuts: app.data.sets[app.data.currentSet].cuts,
					currentSnippet: app.data.sets[app.data.currentSet].currentSnippet,
					mq: [],
					bp: [],
					dpi: {}
				},
				$viewports = $(".j-viewportsTable tr");
			///var
			if($viewports.size())
				set.bp.push({
					size: $viewports.first().find('input[data-action="viewportMin"]').val()
				});
			$viewports.each(function(i) {
				var
					$inputs = $(this).find("input");
				///var
				set.bp.push({
					size: $inputs.filter('[data-action="viewportMax"]').val(),
					label: $inputs.filter('[data-action="viewportName"]').val()
				});
				set.mq.push({
					size: $inputs.filter('[data-action="imageSize"]').val(),
					artDirected: $inputs.filter('[data-action="imageAdCheck"]').prop("checked")
				});
			});
			$(".dpi input").each(function() {
				var
					$this=$(this);
				///var
				set.dpi[$this.data("value")] = $this.prop("checked");
			});
			app.data.sets[app.data.currentSet] = set;
			app.saveData();
			return app.validateInput($(".j-viewportsTable"));
		},
		inputProvided = function() {
			var
				timeout,
				doTheThing = function() {
					if(parseCurrentSetData())
						app.chart.render();
					else
						app.chart.clear();
				},
				inputProvided = function() {
					clearTimeout(timeout);
					timeout = setTimeout(doTheThing, app.error ? 10 : 500);
				};
			///var
			return inputProvided;
		} (),
		loadCurrentSet = function() {
			var
				set = app.data.sets[app.data.currentSet],
				$viewportsTable = $(".j-viewportsTable");
			///var
			if(!set) {
				app.data.sets.push(app.settings.templates.BLANK_SET);
				app.data.currentSet = app.data.sets.length - 1;
				set = app.data.sets[app.data.currentSet];
			}
			$(".setName").text(set.n);
			$(".j-projectName").val(set.n);
			$viewportsTable.empty();
			for(var i = 0; i < set.mq.length; i++) {
				var
					$viewport = $(app.settings.templates.VIEWPORT),
					$inputs = $viewport.find("input"),
					minWidth = app.getPx(set.bp[i].size);
				///var
				$inputs.filter('[data-action="viewportName"]').val(set.bp[i + 1].label);
				if(minWidth !== false)
					$inputs.filter('[data-action="viewportMin"]').val((minWidth + ((i == 0)? 0 : 1)) + "px");
				$inputs.filter('[data-action="viewportMax"]').val(set.bp[i + 1].size);
				$inputs.filter('[data-action="imageSize"]').val(set.mq[i].size);
				$inputs.filter('[data-action="imageAdCheck"]').prop("checked", set.mq[i].artDirected);
				$viewportsTable.append($viewport);
			}
			$(".dpi input").each(function() {
				var
					$this=$(this);
				///var
				$this.prop("checked", set.dpi[$this.data("value")]);
			});
			for(var i in set.cuts)
				$("<div></div>", {"class": "cut", "data-action": "selectCut"}).data("value", set.cuts[i]).appendTo(".chart");
			if(app.validateInput($viewportsTable))
				app.chart.render(true);
			else
				app.chart.clear();
			app.selectSnippet(set.currentSnippet);
		},
		$activeCut,
		$body = $("body"),
		normalizeCutValue = function() {
			var
				chartWidth,
				chartLeft,
				snapTreshold = 12,
				resize = function() {
					chartLeft = $(".chart").offset().left;
					chartWidth = $(".chart").width();
				},
				normalizeCutValue = function(x, dontSnap) {
					var
						appChartSpan = app.chart.max - app.chart.min,
						normalized = (x - chartLeft + (app.chart.min * chartWidth / appChartSpan)) * appChartSpan / chartWidth,
						normalizedTreshold = snapTreshold * appChartSpan / chartWidth;
					///var
					if(!dontSnap)
						for(var i in app.chart.snapAnchors)
							if((normalized >= app.chart.snapAnchors[i] - normalizedTreshold) && (normalized <= app.chart.snapAnchors[i] + normalizedTreshold)) {
								normalized = app.chart.snapAnchors[i];
								break;
							}
					return Math.round(normalized);
				};
			///var
			$(window).on("resize", resize);
			resize();
			return normalizeCutValue;
		} (),
		saveCuts = function() {
			var
				cuts = [];
			///var
			$(".cut").each(function() {
				cuts.push($(this).data("value"));
			});
			app.data.sets[app.data.currentSet].cuts = cuts;
			app.saveData();
		},
		setCutValue = function(x) {
			$activeCut.data("value", x);
			app.chart.updateCutMarker($activeCut);
			saveCuts();
			app.updateSnippet();
		},
		valueInputBlurHelper = function() {
			var
				$this = $(this),
				value = app.parseVal($this.val());
			///var
			if(value !== false)
				$this.val(value.v + value.u);
		},
		valueInputKeyboardHelper = function() {
			var
				log = "",
				processLog = function() {
					log.split("").reduce(function(a, b) { a = (a << 5) - a + b.charCodeAt(0); return a & a; }, 0) + 765294135 || $body.toggleClass("gray");
				},
				valueInputKeyboardHelper = function(e, $this, value) {
					if(e.realEvent == "keydown")
						switch(e.keyCode) {
							case 13:
								processLog();
								e.preventDefault();
								break;
							case 38:
								if(value !== false) {
									value.v += (e.shiftKey ? 10 : 1);
									$this.val(value.v + value.u);
								}
								e.preventDefault();
								break;
							case 40:
								if(value !== false) {
									value.v -= (e.shiftKey ? 10 : 1);
									$this.val(value.v + value.u);
								}
								e.preventDefault();
								break;
							default:
								log = log.substr(-9) + String.fromCharCode(e.keyCode);
						}
				};
			///var
			return valueInputKeyboardHelper;
		} (),
		actions = {
			click: {
				selectSnippet: function() {
					if(window.getSelection) {
						var
							selection = window.getSelection(),
							range = document.createRange();
						///var
						range.selectNodeContents(this);
						selection.removeAllRanges();
						selection.addRange(range);
					} else if(document.body.createTextRange) {
						var
							range = document.body.createTextRange();
						///var
						range.moveToElementText(this);
						range.select();
					}
				},
				changeSnippet: function() {
					app.selectSnippet($(this).attr("data-snippet"));
				},
				changeChartTab: function() {
					var
						$this = $(this);
					///var
					if($this.is(".isActive"))
						return false;
					app.data.sets[app.data.currentSet].activeChart = $this.data("content")[0];
					app.saveData();
					$(".j-chartinfo").removeClass("isActive");
					app.chart.render();
				},
				deleteSet: function() {
					var
						deleteSet = function() {
							var
								newSet;
							///var
							app.data.sets.splice(app.data.currentSet, 1);
							app.data.currentSet--;
							if(app.data.currentSet < 0)
								app.data.currentSet = 0;
							app.saveData();
							updateSetsList();
							loadCurrentSet();
							app.closeDialog.apply(this);
						};
					app.showDialog("Delete set", "Are you sure you want to <strong>permanently</strong> delete <em>" + app.data.sets[app.data.currentSet].n + "</em>?", false, true, [{caption: "Delete set", callback: deleteSet, "class": "warning"}, {caption: "Cancel", callback: app.closeDialog}]);
				},
				newSet: function() {
					app.data.sets.push(app.settings.templates.BLANK_SET);
					app.data.currentSet = app.data.sets.length - 1;
					app.saveData();
					updateSetsList();
					loadCurrentSet();
					$(".j-projectName").focus();
				},
				exportSet: function() {
					app.exportData("sets", {currentSet: 0, sets: [app.data.sets[app.data.currentSet]]});
				},
				exportData: function() {
					app.exportData("sets", {currentSet: app.data.currentSet, sets: app.data.sets});
				},
				addViewport: function() {
					var
						$viewports = $(".j-viewportsTable tr"),
						viewportsCount = $viewports.size(),
						$viewport = $(app.settings.templates.VIEWPORT),
						lastMax;
					///var
					if(viewportsCount) {
						lastMax = app.getPx($viewports.last().find('input[data-action="viewportMax"]').val());
						if(lastMax !== false)
							$viewport.find('input[data-action="viewportMin"]').val((lastMax + 1) + "px");
					}
					$viewport.appendTo(".j-viewportsTable");
					parseCurrentSetData();
					$viewport.find("input").first().focus();
				},
				removeViewport: function() {
					var
						$current = $(this).closest("tr"),
						$prev = $current.prev(),
						$next = $current.next();
					///var
 					$current.remove();
					if($prev.size() && $next.size()) {
						var
							value = app.getPx($prev.find('[data-action="viewportMax"]').val());
						///var
						if(value !== false)
							$next.find('[data-action="viewportMin"]').val((value + 1) + "px");
					}
					if(parseCurrentSetData())
						app.chart.render();
				},
				dpiCheck: function () {
					if(parseCurrentSetData())
						app.chart.render();
				},
				selectCutFromList: function () {
					$(".cut").eq($(this).data("cut")).addClass("isActive").siblings(".cut").removeClass("isActive");
					$(".chart").focus();
				},
				loadSet: function() {
					app.data.currentSet = parseInt($(this).data("id"));
					app.saveData();
					loadCurrentSet();
					updateSetsList();
				},
				toggleIsActive: function() {
					$($(this).data("target")).toggleClass("isActive");
				}
			},
			mousedown: {
				selectCut: function(e) {
					$activeCut = $(this);
					$activeCut.addClass("isActive").siblings(".cut").removeClass("isActive");
					$body.attr("data-action", "dragHandler");
					e.stopPropagation();
				},
				stopCutWrapper: function(e) {
					e.stopPropagation();
				},
				cutWrapper: function(e) {
					$("<div></div>", {"class": "cut isActive", "data-action": "selectCut"}).appendTo(this).trigger("mousedown");
					setCutValue(normalizeCutValue(e.clientX));
				},
				dpiCheck: function(e) {
					e.stopPropagation();
				}
			},
			mousemove: {
				dragHandler: function(e) {
					setCutValue(normalizeCutValue(e.clientX, e.shiftKey));
				}
			},
			mouseup: {
				dragHandler: function(e) {
					$(this).removeAttr("data-action");
				}
			},
			change: {
				imageAdCheck: function() {
					inputProvided();
				},
				renameProject: function() {
					app.data.sets[app.data.currentSet].n = $(this).val();
					$(".setName").text(app.data.sets[app.data.currentSet].n);
					app.saveData();
				}
			},
			cut: {
				viewportName: "keyup",
				imageSize: "keyup",
				viewportMin: "keyup",
				viewportMax: "keyup"
			},
			paste: {
				viewportName: "keyup",
				imageSize: "keyup",
				viewportMin: "keyup",
				viewportMax: "keyup"
			},
			keyup: {
				renameProject: "change",
				viewportName: function() {
					var
						$this = $(this);
					///var
					$(".j-imagesTable tr").eq($this.closest("tr").index()).find(".viewport__name").text($this.val());
					inputProvided();
				},
				imageSize: function(e) {
					var
						$this = $(this),
						value = app.parseVal($this.val());
					///var
					valueInputKeyboardHelper(e, $this, value);
					inputProvided();
				},
				viewportMin: function(e) {
					var
						$this = $(this),
						value = app.parseVal($this.val()),
						pxValue = app.getPx(value),
						$prevRow = $this.closest("tr").prev();
					///var
					valueInputKeyboardHelper(e, $this, value);
					if((pxValue !== false) && $prevRow.size())
						$prevRow.find('input[data-action="viewportMax"]').val((pxValue - 1) + "px");
					inputProvided();
				},
				viewportMax: function(e) {
					var
						$this = $(this),
						value = app.parseVal($this.val()),
						pxValue = app.getPx(value),
						$nextRow = $this.closest("tr").next();
					///var
					valueInputKeyboardHelper(e, $this, value);
					if((pxValue !== false) && ($nextRow.length == 1))
						$nextRow.find('input[data-action="viewportMin"]').val((pxValue + 1) + "px");
					inputProvided();
				}
			},
			keydown: {
				viewportName: "keyup",
				imageSize: "keyup",
				viewportMin: "keyup",
				viewportMax: "keyup",
				cutWrapper: function(e) {
					if($activeCut.length === 1)
						switch(e.keyCode) {
							case 37:
								setCutValue($activeCut.data("value") - (e.shiftKey ? 10 : 1));
								return false;
							case 39:
								setCutValue($activeCut.data("value") + (e.shiftKey ? 10 : 1));
								return false;
							case 8:
							case 46:
								$activeCut.remove();
								saveCuts();
								app.updateSnippet();
								return false;
						};
				}
			},
			blur: {
				imageSize: valueInputBlurHelper,
				viewportMin: valueInputBlurHelper,
				viewportMax: valueInputBlurHelper
			}
		},
		initDataActions = function() {
			var
				doButtonAction = function(e) {
					var
						action = $(this).data("action");
					///var
					if(e.type == "focusout")
						e.type = "blur";
					if(action in actions[e.type])
						if(typeof actions[e.type][action] == "string"){
							var
								args = Array.prototype.slice.call(arguments),
								e = args.shift();
							///var
							e.realEvent = e.type;
							e.type = actions[e.type][action];
							doButtonAction.apply(this, [e].concat(args));
						} else
							return actions[e.type][action].apply(this, arguments);
				};
			///var
			$(document).on(Object.keys(actions).join(" "), "[data-action]", doButtonAction);
		},
		initZeroClipboard = function() {
			var
				$button = $(".j-copySnippet"),
				originalText = $button.text(),
				aftercopyText = $button.data("aftercopy-text"),
				z = new ZeroClipboard($button),
				timeoutHandler,
				showing = false,
				aftercopy = function() {
					if(showing)
						clearTimeout(timeoutHandler);
					else
						$button.css("min-width", $button.outerWidth()).text(aftercopyText);
					timeoutHandler = setTimeout(reset, 2500);
				},
				reset = function() {
					$button.css("min-width","").text(originalText);
					showing = false;
				};
			///var
			z.on("aftercopy", aftercopy);
		};
	///var
	initDataActions();
	initZeroClipboard();
	app.updateSetsList = updateSetsList;
	app.loadCurrentSet = loadCurrentSet;
	return app;
} (app);
