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

$(document).ready(function() {
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
		
		$("#info").append($(browserHtml)).append($(osHtml));
		
		$("img").imagesLoaded(function($images) {
			$images.each(function() {
				var context,
				img = new Image();
				
				try {
					$("body").prepend($("<canvas id='canvas' width='100' height='100' class='hidden'>"));
					context = document.getElementById("canvas").getContext("2d");
				} catch (e) {
					$("#canvas").remove();
					$("#info").spin(false);
					$(this).parents("li.tile").removeClass("not");
					return;
				}
				
				context.drawImage(this, 0, 0);
				
				var data = context.getImageData(5, 5, 100, 100).data;
				$("#canvas").remove();
				$("#info").spin(false);
				$(this).parents("li.tile").css("background-color", "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")").removeClass("not");
			});
		});
	}
});