(function($) {

  'use strict';

  $.fn.timer360 = function (options) {
    var settings = jQuery.extend({
      radius        : 15.5,       // radius of arc
      strokeWidth   : 3,          // the width of the stroke
      strokeColor   : '#477050',  // the color of the stroke
      fillColor     : '#8ac575',  // the fill color
      interval      : 10,         // allowed to have single timer.
      onComplete    : new Function
    }, options);

    settings.width = (settings.radius * 2) + (settings.strokeWidth * 2);
    settings.height = settings.width;
    settings.arcX = settings.radius + settings.strokeWidth;
    settings.arcY = settings.arcX;

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

      start = startClock(null);

      // Get context for the canvas and create the initial circle.
      var pen = canvas.getContext('2d');
      pen.lineWidth = settings.strokeWidth;
      pen.strokeStyle = settings.strokeColor;
      pen.fillStyle = settings.fillColor;
      pen.clearRect(0,0,settings.width, settings.height);
      drawTimer(Math.PI*2, false);

      var tick = function (amount) {
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
          }
        }, 1000);
      }

      var drawTimer = function (endAngle, drawStroke) {
        pen.beginPath();
        pen.arc(settings.arcX,settings.arcY,settings.radius,endAngle,0,true);
        pen.fill();
        if (drawStroke) { pen.stroke(); }
      }

      var startClock = function (clock) {
        var start = new Date();
        tick(settings.interval/60);
        return start;
      }
    });
  };

})(jQuery);
