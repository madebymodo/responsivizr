app = function(app) {
	var
		tabsData,
		chartData,
		lastTabsData,
		updateTabsData = function() {
			var
				set = app.data.sets[app.data.currentSet],
				mq = set.mq,
				bp = set.bp,
				labels = [],
				labelsAd = [],
				contents = [],
				contentsAd = [],
				activeChart = app.data.sets[app.data.currentSet].activeChart;
			///var
			for(var i in mq)
				if(mq[i].artDirected) {
					labelsAd.push(bp[parseInt(i) + 1].label + " (Art Directed)");
					contentsAd.push([i]);
				} else {
					labels.push(bp[parseInt(i) + 1].label);
					contents.push(i);
				}
			if(contents.length > 0){
				contents = [contents].concat(contentsAd);
				labels = [labels.join(" + ")].concat(labelsAd);
			} else {
				contents = contentsAd;
				labels = labelsAd;
			}
			tabsData = {
				activeTab: 0,
				tabs: []
			};
			for(var i in labels) {
				tabsData.tabs.push({
					content: contents[i],
					label: labels[i]
				});
				if(contents[i].indexOf(activeChart) !== -1)
					tabsData.activeTab = i;
			}
		},
		drawTabs = function() {
			var
				$chartsList = $(".chartsList");
			///var
			return function() {
				var
					newTabsData = JSON.stringify(tabsData);
				///var
				if(lastTabsData === newTabsData)
					return false;
				$chartsList.empty();
				for(var i in tabsData.tabs)
					$("<li></li>", {"class": ((i == tabsData.activeTab) ? "isActive" : "")}).text(tabsData.tabs[i].label).data("content", tabsData.tabs[i].content).attr("data-action","changeChartTab").appendTo($chartsList);
				lastTabsData = newTabsData;
			};
		}(),
		updateChartData = function() {
			var
				set = app.data.sets[app.data.currentSet],
				mqs = tabsData.tabs[tabsData.activeTab].content,
				minDpi = Infinity,
				maxDpi = 0,
				min = Infinity,
				max = 0,
				oldChartData = JSON.stringify(chartData);
			///var
			if(app.error)
				return false;
			chartData = {
				minWidth: 0,
				maxWidth: 0,
				artDirected: false,
				images: [],
				dpis: []
			};
			for(var i in mqs) {
				var
					mq = set.mq[mqs[i]],
					from = set.bp[mqs[i] * 1],
					to = set.bp[mqs[i] * 1 + 1],
					fromSize = app.getPx(from.size),
					toSize = app.getPx(to.size),
					size = app.parseVal(mq.size),
					tmpMin = app.getPx(size, fromSize),
					tmpMax = app.getPx(size, toSize);
				///var
				if(mq.artDirected)
					chartData.artDirected = true;
				chartData.images.push({
					width: size,
					start: tmpMin,
					end: tmpMax,
					label: to.label
				});
				if(min > tmpMin)
					min = tmpMin;
				if(max < tmpMax)
					max = tmpMax;
			}
			for(var dpi in set.dpi)
				if(set.dpi[dpi]) {
					chartData.dpis.push(dpi);
					if(minDpi > dpi)
						minDpi = dpi;
					if(maxDpi < dpi)
						maxDpi = dpi;
				}
			app.chart.snapAnchors = [];
			for(var i in chartData.images)
				for(var j in chartData.dpis)
					app.chart.snapAnchors.push(chartData.images[i].end * chartData.dpis[j]);
			app.chart.min = app.percentize.min = chartData.minWidth = min * minDpi;
			app.chart.max = app.percentize.max = chartData.maxWidth = max * maxDpi;
			return (oldChartData != JSON.stringify(chartData));
		},
		drawBars = function () {
			var
				$images = $(".images"),
				makeBar = function(img, dpi) {
					var
						$bar = $("<div></div>", {"class": "@" + dpi + "x"}),
						start = app.percentize(img.start * dpi);
					///var
					$bar.text(img.label);
					if(img.start === img.end) {
						$bar.css("left", start + "%");
						$bar.addClass("fixedWidth");
						$bar.attr("title", "Width: " + img.width.v + img.width.u + "\nActual width: " + Math.round(img.start * dpi) + "px");
					} else {
						$bar.css({
							left: start + "%",
							width: (app.percentize(img.end * dpi) - start) + "%"
						});
						$bar.attr("title", "Width: " + img.width.v + img.width.u + "\nActual width range: from " + Math.round(img.start * dpi) + "px to " + Math.round(img.end * dpi) + "px");
					}
					return $bar;
				},
				drawBars = function() {
					$images.css("min-height", $images.height()).empty();
					for(var j in chartData.dpis)
						for(var i in chartData.images)
							$images.append(makeBar(chartData.images[i], chartData.dpis[j]));
					$images.css("min-height", "");
				};
			///var
			return drawBars;
		} (),
		drawDevices = function() {
			var
				drawDevices = function() {

					for(var i in app.chart.devices) {

					}
				};
			///var
			return drawDevices;
		} (),
		drawMarkers = function() {
			var
				$markers = $(".markers"),
				lastMarkersInterval,
				lastMarkersCount,
				lastMin,
				lastMax,
				makeMarker = function (position) {
					$("<div></div>").css("left", app.percentize(position) + "%").append("<span>" + Math.round(position) + "</span>").appendTo($markers);
				},
				drawMarkers = function(force) {
					var
						markersInterval = Math.ceil(chartData.maxWidth * app.settings.markers.minimumInterval / $markers.width() / app.settings.markers.rounding) * app.settings.markers.rounding,
						markersCount = markersInterval ? Math.floor((chartData.maxWidth - chartData.minWidth) / markersInterval) : 0;
					//var
					if(!app.error && (force || (lastMarkersInterval != markersInterval) || (lastMarkersCount != markersCount) || (lastMax != chartData.maxWidth) || (lastMin != chartData.minWidth))) {
						lastMarkersInterval = markersInterval;
						lastMarkersCount = markersCount;
						lastMax = chartData.maxWidth;
						lastMin = chartData.minWidth;
						$markers.empty();
						makeMarker(chartData.minWidth);
						if(markersInterval > 0)
							for(var i = Math.ceil(chartData.minWidth / app.settings.markers.rounding) * app.settings.markers.rounding; i < chartData.maxWidth; i += markersInterval)
									makeMarker(i);
						makeMarker(chartData.maxWidth);
					}
				};
			///var
			return drawMarkers;
		} (),
		render = function(force) {
			updateTabsData();
			drawTabs();
			if(updateChartData() || force) {
				drawBars();
				drawDevices();
				if(chartData.artDirected)
					$(".chart").removeAttr("data-action");
				else {
					$(".cut").each(function() {
						updateCutMarker($(this));
					});
					$(".chart").attr("data-action", "cutWrapper");
				}
				app.updateSnippet();
			}
			drawMarkers(force);
		},
		clear = function() {
			chartData = lastTabsData = false;
			$(".markers, .images, .chartsList").empty();
			$(".chart").removeAttr("data-action");
			app.updateSnippet();
		},
		updateCutMarker = function($cut) {
			$cut.css({left: app.percentize($cut.data("value")) + "%"}).attr("title", $cut.data("value") + "px");
		};
	///var
	app.chart = {
		render: render,
		renderDevices: drawDevices,
		updateCutMarker: updateCutMarker,
		clear: clear,
		min: 0,
		max: 100,
		snapAnchors: [],
		devices: []
	};
	$(window).on("resize", drawMarkers);
	return app;
} (app);
