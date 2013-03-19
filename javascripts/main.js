/*
 
	You can now create a spinner using any of the variants below:
	 
	$("#el").spin(); // Produces default Spinner using the text color of #el.
	$("#el").spin("small"); // Produces a 'small' Spinner using the text color of #el.
	$("#el").spin("large", "white"); // Produces a 'large' Spinner in white (or any valid CSS color).
	$("#el").spin({ ... }); // Produces a Spinner using your custom settings.
	 
	$("#el").spin(false); // Kills the spinner.
 
*/
(function($) {
	$.fn.spin = function(opts, color) {
		var presets = {
			"tiny": { lines: 8, length: 2, width: 2, radius: 3 },
			"small": { lines: 8, length: 4, width: 3, radius: 5 },
			"large": { lines: 10, length: 8, width: 4, radius: 8 }
		};
		if (Spinner) {
			return this.each(function() {
				var $this = $(this),
				data = $this.data();

				if (data.spinner) {
					data.spinner.stop();
					delete data.spinner;
				}
				
				if (opts !== false) {
					if (typeof opts === "string") {
						if (opts in presets) {
							opts = presets[opts];
						} else {
							opts = {};
						}
						if (color) {
							opts.color = color;
						}
					}
					data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
				}
			});
		} else {
			throw "Spinner class not available.";
		}
	};
})(jQuery);

$(function() {
	var img = new Image(),
		context = document.getElementById("canvas").getContext("2d");
	
	$("#info").spin();
	
	showBrowserAndOsInfo();
	
	$(".thumbnails a").click(function(e) {
		e.preventDefault();
	});
	
	function showBrowserAndOsInfo() {
		var $thumbnail = $("#thumbnail").html(),
			template = Handlebars.compile($thumbnail),
			browserHtml = template({title: $.ua.browser.name, majorVersion: $.ua.browser.major, version: $.ua.browser.version}),
			osHtml = template({title: $.ua.os.name, majorVersion: $.ua.os.version, version: $.ua.os.version});
		
		$("#info").append(setBgColor(browserHtml)).append(setBgColor(osHtml)).spin(false);
	}

	function osType() {
		if ($.ua.os.name.indexOf("Mac") != -1) {
			return "osx";
		}
		
		return $.ua.os.name.toLowerCase();
	}

	function setBgColor(html) {
		img.src = $(html).find("img").attr("src");
		context.drawImage(img, 0, 0);
		var data = context.getImageData(0, 0, 1, 1).data;
		return $(html).find("li").css("background-color", rgba(data[0], data[1], data[2], data[3])).end();
	}
});