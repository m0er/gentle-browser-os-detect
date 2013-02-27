function RunYQL(command, callback){
     callback_name = "__YQL_callback_"+(new Date()).getTime();
     window[callback_name] = callback;
     a = document.createElement('script');
     a.src = "http://query.yahooapis.com/v1/public/yql?q="
             +escape(command)+"&format=json&callback="+callback_name;
     a.type = "text/javascript";
     document.getElementsByTagName("head")[0].appendChild(a);
}

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
	$("#info").spin();
	
	var url = "http://www.useragentstring.com/?getJSON=all&uas=" + navigator.userAgent;
	RunYQL('select * from html where url=\"' + encodeURI(url) + '\"', function(data) {
		var json = $.parseJSON(data.query.results.body.p);		
		var $thumbnail = $("#thumbnail").html();
		var template = Handlebars.compile($thumbnail);
		
		var browserHtml = template({title: json.agent_name.toLowerCase(), version: json.agent_version}).trim();
		var osHtml = template({title: json.os_name.replace(/[0-9]| /g, '').toLowerCase(), version: json.os_versionNumber.replace(/_/g, '.')}).trim();
		
		$("#info").append($(browserHtml)).append($(osHtml)).removeClass("not").spin(false);

	});
	
	$(".thumbnails a").click(function(e) {
		e.preventDefault();
	});
	
});