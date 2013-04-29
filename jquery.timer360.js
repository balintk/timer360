(function($) {
	
	$.fn.timer360 = function (options) {
		var settings = jQuery.extend({
			radius				: 15.5,				// radius of arc
			strokeWidth		: 3,					// the width of the stroke
			strokeColor		: "#477050",	// the color of the stroke
			fillColor			: "#8ac575",  // the fill color
			intervals			: [5,25,30],	// the options for the timer
			interval      : 10,         // allowed to have single timer.
			seconds				: false,			// if false then interval is considered minutes
			loop          : false,      // timer will loop if true
			onComplete		: new Function
		}, options);
		
		settings.width = (settings.radius * 2) + (settings.strokeWidth * 2)
		settings.height = settings.width
		settings.arcX = settings.radius + settings.strokeWidth
		settings.arcY = settings.arcX
		
		return this.each(function () {
			var $this = $(this);
			var interval = settings.interval;
			var start = null;
			
			// Create the canvas
			var $canvas = $('<canvas id="360timer_' + $this.attr("id") + '" width="' +
											settings.width + '" height="' + 
											settings.height + '"></canvas>');
			var canvas = $canvas[0];

      $this.prepend(canvas);

			if(settings.intervals != false) {
   			var intervalItems = '';
   			
  			for (x in settings.intervals) {
  				intervalItems += '<li>' + settings.intervals[x] + '</li>'
  			}
	
  			var $timerSelect = $('<div class="timer_select">' +
  													'<ul>' + intervalItems + '</ul>' + '</div>');
      
        $this.append($timerSelect.hide()).css({position:'relative'}).click(function () {
  				$timerSelect.toggle();
  			});
  	 
  			$timerSelect.find('li').click(function () {
  				if (interval) { clearInterval(interval) }
  				start = start_clock($(this));
  			});
      }
      
      if(settings.intervals == false && start == null) {
        start = start_clock(null);
      }
						
			// get context for the canvas and create the initial circle
			var pen = canvas.getContext('2d');
			pen.lineWidth = settings.strokeWidth;
      pen.strokeStyle = settings.strokeColor;
      pen.fillStyle = settings.fillColor;
      pen.clearRect(0,0,settings.width, settings.height);
			drawTimer(Math.PI*2, false);
			
			// attach onclick handler
			$canvas.click(function (e) {
				e.preventDefault();
			});
			
			function tick (amount) {
				interval = setInterval(function() {
					var now = new Date();
	        var secondsElapsed = Math.round((now.getTime() - start.getTime())/1000);
					var incrementAmount = (Math.PI*2)/((amount*60)*1000);
					
          pen.clearRect(0,0,settings.width, settings.height);
					drawTimer(Math.PI*2, false);
          if ((secondsElapsed) < (amount*60)) {
						drawTimer(incrementAmount*(secondsElapsed*1000), true);
          } else {
						drawTimer(Math.PI*2, true)
            clearInterval(interval);
						settings.onComplete();
						if(settings.loop == true) {
  						clearInterval(interval)
						  start = start_clock(null);
						}
          }
				}, 1000);
			}
			
			function drawTimer (endAngle, drawStroke) {
				pen.beginPath();
        pen.arc(settings.arcX,settings.arcY,settings.radius,endAngle,0,true);
				pen.fill();
				if (drawStroke) { pen.stroke(); }
			}
			
			function start_clock(clock) {
  			var start = new Date();
  		    if(settings.intervals != false && clock != null) {
    			 tick(settings.seconds ? clock.text()/60 : clock.text());
    		  } else {
    		   tick(settings.seconds ? settings.interval/60 : settings.interval); 
    		  }
  			return start;
			}
			
		});
				
	};
	
})(jQuery);

